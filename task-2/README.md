## Task 2

In this task you will implement the service functions that connect the Post Central CLI app to its API server. All your work will be in the file `task-2/src/services.js`.

The file contains stub functions that currently throw a `"Not implemented"` error. Your job is to replace each stub with a working `fetch` call to the API.

### Getting started

1. Run `npm run task2` to start the app. You will see "Not implemented" errors for any function you haven't completed yet.
2. Run the tests for each stage as you go (see below) to check your work.

### Reference example

The `registerUser` function is already fully implemented for you. Study it carefully — all other functions follow the same pattern:

1. Call `fetch()` with the correct URL, method, headers, and body.
2. Check `response.ok`. If `false`, throw an error.
3. Return the parsed JSON response (or nothing for DELETE requests).

### Stage 1: GET requests

Implement the following function:

- **`getMe()`** — `GET /users/me`
  Requires the `Authorization` header with the stored token: `Bearer ${getToken()}`.
  Returns: `{ user: string }`

Run the tests: `npm run test:get`

### Stage 2: POST requests

Implement the following function:

- **`loginUser(name, password)`** — `POST /users/login`
  Same pattern as `registerUser` but posts to `/users/login`.
  Returns: `{ user: string, token: string }`

Run the tests: `npm run test:post`

### Stage 3: CRUD operations

Implement the remaining functions:

- **`createPost(text)`** — `POST /posts`
  Requires both `Content-Type` and `Authorization` headers. Body: `{ text }`.
  Returns: `{ id: number, text: string, user: string }`
- **`getPosts()`** — `GET /posts/me`
  Requires the `Authorization` header.
  Returns: array of `{ id, text, user }`
- **`updatePost(id, text)`** — `PUT /posts/:id`
  Requires both `Content-Type` and `Authorization` headers. Body: `{ text }`.
  Returns: `{ id: number, text: string }`
- **`deleteUser()`** — `DELETE /users/me`
  Requires the `Authorization` header. No response body.
- **`deletePost(id)`** — `DELETE /posts/:id`
  Requires the `Authorization` header. No response body.

Run the tests: `npm run test:crud`

### Tips

- Unauthenticated endpoints (`registerUser`, `loginUser`) only need the `Content-Type` header.
- All other endpoints also need the `Authorization` header: `Bearer ${getToken()}`.
- For `DELETE` requests there is no JSON response body to parse.
- Run all tests at once with `npm run test:run`.
