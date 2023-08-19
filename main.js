const fs = require("fs");
const ejs = require("ejs");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

const userId = 1;

async function main(request, response, userId) {
  const tasks = await client.task.findMany({ where: { userId } });
  const template = fs.readFileSync("output.ejs", "utf8");
  const html = ejs.render(template, { tasks: tasks });
  response.send(html);
}

async function push(request, response, userId, name, due, isImportant) {
  await client.task.create({ data: { userId, name, due, isImportant } });
  const tasks = await client.task.findMany({ where: { userId } });
  const template = fs.readFileSync("output.ejs", "utf8");
  const html = ejs.render(template, { tasks: tasks });
  response.send(html);
}

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("static"));

app.get("/", async (request, response) => {
  const template = fs.readFileSync("login.ejs", "utf8");
  const login = ejs.render(template, { userNotFound: true, incorrectPassword: true });
  response.send(login);
});

app.post("/output", async (request, response) => {
  let userNotFound = true;
  const user = await client.User.findUnique({
    where: { name: request.body.name },
  });
  if (user === undefined) {
    const template = fs.readFileSync("login.ejs", "utf8");
    const login = ejs.render( template, { userNotFound: false, incorrectPassword: true });
    response.send(login);
  } else if (user.password === request.body.password) {
    const sessionId = await client.Session.findFirst({
      where: { userId: user.id,},
    });
    response.cookie("session", sessionId.id);
    main(request, response, sessionId.id)
  } else {
    const template = fs.readFileSync("login.ejs", "utf8");
    const login = ejs.render( template, { userNotFound: true, incorrectPassword: false });
    response.send(login);
  }
});

app.post("/edit", (request, response) => {
});

app.post("/output", (request, response) => {
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
