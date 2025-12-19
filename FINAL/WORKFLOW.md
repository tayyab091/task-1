# FINAL Project — Workflow & Beginner Guide

**Goal:** Explain how the project works, the request → response flow, what each file does, and what each major code block is responsible for. This is written for someone new to Node/Express/EJS.

**1. How things are working**
- **Short summary:** This is an Express.js MVC-style app. The app listens for HTTP requests, routes them to route handlers, those call controller functions which use models to read/write the database and render EJS views or JSON responses.

**2. High-level flow (visual)**
- HTTP Client (browser) --(request)--> Express `app.js` --(routes)--> `routes/*.js` --(controller)--> `controllers/*.js` --(DB)--> `models/*.js` --(DB returns)--> `controller` --(render)--> `views/*.ejs` --(response)--> Browser

Arrow diagram (simple):

Browser
  |
  v
[FINAL/app.js](FINAL/app.js)  
  |
  v
[FINAL/routes/index.js](FINAL/routes/index.js)  --> [FINAL/controllers/indexController.js](FINAL/controllers/indexController.js)
  |
  v
[FINAL/models/Product.js](FINAL/models/Product.js) (via Mongoose)
  |
  v
Views: [FINAL/views/*.ejs](FINAL/views) (render HTML back)

**3. What the code is doing (one-line per major file)**
- **`app.js`**: Bootstraps the Express server, configures middleware (body parsing, sessions, static files), connects to DB, and mounts routes. See [FINAL/app.js](FINAL/app.js#L1-L40).
- **`config/database.js`**: Connects to MongoDB using Mongoose and exports the connection helper. See [FINAL/config/database.js](FINAL/config/database.js#L1-L120).
- **`config/constants.js`**: Holds constants used in the app (URLs, limits, etc.). See [FINAL/config/constants.js](FINAL/config/constants.js).
- **`routes/*.js`**: Define URL endpoints and map them to controller functions. Examples: [FINAL/routes/index.js](FINAL/routes/index.js#L1-L120), [FINAL/routes/products.js](FINAL/routes/products.js#L1-L120).
- **`controllers/*.js`**: Handle request business logic, query models, and choose views to render. Examples: [FINAL/controllers/productsController.js](FINAL/controllers/productsController.js#L1-L200).
- **`models/*.js`**: Define data schemas (Mongoose models) and provide DB access via Mongoose methods. See [FINAL/models/Product.js](FINAL/models/Product.js#L1-L200).
- **`middleware/adminAuth.js`**: Protects admin routes by checking session/auth. See [FINAL/middleware/adminAuth.js](FINAL/middleware/adminAuth.js).
- **`public/`**: Static assets (CSS, JS, images) served directly to the browser. See [FINAL/public/js/checkout.js](FINAL/public/js/checkout.js) and CSS in [FINAL/public/css](FINAL/public/css).
- **`views/*.ejs`**: Templates rendered server-side to produce HTML pages.

**4. How the code is working (step-by-step request example)**
- Step 1: Browser requests `GET /` (homepage).
  - Express `app.js` receives request and looks at mounted routes.
  - `routes/index.js` has a route for `/` and calls `indexController`.
  - `indexController` queries `Product` model (Mongoose) for product list.
  - Mongoose returns data (from `config/database.js` connection).
  - Controller calls `res.render('index', { products })`.
  - EJS engine composes HTML using templates in `views/` and sends it back.

**5. Teaching like the user is brand new (simple analogies)**
- Think of the app like a restaurant: the browser is the customer, `routes` are the host who takes the order and sends it to the right chef (controller). The controller (chef) asks the pantry (models/database) for ingredients, prepares the dish (render view), and the waiter (Express) brings the plate (HTTP response) back to the customer.

**6. Which files do what and how they do it (file-by-file brief)**
- `app.js`: Creates server, middleware, and mounts routes. The line `app.listen(PORT)` tells Node to accept connections on that port.
- `config/database.js`: Calls `mongoose.connect(...)`. Controllers and models use this DB connection implicitly through Mongoose models.
- `routes/index.js`: Example route file. It typically contains `router.get('/', controller.index)` which maps GET / to the `index` function exported from the controller.
- `controllers/indexController.js`: Loads models and sends data to views: e.g. `const products = await Product.find()` and `res.render('index', { products })`.
- `models/Product.js`: Defines a Mongoose schema such as `new Schema({ name: String, price: Number })` and `module.exports = mongoose.model('Product', ProductSchema)`.
- `middleware/adminAuth.js`: Looks for `req.session.isAdmin` (or similar) and calls `next()` if allowed, otherwise redirects to login.
- `public/js/checkout.js`: Client-side JavaScript for the checkout page; runs in the browser, not on the server.

**7. Which code block does what and how it does it (examples)**
- `app.js` (server start & middleware)

  - What it does: Initializes Express, sessions, body parsing, static folder, routes, and error handler.
  - How: `app.use(bodyParser.urlencoded({ extended: true }))` parses `application/x-www-form-urlencoded` request bodies so controllers can read `req.body`.

- A controller example (pseudo):

  - What it does: Run DB query and render view.
  - How: `const items = await Product.find(); res.render('products', { items })` — `await` pauses execution until DB responds; `res.render` uses EJS to produce HTML.

- A route example (pseudo):

  - What it does: Connect URL to controller.
  - How: `router.get('/products', productsController.list)` tells Express to call `list` when a GET request comes to `/products`.

**Quick tips for exploring the codebase**
- Start by opening [FINAL/app.js](FINAL/app.js#L1-L200).
- Follow a route: open the corresponding file in [FINAL/routes](FINAL/routes) and see which controller it calls.
- Open that controller in [FINAL/controllers](FINAL/controllers) to see DB calls and rendering.

**How CI workflow (added) checks the project**
- The file I added is at [FINAL/.github/workflows/nodejs-ci.yml](FINAL/.github/workflows/nodejs-ci.yml). It:
  - Installs Node.js and dependencies with `npm ci`.
  - Starts the app (`npm run start`) in the background.
  - Performs a smoke-check by curling `http://localhost:3000/` to make sure the server responds.

If you want I can:
- Add `npm run lint` and `npm test` scripts and update CI to run them.
- Add a simple health-check route `/health` that returns 200 JSON to make CI checks faster and clearer.

---
If you'd like, I can now (1) add a `/health` route and controller, and (2) update the workflow to check `/health` instead of `/` — say the word and I'll implement both.
