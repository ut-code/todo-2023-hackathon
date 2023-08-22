const fs = require("fs");
const ejs = require("ejs");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

async function main(request, response, userId) {
  const tasks = await client.task.findMany({ where: { userId } });
  const template = fs.readFileSync("output.ejs", "utf8");
  const tasksForDisplay = tasks.map((task) => {
    return {
      id: task.id,
      name: task.name,
      due: `${task.due.getFullYear()}/${
        task.due.getMonth() + 1
      }/${task.due.getDate()}`,
      isImportant: task.isImportant,
    };
  });
  const html = ejs.render(template, { tasks: tasksForDisplay });
  response.send(html);
}

async function push(request, response, userId, name, due, isImportant) {
  await client.task.create({ data: { userId, name, due, isImportant } });
  const tasks = await client.task.findMany({ where: { userId } });
  const template = fs.readFileSync("output.ejs", "utf8");
  const tasksForDisplay = tasks.map((task) => {
    return {
      id: task.id,
      name: task.name,
      due: `${task.due.getFullYear()}/${
        task.due.getMonth() + 1
      }/${task.due.getDate()}`,
      isImportant: task.isImportant,
    };
  });
  const html = ejs.render(template, { tasks: tasksForDisplay });
  response.send(html);
}

const userId = 1;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("static"));

app.get("/", async (request, response) => {
  const template = fs.readFileSync("login.ejs", "utf8");
  const login = ejs.render(template);
  response.send(login);
});

app.post("/output", async (request, response) => {
  main(request, response, userId);
});

app.post("/edit", (request, response) => {
  const html = fs.readFileSync("input.html", "utf8");
  response.send(html);
});

app.post("/push", (request, response) => {
  console.log(request.body);
  push(
    request,
    response,
    userId,
    request.body.name,
    new Date(request.body.due),
    request.body.isImportant === "on" ? true : false
  );
});

app.listen(3000);
