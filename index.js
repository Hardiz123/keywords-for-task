const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const port = 3000 || process.env.PORT;
//middleware
app.use(cors());
app.use(express.json());

//ROUTES//


// get all tasks
app.get("/", (req,res) => {
    res.send("hi there");
})


app.get("/tasks", async (req, res) => {
    try {
        createTasks(req, (results) => res.json(results));
    } catch (error) {
        res.json(error);
    }
});
const createTasks = async (req, callback) => {
    let results = [];
    let perfectQuery = `SELECT * FROM tasks where(`;
    const allParams = Object.keys(req.query);
    if (allParams > 1) {
        for (let i = 0; i < Object.keys(req.query).length; i++) {
            console.log(req.query[allParams[i]], 'this is it');
            perfectQuery += `"tasks"."Keyword"  ~* '(\\m${req.query[allParams[i]]}\\M)' AND`
            const tasks = await pool.query(`SELECT * FROM tasks where "tasks"."Keyword" LIKE '%${req.query[allParams[i]]}%';`);
            const queryName = req.query[allParams[i]];
            const task = { [queryName]: tasks };
            results[i] = task;
        }
        perfectQuery = perfectQuery.split(" ").reverse().slice(1).reverse().join(" ");
        perfectQuery += ');';
        perfectQuery = await pool.query(perfectQuery);
        const task1 = { "final": perfectQuery };
        results.push(task1);
        console.log(results.length);
        callback(results);
    }
    else {
        const tasks = await pool.query(`SELECT * FROM tasks;`);
        callback([tasks]);
    }

}



// get a task



app.listen(port, () => {
    console.log("server has started on port",PORT);
})