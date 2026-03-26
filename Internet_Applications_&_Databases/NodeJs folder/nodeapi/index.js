const express = require("express");
const app = express();
const port = 3000;
// Import the routes/courses.js:
const courseRouter = require("./routes/courses");

// Use Express JSON parser middleware to parse JSON
app.use(express.json());

// Use Express urlenconded() middleware to parse URL
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Response a Get  request with a JSON format message using res.json
app.get("/", (req, res) => {
  res.json({message: "ok"});
});

// Link up the /course route to the router
app.use("/courses", courseRouter);

// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
})

app.listen(port, () => {
  console.log(`First Node app listening at http://localhost:${port}`);
})