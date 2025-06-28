# Profile Picture API Documentation

## Overview
This API now supports user profile pictures with automatic default random avatars and the ability to upload custom profile pictures.

## Features
- **Default Random Avatars**: New users automatically get a random profile picture from DiceBear API
- **Custom Upload**: Users can upload their own profile pictures (JPG, JPEG, PNG, GIF, WebP)
- **File Management**: Old profile pictures are automatically deleted when new ones are uploaded
- **Image Serving**: Uploaded images are served through a dedicated route

## API Endpoints

### 1. Register User (with default profile picture)
**POST** `/api/user/register`

**Request Body:**
```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user" // optional, defaults to "user"
}
```

**Response:**
```json
{
    "message": "User john_doe has been created succesfully",
    "profilePicture": "https://api.dicebear.com/7.x/avataaars/svg?seed=abc123"
}
```

### 2. Upload Profile Picture
**POST** `/api/user/uploadProfilePicture`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Request Body:**
```
profilePicture: <image_file> (max 2MB)
```

**Response:**
```json
{
    "message": "Profile picture uploaded successfully",
    "profilePicture": "/uploads/john_doe_abc123/profile/profile-image-1234567890.jpg"
}
```

### 3. Get User Profile
**GET** `/api/user/profile`

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response:**
```json
{
    "message": "User profile retrieved successfully",
    "user": {
        "id": "uuid",
        "username": "john_doe",
        "email": "john@example.com",
        "role": "user",
        "profilePicture": "/uploads/john_doe_abc123/profile/profile-image-1234567890.jpg",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
}
```

### 4. Serve Uploaded Images
**GET** `/api/user/uploads/:userFolder/:type/:filename`

**Example:**
```
GET /api/user/uploads/john_doe_abc123/profile/profile-image-1234567890.jpg
```

## File Storage Structure
```
uploads/
├── username_random123/
│   ├── profile/
│   │   └── uploaded-profile-picture.jpg1234567890
│   └── products/
│       └── product-images/
```

## Default Profile Pictures
- Uses DiceBear API (https://dicebear.com/)
- 8 different avatar styles: avataaars, big-ears, bottts, croodles, fun-emoji, micah, miniavs, personas
- Randomly selected for each new user
- Stored as URLs in the database

## File Upload Restrictions
- **File Types**: JPG, JPEG, PNG, GIF, WebP
- **File Size**: Maximum 2MB for profile pictures
- **File Count**: 1 file per upload

## Error Handling
- Invalid file types return 400 error
- File too large returns 400 error
- Missing authentication returns 401 error
- User not found returns 404 error
- Server errors return 500 error

## Usage Examples

### Using cURL to upload a profile picture:
```bash
curl -X POST \
  http://localhost:9696/api/user/uploadProfilePicture \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -F 'profilePicture=@/path/to/your/image.jpg'
```

### Using JavaScript/Fetch:
```javascript
const formData = new FormData();
formData.append('profilePicture', fileInput.files[0]);

fetch('/api/user/uploadProfilePicture', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ' + token
    },
    body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

## Database Schema
The `User` model now includes:
```javascript
profilePicture: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: function() {
        // Generates random DiceBear avatar URL
    }
}
``` 