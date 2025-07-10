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

## `/users/logout` Endpoint

### Description
Logs out the current user by blacklisting the JWT token.

### HTTP Method
`GET`

### Authentication
Requires user authentication (JWT in `Authorization` header or cookie).

### Success Response
- Status Code: 200
- Response Body:
```json
{ "message": "Logged out successfully" }
```

---

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
  - `vehicleType` (string, required): Type of vehicle (e.g., car, bike, auto, bus)

### Success Response
- Status Code: 201
- Response Body:
```json
{
  "token": "JWT_TOKEN_STRING",
  "captain": {
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "vehicle": {
      "color": "black",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
}
```

### Error Responses
- Status Code: 400 (validation fails or captain already exists)

---

## `/captains/login` Endpoint

### Description
Authenticates a captain and returns a JWT token.

### HTTP Method
`POST`

### Request Body
- `email` (string, required): Captain's email address
- `password` (string, required): Captain's password

### Success Response
- Status Code: 200
- Response Body:
```json
{
  "token": "JWT_TOKEN_STRING",
  "captain": {
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "vehicle": { ... }
  }
}
```

### Error Responses
- Status Code: 404 (invalid credentials)
- Status Code: 400 (validation fails)

---

## `/captains/profile` Endpoint

### Description
Returns the authenticated captain's profile.

### HTTP Method
`GET`

### Authentication
Requires captain authentication (JWT).

### Success Response
- Status Code: 200
- Response Body:
```json
{
  "captain": {
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john@example.com",
    "vehicle": { ... }
  }
}
```

---

## `/captains/logout` Endpoint

### Description
Logs out the current captain by blacklisting the JWT token.

### HTTP Method
`GET`

### Authentication
Requires captain authentication (JWT).

### Success Response
- Status Code: 200
- Response Body:
```json
{ "message": "Logged out successfully" }
```

---

## `/maps/get-coordinates` Endpoint

### Description
Returns latitude and longitude for a given address.

### HTTP Method
`GET`

### Query Parameters
- `address` (string, required): The address to geocode.

### Authentication
Requires user authentication (JWT).

### Success Response
- Status Code: 200
- Response Body:
```json
{ "lat": 23.123, "lng": 77.123 }
```

---

## `/maps/get-distance-time` Endpoint

### Description
Returns the distance and estimated duration between two locations.

### HTTP Method
`GET`

### Query Parameters
- `origin` (string, required): Origin address or "lng,lat".
- `destination` (string, required): Destination address or "lng,lat".

### Authentication
Requires user authentication (JWT).

### Success Response
- Status Code: 200
- Response Body:
```json
{
  "distance": { "text": "12 km", "value": 12000 },
  "duration": { "text": "0 hour", "value": 900 },
  "status": "OK"
}
```

---

## `/maps/get-suggestions` Endpoint

### Description
Returns autocomplete suggestions for a location input.

### HTTP Method
`GET`

### Query Parameters
- `input` (string, required): Partial address or location string.

### Authentication
Requires user authentication (JWT).

### Success Response
- Status Code: 200
- Response Body:
```json
{
  "suggestions": [
    { "name": "Bhopal, India", "coordinates": [77.4126, 23.2599] },
    ...
  ]
}
```

---

## `/rides/create` Endpoint

### Description
Creates a new ride for the authenticated user.

### HTTP Method
`POST`

### Authentication
Requires user authentication (JWT).

### Request Body
- `pickup` (string, required): Pickup address or "lng,lat".
- `destination` (string, required): Destination address or "lng,lat".
- `vehicleType` (string, required): One of "auto", "car", "bike".

### Success Response
- Status Code: 201
- Response Body:
```json
{
  "_id": "ride_id",
  "user": "user_id",
  "pickup": "77.4126,23.2599",
  "destination": "77.4127,23.2600",
  "fare": 120,
  "otp": "123456",
  ...
}
```

---

## `/rides/get-fare` Endpoint

### Description
Returns fare estimates for a given pickup and destination.

### HTTP Method
`GET`

### Authentication
Requires user authentication (JWT).

### Query Parameters
- `pickup` (string, required): Pickup address or "lng,lat".
- `destination` (string, required): Destination address or "lng,lat".

### Success Response
- Status Code: 200
- Response Body:
```json
{
  "auto": 120,
  "car": 180,
  "bike": 90
}
```

