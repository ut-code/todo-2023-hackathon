const fs = require("fs");
const ejs = require("ejs");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

const tasks = [];
class Task {
    title;
    deadline;
    importance;
    constructor(title, deadline, importance) {
        this.title = title;
        this.deadline = deadline;
        this.importance = importance;
    };
};

app.get("/", (request, response) => {
    const template = fs.readFileSync("index.ejs", "utf8");
    const html = ejs.render(template, {tasks: tasks});
    response.send(html);
});

app.post("/edit", (request, response) => {
    response.send(編集画面);
});

app.post("/", (request, response) => {
    const task = new Task(request.body.title, request.body.deadline, request.body.importance,);
    tasks.push(task);
    const template = fs.readFileSync("index.ejs", "utf8");
    const html = ejs.render(template, {tasks: tasks});
    response.send(html);
});