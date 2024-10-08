# Ahvoila API Documentation

## Authentication

...

## Protected Routes

All routes except for authentication routes require a valid access token in the `accessToken` cookie.

### Documents

#### Summarize Document
- **URL**: `/api/documents/summarize`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "text": "Document content to summarize",
    "title": "Document Title"
  }
  ```
- **Response**: 
  - Success (200): Returns summarized document with extracted keywords
  - Error (400): Validation errors

#### Get All Documents
- **URL**: `/api/documents`
- **Method**: `GET`
- **Response**:
  - Success (200): Returns an array of user's documents (without content)
  - Error (500): Internal server error

#### Get Document by ID
- **URL**: `/api/documents/:id`
- **Method**: `GET`
- **Response**:
  - Success (200): Returns the full document
  - Error (404): Document not found
  - Error (500): Internal server error

#### Search Documents
- **URL**: `/api/documents/search`
- **Method**: `GET`
- **Query Parameters**:
  - `query`: Search query string
  - `page`: Page number (default: 1)
  - `limit`: Number of results per page (default: 10)
- **Response**:
  - Success (200):
    ```json
    {
      "results": [
        {
          "_id": "documentId",
          "title": "Document Title",
          "score": 1.5,
          "excerpts": [
            {
              "text": "...relevant excerpt with highlighted search terms...",
              "position": 100
            }
          ],
          "documentId": "documentId"
        }
      ],
      "currentPage": 1,
      "totalPages": 5,
      "totalResults": 50
    }
    ```
  - Error (500): Internal server error

...