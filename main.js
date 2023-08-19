const fs = require("fs");
const ejs = require("ejs");
const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const client = new PrismaClient();

const userId = 777

async function main(request, response) {
    const tasks = await client.task.findMany({ userId });
    const template = fs.readFileSync("index.ejs", "utf8");
    const html = ejs.render(template, { tasks: tasks });
    response.send(html);
  }

async function push(request, response, userId, name, due, isImportant) {
    await client.task.create({ data: {  userId, name, due, isImportant } });
    const tasks = await client.task.findMany({ userId });
    const template = fs.readFileSync("index.ejs", "utf8");
    const html = ejs.render(template, { tasks: tasks });
    response.send(html);
  }

app.use(express.urlencoded({ extended: true }));

app.get("/", (request, response) => {
    main(request, response);
});

app.post("/edit", (request, response) => {
    const html = fs.readFileSync("input.html", "utf8");
    response.send(html);
});

app.post("/", (request, response) => {
    push(request, response, userId, request.body.name, request.body.due, request.body.isImportant);
});

app.listen(3000);