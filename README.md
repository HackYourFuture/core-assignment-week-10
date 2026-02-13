# Core program week 10 assignment

## Implementation Instructions

### Setup

1. Clone this repository to your local machine.
2. Navigate to the project folder in your terminal.
3. Install the dependencies:

   ```bash
   npm install
   ```

### Task 1

In this task you will build a command-line tool that fetches cocktail recipes from an API and writes the results to a markdown file. All your work will be in the file `task-1/cocktail.js`.

The starter code already handles command-line arguments and sets up the output path for you. Your job is to fill in the `try/catch` block with working code. You may add helper functions above `main()` as needed.

#### Getting started

1. Run the program with a cocktail name:

   ```bash
   node task-1/cocktail.js margarita
   ```

2. When finished, the program should create a file `task-1/output/margarita.md`.
3. Run the tests to check your work: `npm run test:cocktail`

#### What you need to do

Complete the four numbered steps inside `main()`:

1. **Fetch data from the API** — Use `fetch()` with `async/await` to call the API at the given `url`. Parse the JSON response. If the response is not OK, throw an error.

2. **Generate markdown content** — Transform the returned drink data into a markdown string. The API may return multiple drinks for a single search term (e.g. searching "margarita" returns several variations). Your output must include all of them.

3. **Write the file** — Use `fs/promises` (`writeFile`) to write the generated markdown to the file path given by `outPath`.

4. **Handle errors** — In the `catch` block, log a helpful error message to the console.

#### Expected output format

Look at the example files in `task-1/examples/` to see exactly what your output should look like. Each drink should include:

- A level-2 heading (`##`) with the drink name
- A thumbnail image (use the URL from `strDrinkThumb` with `/medium` appended)
- **Category** and **Alcoholic** (Yes/No) fields
- A list of ingredients with their measures
- Instructions and the glass to serve in

#### API reference

The API documentation is at: https://www.thecocktaildb.com/api.php

The search endpoint used in the starter code returns an object with a `drinks` array. Each drink object has properties like `strDrink`, `strDrinkThumb`, `strCategory`, `strAlcoholic`, `strInstructions`, `strGlass`, and numbered ingredient/measure pairs (`strIngredient1`…`strIngredient15`, `strMeasure1`…`strMeasure15`). Not all ingredient slots are filled — stop when the value is `null` or empty.

#### Tips

- You will need to import `fs` from `'fs/promises'` to write the file.
- The API can return `null` for the `drinks` property if no cocktail is found — handle this case.
- Ingredient/measure pairs are numbered 1–15. Loop through them and skip any that are empty or `null`.
- Compare your output against the example files to make sure formatting matches.

### Task 2

In this task you will implement the service functions that connect the Post Central CLI app to its API server. All your work will be in the file `task-2/src/services.js`.

The file contains stub functions that currently throw a `"Not implemented"` error. Your job is to replace each stub with a working `fetch` call to the API.

#### Getting started

1. Run `npm run task2` to start the app. You will see "Not implemented" errors for any function you haven't completed yet.
2. Run the tests for each stage as you go (see below) to check your work.

#### Reference example

The `registerUser` function is already fully implemented for you. Study it carefully — all other functions follow the same pattern:

1. Call `fetch()` with the correct URL, method, headers, and body.
2. Check `response.ok`. If `false`, throw an error.
3. Return the parsed JSON response (or nothing for DELETE requests).

#### Stage 1: GET requests

Implement the following function:

- **`getMe()`** — `GET /users/me`
  Requires the `Authorization` header with the stored token: `Bearer ${getToken()}`.
  Returns: `{ user: string }`

Run the tests: `npm run test:get`

#### Stage 2: POST requests

Implement the following function:

- **`loginUser(name, password)`** — `POST /users/login`
  Same pattern as `registerUser` but posts to `/users/login`.
  Returns: `{ user: string, token: string }`

Run the tests: `npm run test:post`

#### Stage 3: CRUD operations

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

#### Tips

- Unauthenticated endpoints (`registerUser`, `loginUser`) only need the `Content-Type` header.
- All other endpoints also need the `Authorization` header: `Bearer ${getToken()}`.
- For `DELETE` requests there is no JSON response body to parse.
- Run all tests at once with `npm run test:run`.
