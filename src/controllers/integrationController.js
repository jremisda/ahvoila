// ... existing imports ...
const { updateAnalytics } = require('../services/analyticsService');

// ... existing code ...

exports.getIntegrationStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('integrations');
    const status = {
      googleDrive: !!user.integrations.googleDrive,
      notion: !!user.integrations.notion,
      slack: !!user.integrations.slack,
      zoom: !!user.integrations.zoom,
      googleMeet: !!user.integrations.googleMeet
    };
    res.json(status);
  } catch (error) {
    next(error);
  }
};

exports.getIntegrationPermissions = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('integrations');
    const permissions = {
      googleDrive: user.integrations.googleDrive ? JSON.parse(user.integrations.googleDrive).scope.split(' ') : [],
      notion: user.integrations.notion ? ['read', 'write'] : [], // Notion doesn't provide granular scopes, so we assume full access if connected
      slack: user.integrations.slack ? JSON.parse(user.integrations.slack).scope.split(',') : [],
      zoom: user.integrations.zoom ? ['meeting:read', 'meeting:write'] : [], // Zoom permissions would depend on what you requested during OAuth
      googleMeet: user.integrations.googleMeet ? JSON.parse(user.integrations.googleMeet).scope.split(' ') : []
    };
    res.json(permissions);
  } catch (error) {
    next(error);
  }
};

exports.revokeIntegration = async (req, res, next) => {
  try {
    const { integration } = req.params;
    const user = await User.findById(req.user._id);
    
    if (user.integrations[integration]) {
      // Revoke the token with the service provider
      // This would vary depending on the service
      // For example, for Google:
      if (integration === 'googleDrive' || integration === 'googleMeet') {
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.revokeToken(JSON.parse(user.integrations[integration]).access_token);
      }
      
      user.integrations[integration] = null;
      await user.save();
      res.json({ message: `${integration} integration revoked successfully` });
    } else {
      res.status(400).json({ message: `${integration} is not connected` });
    }
  } catch (error) {
    next(error);
  }
};

// ... existing code ...

exports.searchAcrossIntegrations = async (req, res, next) => {
  try {
    const { query } = req.query;
    const userId = req.user._id;
    const user = await User.findById(userId);

    const searchResults = {};
    const startTime = Date.now();

    if (user.integrations.googleDrive) {
      try {
        searchResults.googleDrive = await searchGoogleDrive(query, userId);
        await updateAnalytics(userId, 'googleDrive', 'query', Date.now() - startTime);
      } catch (error) {
        if (error.message === 'Token expired') {
          await refreshGoogleToken(userId, 'googleDrive');
          searchResults.googleDrive = await searchGoogleDrive(query, userId);
        } else {
          await updateAnalytics(userId, 'googleDrive', 'query', Date.now() - startTime, true);
          throw error;
        }
      }
    }

    // Implement similar error handling, token refresh, and analytics for other services

    res.json(searchResults);
  } catch (error) {
    logger.error('Error searching across integrations:', error);
    next(error);
  }
};

// ... other methods ...