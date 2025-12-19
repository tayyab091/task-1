# FINAL — Backend Learning Guide

This guide explains the main backend code in the `FINAL` project for a beginner: what each major file does, how requests flow, how sessions work, and short code examples you can try.

**Overview**
- The app is a Node.js + Express server using the MVC pattern: `app.js` boots the server, `routes/` map URLs to `controllers/`, controllers use `models/` (Mongoose) to talk to MongoDB, and `views/` (EJS) render HTML.

**1. Server bootstrap — `app.js`**
- Purpose: Start Express, configure middleware, connect DB, and mount routes.
- Key blocks (what they do):
  - require and config: loads environment variables with `require('dotenv').config()` so `process.env` can hold secrets.
  - `connectDB()` call: opens the Mongoose connection (see `config/database.js`).
  - `app.set('view engine', 'ejs')` and `app.set('views', ...)`: tells Express to use EJS templates.
  - Sessions: `app.use(session({...}))` — this sets up session middleware so you can store small data per visitor on the server-side session store (here in-memory by default). Important options:
    - `secret`: used to sign the session cookie.
    - `resave` and `saveUninitialized`: control saving behavior.
    - `cookie.maxAge`: how long the session cookie lasts (ms).
  - Body parsing: `bodyParser.urlencoded()` and `bodyParser.json()` parse incoming request bodies into `req.body`.
  - Static files: `app.use(express.static(...))` serves CSS, JS, and images from `public/`.
  - Mount routes: `app.use('/', indexRoutes)` and similar lines attach route modules.
  - 404 handler: a fallback `app.use((req, res) => { res.status(404).render('error', ...) })` to render a friendly 404 page.

Example: how session is used (conceptual)

  - Login controller might do:

  ```js
  // On successful admin login
  req.session.isAdmin = true;
  req.session.user = { id: admin._id, name: admin.name };
  // Then redirect or render admin dashboard
  res.redirect('/admin/dashboard');
  ```

  - Protected route middleware `adminAuth.js` typically checks:

  ```js
  if (req.session && req.session.isAdmin) {
    next(); // allow access
  } else {
    res.redirect('/admin/login');
  }
  ```

  - Logging out: `req.session.destroy(err => { res.redirect('/'); })` removes the session and cookie.

Notes about session store:
- The default in-memory store is fine for development. For production, use a persistent store (Redis, MongoDB store, etc.) to avoid losing sessions when the server restarts and to support multiple server instances.

**2. Database connection — `config/database.js`**
- Purpose: Create a Mongoose connection to MongoDB.
- Typical flow: `mongoose.connect(MONGO_URI, options)` then export a small helper used by `app.js` to open the connection early.

**3. Routes — `routes/*.js`**
- Purpose: Map HTTP paths to controller functions. Example pattern:

```js
const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/', indexController.index);
module.exports = router;
```

What happens: A GET to `/` calls `indexController.index(req, res)`.

**4. Controllers — `controllers/*.js`**
- Purpose: Implement request logic: validate input, query/update models, set session variables if needed, and render views or return JSON.
- Example (pseudo):

```js
exports.index = async (req, res) => {
  const products = await Product.find().limit(20);
  res.render('index', { products });
};
```

Key controller responsibilities:
- Use `try/catch` for async DB calls to handle errors.
- Use `res.render(viewName, data)` to produce HTML via EJS.
- Use `res.redirect(path)` after successful POSTs (PRG pattern).

**5. Models — `models/*.js`**
- Purpose: Define Mongoose schemas and models. Example pattern:

```js
const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
});
module.exports = mongoose.model('Product', ProductSchema);
```

Common model methods you will see:
- `Model.find(query)`: read multiple documents.
- `Model.findById(id)`: read one document by id.
- `new Model(data).save()`: create and save.
- `Model.findByIdAndUpdate(id, update)`: update document.
- `Model.findByIdAndDelete(id)`: delete document.

**6. Middleware**
- `adminAuth.js` protects admin routes by checking `req.session` values and redirecting if not authorized. Middleware is an Express function `(req, res, next) => {}`.

**7. Example request flow (GET /products)**
1. Browser requests `GET /products`.
2. Express finds route in `routes/products.js` and calls `productsController.list`.
3. `productsController.list` does `const products = await Product.find()`.
4. Controller calls `res.render('products', { products })`.
5. EJS templates in `views/` generate HTML and response is sent.

**8. Example POST flow (checkout)**
1. Browser submits form to `/checkout` (POST).
2. `routes/checkout.js` maps POST `/` to `checkoutController.submit`.
3. Controller reads `req.body` (body-parser parsed it), validates data, may create Order in DB, then sets a success flag and redirects to a success page.

**9. Debugging tips (beginner-friendly)**
- Add `console.log()` in controllers to inspect `req.body`, `req.session`, and DB responses.
- Use `nodemon` (run `npm run dev`) so the server restarts automatically on file changes.
- When DB calls fail, inspect connection string in `.env` and check `config/database.js` logs.

**10. Small improvements you can add (suggestions)**
- Add a `/health` route that returns 200 JSON to simplify CI checks:

```js
// routes/health.js
const express = require('express');
const router = express.Router();
router.get('/health', (req, res) => res.json({ status: 'ok' }));
module.exports = router;
```

- Use `connect-mongo` or `redis` as a session store for production.

**11. Where to look next (file paths)**
- Entry: [app.js](app.js)
- DB helper: [config/database.js](config/database.js)
- Routes: [routes/](routes)
- Controllers: [controllers/](controllers)
- Models: [models/](models)
- Views: [views/](views)
- Static assets: [public/](public)

If you'd like, I can now:
- Add a `/health` route and update CI to check it.
- Add a small example `adminAuth`-protected route with a sample login flow.

Tell me which of those you'd like me to implement next.
