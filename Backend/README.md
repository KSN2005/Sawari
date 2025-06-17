# Backend API Documentation

## `/users/register` Endpoint

### Description
Registers a new user by creating a user account with the provided information.

### HTTP Method
`POST`

### Request Body
The request body should be in JSON format and include the following fields:
- `fullname` (object):
  - `firstname` (string, required): User's first name (minimum 3 characters).
  - `lastname` (string, optional): User's last name (minimum 3 characters).
- `email` (string, required): User's email address (must be a valid email).
- `password` (string, required): User's password (minimum 6 characters).

### Example Response

- `user` (object):
  - `fullname` (object).
    - `firstname` (string): User's first name (minimum 3 characters).
    - `lastname` (string): User's last name (minimum 3 characters).   
  - `email` (string): User's email address (must be a valid email).
  - `password` (string): User's password (minimum 6 characters).
- `token` (String): JWT Token

## `/users/login` Endpoint

### Description
Authenticates an existing user by verifying the provided email and password, and returns a JWT token upon successful login.

### HTTP Method
`POST`

### Request Body
The request body should be in JSON format and include the following fields:
- `email` (string, required): User's email address (must be a valid email).
- `password` (string, required): User's password (minimum 6 characters).

### Example Response
```
- `user` (object):
  - `fullname` (object) with `firstname` and `lastname`.
  - `email` (string)
  - `password` (string)
- `token` (String): JWT Token
```

## `/captains/register` Endpoint

### Description
Registers a new captain by creating a captain account with the provided information.

### HTTP Method
`POST`

### Request Body
The request body should be in JSON format and include the following fields:
- `fullname` (object):
  - `firstname` (string, required): Captain's first name
  - `lastname` (string, required): Captain's last name
- `email` (string, required): Captain's email address (must be a valid email)
- `password` (string, required): Captain's password (minimum 6 characters)
- `vehicle` (object):
  - `color` (string, required): Vehicle color
  - `plate` (string, required): Vehicle plate number
  - `capacity` (number, required): Vehicle passenger capacity
  - `vehicleType` (string, required): Type of vehicle (e.g., sedan, SUV)

### Success Response
- Status Code: 201
- Response Body:
```json
{
    "token": "JWT_TOKEN_STRING",
    "captain": {
        "fullname": {
            "firstname": "John",
            "lastname": "Doe"
        },
        "email": "john@example.com",
        "vehicle": {
            "color": "black",
            "plate": "ABC123",
            "capacity": 4,
            "vehicleType": "sedan"
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
}
```

### Error Responses
- Status Code: 400
  - When validation fails
  - When captain with email already exists

