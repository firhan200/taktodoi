# User API Spec

## Register User API

Endpoint : POST /api/users

Request Body :

```json
{
  "email": "john.doe@gmai;.com",
  "password": "password",
  "full_name": "John Doe"
}
```

Response Body Success :

```json
{
  "data": {
    "id": "1",
    "full_name": "John Doe",
    "email": "john.doe@gmail.com"
  }
}
```

Response Body Error :

```json
{
  "errors": "Email already registered"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
  "email": "john.doe@gmail.com",
  "password": "password"
}
```

Response Body Success :

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Response Body Error :

```json
{
  "errors": "Email or password is incorrect"
}
```
