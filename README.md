# Express + PostgreSQL + TypeScript + Webpack example integration

Note: The `project` and `output` folders are separate so when you run the webpack bundle
you're simulating running in a completely different environment with no `node_modules` folder.

1. `cd project`
2. Install dependencies via `yarn` or `npm install`
3. Run a local instance of PostgreSQL and create a database called `mikro-orm-webpack-express-ts`
4. Run via `yarn start` or `yarn start:dev` (watch mode)
5. Example API is running on localhost:3000

Available routes:

```
GET     /author        finds all authors
GET     /author/:id    finds author by id
POST    /author        creates new author
PUT     /author/:id    updates author by id
```

```
GET     /book          finds all books
GET     /book/:id      finds book by id
POST    /book          creates new book
PUT     /book/:id      updates book by id
```
