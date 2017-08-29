const express = require('express');
const bodyParser = require('body-parser');
const todoModule = require('./util/seed');

const todos = todoModule.todos;
const STATUS = todoModule.STATUS;
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    console.log('New Request');
    console.log(req.url);
    console.log(req.method);
    next();
});

app.route('/api/todos')
    .get((req, res) => {
        res.json(todos);
    })
    .post((req, res) => {
        const todoTitle = req.body.todoTitle;
        if (todoTitle === undefined || todoTitle.trim().length === 0) {
            res.status(400).json({ error: "Todo can't be empty." });
        } else {
            todos[todoModule.next_Id] = {
                title: todoTitle,
                status: STATUS.ACTIVE
            };
            const jsonResult = {};
            jsonResult[todoModule.next_Id] = todos[todoModule.next_Id];
            res.json(jsonResult);
            todoModule.next_Id++;
        }     
});

app.route('/api/todos/:id')
    .delete((req, res) => {
        const id = req.params.id;
        const target = todos[id];
        if (target === undefined) {
            res.status(400).json({ error: "Todo doesn't exists." });
        } else {
            target.status = STATUS.DELETED;
            res.send(target);
        }
    })
    .put((req, res) => {
        const id = req.params.id;
        const target = todos[id];
        if (target === undefined) {
            res.status(400).json({ error: "Todo doesn't exists." });
        } else {
            const response = {};
            let todoTitle = req.body.todoTitle;
            let todoStatus = req.body.todoStatus;
            todoStatus = todoModule.getValidStatus(todoStatus);
            if (todoStatus === undefined) {
                response.error = 'Invalid Status';
            }
            if (todoTitle !== undefined) {
                if (todoTitle.trim().length === 0) {
                    response.error = "Title can't be empty";
                } else {
                    todoTitle = todoTitle.trim();
                    todos[id].title = todoTitle;
                    response[id] = todos[id];
                }
            }
            if (response.error !== undefined) {
                res.status(200);
            } else {
                res.status(400);
            }
            res.send(response);
        }
    }).get((req, res) => {
        const target = todoModule.getValidStatus(req.params.id);
        if (target === undefined) {
            res.status(400).json({ error: 'Invalid status.' });
            return;
        }
        const jsonResult = {};
        for (const key of Object.keys(todos)) {
            if (todos[key].status === target) { 
                jsonResult[key] = todos[key];
            }
        }
        res.json(jsonResult);
});

app.put('/api/todos/:status/:id', (req, res) => {
    const status = todoModule.getValidStatus(req.params.status);
    const id = req.params.id;
    const jsonResult = {};
    if (status === undefined) {
        jsonResult.error = 'Invalid Status';
    }
    if (todos[id] === undefined) {
        jsonResult.error = "Todo doesn't exits";
    }

    if (jsonResult.error !== undefined) {
        res.status(400).json(jsonResult);
        return;
    }

    todos[id].status = status;
    jsonResult[id] = todos[id];
    res.send(jsonResult);
});

app.listen(PORT);
