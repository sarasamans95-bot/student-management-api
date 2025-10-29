const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const dataFile = path.join(__dirname, "../data/students.json");

// Helper functions
const readStudents = () => {
  if (!fs.existsSync(dataFile)) return [];
  const data = fs.readFileSync(dataFile, "utf-8");
  return JSON.parse(data || "[]");
};

const writeStudents = (students) => {
  fs.writeFileSync(dataFile, JSON.stringify(students, null, 2));
};

// ✅ POST - Add a new student
router.post("/", (req, res) => {
  const { name, age, course, year, status } = req.body;

  // Validation
  if (!name || !course || !year) {
    return res.status(400).json({ error: "Name, course, and year are required!" });
  }
  if (isNaN(age) || age <= 0) {
    return res.status(400).json({ error: "Age must be a positive number!" });
  }

  const students = readStudents();

  const newStudent = {
    id: Date.now(),
    name,
    age,
    course,
    year,
    status: status || "active",
  };

  students.push(newStudent);
  writeStudents(students);

  res.status(201).json(newStudent);
});

// ✅ GET - Fetch all students
router.get("/", (req, res) => {
  try {
    const students = readStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to read student data!" });
  }
});

module.exports = router;
