const express = require('express');
const router = express.Router();
const courses = require('../services/courses');

// Get courses
router.get('/', async function(req, res, next) {
  try {
    // Response a GET request with a JSON format result using res.json
    res.json(await courses.getMultiple(req.query.open));
  }
  catch (err) {
    console.error(`Error while getting courses `, err.message);
    next(err);
  }
});

// Post course
router.post('/', async function(req, res, next) {
  try {
    res.json(await courses.create(req.body));
  }
  catch (err) {
    console.log(`Error while creating course`, err.message);
    next(err);
  }
})

module.exports  = router;