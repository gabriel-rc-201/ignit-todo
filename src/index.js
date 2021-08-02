const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(req, res, next) {
  const { username } = req.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(400).json({ error: "User not found!" });
  }

  req.user = user;
  return next();
}

app.post("/users", (req, res) => {
  const { name, username } = req.body;
  const usernameAlreadyExists = users.some(
    (user) => user.username === username
  );

  if (usernameAlreadyExists) {
    return res.status(400).json({ error: "invalid username" });
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: [],
  });

  const user = users.find((user) => user.username === username);

  return res.json(user);
});

app.get("/todos", checksExistsUserAccount, (req, res) => {
  const { user } = req;
  return res.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (req, res) => {
  const { title, deadline } = req.body;
  const { user } = req;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  };

  user.todos.push(newTodo);

  return res.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (req, res) => {
  const { user } = req;
  const todoId = req.query.id;

  const todo = user.todos.find((todo) => todo.id === todoId);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found!" });
  }

  const { title, deadline } = req.body;

  todo.title = title;
  todo.deadline = deadline;

  return res.status(200).json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (req, res) => {
  const { user } = req;
  const todoId = req.query.id;

  const todo = user.todos.find((todo) => todo.id === todoId);
  if (!todo) {
    return res.status(404).json({ error: "Todo not found!" });
  }

  todo.done = true;

  return res.status(200).json(todo);
});

app.delete("/todos/:id", checksExistsUserAccount, (req, res) => {
  // Complete aqui
});

module.exports = app;
