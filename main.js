const fs = require("fs");
const ejs = require("ejs");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

const tasks = [];
class Task {
    name;
    deadline;
    importance;
    constructor(name, deadline, importance) {
        this.name = name;
        this.deadline = deadline;
        this.importance = importance;
    };
};

app.get("/", (request, response) => {
    response.send("hello");
});

app.post("/edit", (request, response) => {
});

app.post("/", (request, response) => {
    const task = new Task(request.body.name, request.body.deadline, request.body.importance,);
    tasks.push(task);
    const template = fs.readFileSync("index.ejs", "utf8");
    const html = ejs.render(template, {tasks: tasks});
});