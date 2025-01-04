const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");

// Middleware
app.use(express.static(path.join(__dirname, "public"))); // Static files
app.use(bodyParser.urlencoded({ extended: true }));

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Task List Array (In-memory database for now)
let tasks = [
  {
    id: 1,
    name: "Complete Homework",
    description: "Finish math and science assignments",
    status: "Pending",
  },
];

// Routes
app.get("/", (req, res) => {
  res.render("index", { tasks });
});

app.get("/addTask", (req, res) => {
  res.render("addTask");
});

app.post("/addTask", (req, res) => {
  const { name, description, status } = req.body;
  const newTask = { id: tasks.length + 1, name, description, status };
  tasks.push(newTask);
  res.redirect("/");
});

// Edit Task
app.get("/editTask/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    res.render("editTask", { task });
  } else {
    res.status(404).send("Task not found");
  }
});

app.post("/editTask/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const { name, description, status } = req.body;
  let task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.name = name;
    task.description = description;
    task.status = status;
    res.redirect("/");
  } else {
    res.status(404).send("Task not found");
  }
});

// DELETE Task
app.delete("/deleteTask/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((t) => t.id !== taskId);
  res.status(200).send("Task deleted successfully");
});

// Start Server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
