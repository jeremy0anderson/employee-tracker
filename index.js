const inquirer = require('inquirer');
const cTable = require("console.table");
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "employee_db"
});
const menu = [{
    type: "list",
    name: "main",
    message: "choose an option",
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
}, ]

function viewDepartments() {
    connection.query()
}

function mainMenu() {
    console.log('running');
    inquirer.prompt(menu).then(answer => {
        console.log(answer);
        switch (answer.main) {
            case "View all departments":

        }
    })
}

connection.connect(err => {
    if (err) throw err;
    mainMenu();
})