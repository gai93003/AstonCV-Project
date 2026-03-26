const db = require('./db');
const config = require('../config');

async function getMultiple() {
  const rows = await db.query(
    `SELECT courseid, coursename, studentnum FROM course`
  );

  if (!rows) {
    return [];
  }

  return rows;
}

async function create(course) {
  const {courseid, coursename, studentnum } = course;
  const result = await db.query(
    "INSERT INTO course(courseid, coursename, studentnum) VALUES(?, ?, ?)",
    [courseid, coursename, studentnum]
  );

  let message = "Error in creating course";

  if (result.affectedRows) {
    message = 'Course created successfully';
  }

  return {message};
}

module.exports = {
  getMultiple,
  create
}