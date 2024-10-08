const Document = require('./models/Document');
const { verifyToken } = require('./utils/auth');

module.exports = function(io) {
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    try {
      const decoded = verifyToken(token);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join-document', async (documentId) => {
      socket.join(documentId);
      console.log(`Client joined document: ${documentId}`);
    });

    socket.on('leave-document', (documentId) => {
      socket.leave(documentId);
      console.log(`Client left document: ${documentId}`);
    });

    socket.on('document-change', async (data) => {
      try {
        const { documentId, changes } = data;
        const document = await Document.findById(documentId);
        
        if (!document) {
          return socket.emit('error', 'Document not found');
        }

        // Check if user has write permission
        const userPermission = document.sharedWith.find(share => share.user.toString() === socket.userId);
        if (document.createdBy.toString() !== socket.userId && (!userPermission || userPermission.permission !== 'write')) {
          return socket.emit('error', 'You do not have permission to edit this document');
        }

        // Apply changes to the document
        document.content = changes.content;
        document.updatedAt = new Date();
        await document.save();

        // Broadcast changes to all clients in the room except the sender
        socket.to(documentId).emit('document-updated', changes);
      } catch (error) {
        console.error('Error updating document:', error);
        socket.emit('error', 'Failed to update document');
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });
};