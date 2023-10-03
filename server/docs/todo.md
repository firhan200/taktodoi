# ToDo API Spec

## Create ToDo API

Endpoint : POST /api/todos

Headers :

- Authorization : Bearer token

Request Body :

```json
{
  "name": "Read a book",
  "description": "Read a Clean Code book by Robert C. Martin"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "name": "Read a book",
    "description": "Read a Clean Code book by Robert C. Martin",
    "userId": "2"
  }
}
```

Response Body Error :

```json
{
  "errors": "Name can't be empty"
}
```

## Update ToDo API

Endpoint : PATCH /api/todos/:toDoId

Headers :

- Authorization : Bearer token

Request Body :

```json
{
  "name": "Read a book",
  "description": "Read a Clean Code book by Robert C. Martin"
}
```

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "name": "Read a book",
    "description": "Read a Clean Code book by Robert C. Martin",
    "userId": "2"
  }
}
```

Response Body Error :

```json
{
  "errors": "Name can't be empty"
}
```

## Get ToDo API

Endpoint : GET /api/todos/:toDoId

Headers :

- Authorization : Bearer token

Response Body Success :

```json
{
  "data": {
    "id": 1,
    "name": "Read a book",
    "description": "Read a Clean Code book by Robert C. Martin",
    "userId": "2"
  }
}
```

Response Body Error :

```json
{
  "errors": "Todo is not found"
}
```

## Get List ToDo API

Endpoint : GET /api/todos

Headers :

- Authorization : Bearer token

Response Body Success :

```json
{
  "data": [
    {
      "id": 1,
      "name": "Read a book",
      "description": "Read a Clean Code book by Robert C. Martin",
      "userId": "2"
    },
    {
      "id": 2,
      "name": "Read a book",
      "description": "Read a Clean Code book by Robert C. Martin",
      "userId": "2"
    }
  ]
}
```

Response Body Error :

```json
{
  "errors": "Todo is not found"
}
```

## Remove ToDo API

Endpoint : DELETE /api/todos/:toDoId

Headers :

- Authorization : Bearer token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "ToDo is not found"
}
```
