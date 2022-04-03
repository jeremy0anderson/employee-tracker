const inquirer = require('inquirer');
const cTable = require("console.table");
const mysql = require('mysql2');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const sqlSchema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), {
    encoding: "utf8"
});
const sqlSeeds = fs.readFileSync(path.join(__dirname, 'db', 'seeds.sql'), {
    encoding: "utf8"
});
dotenv.config();
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "employee_db",
    multipleStatements: true
});

let departmentsArray = [];
let employeesArray = []
function getEmployeeList() {
    db.query(`SELECT first_name, last_name
                FROM employee`, (err, rows) => {
        if (err) throw err;
        rows.forEach(r=>employeesArray.push(r))
        console.log(employeesArray);
        for (let i = 0; i < employeesArray.length; i++) {
            cArray.push(`${employeesArray[i].first_name} ${employeesArray[i].last_name}`);
            console.log(cArray);
        }
    });
}
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: process.env.DB_PASSWORD
// })
let r;
//create database connection

// inquirer prompts //
const menu = [{
    type: "list",
    name: "main",
    message: "choose an option",
    choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
}];
const department =[{
    type: "input",
    name:"newDept",
    message:"Please enter the name of the department you'd like to add"
}];
const role =[
    {
        type: "input",
        name:"roleTitle",
        message:"Please enter the name of the role you'd like to add"
    },
    {
        type: "number",
        name:"roleSalary",
        message:"Please enter the salary amount this role receives"
    },
    {
        type:"list",
        name:"deptId",
        message:"Please select the department this role falls under",
        choices: []
    }
];
const employee = [
    {
        type: "input",
        name: "eFirstName",
        message:"Enter the employee's first name"
    },
    {
        type: "input",
        name: "eLastName",
        message:"Enter the employee's last name"
    },
    {
        type: "input",
        name: "eRoleId",
        message:"Enter the role id the employee falls under"
    },
    {
        type: "input",
        name: "eManagerId",
        message:"Enter the employee manager's ID"
    }
];
const nextDepartment = [
    {
        type: "list",
        name: "dNext",
        message: "What would you like to do next?",
        choices: ["Main menu", "Add a department"]
    }
];
const nextRole = [
    {
        type: "list",
        name: "rNext",
        message: "What would you like to do next?",
        choices: ["Main menu", "Add a role"]
    }
];
const nextEmployee = [
    {
        type: "list",
        name: "eNext",
        message: "What would you like to do next?",
        choices: ["Main menu", "Add an Employee", "Update an employee role"]
    }
];
let cArray = [];
const updateEmployee = [
    {
        type: "list",
        name: "uEmployeeRole",
        message: "Select an employee to update their role",
        choices: cArray
    }
];
// end inquirer prompts //

// view functions //
function viewDepartments() {
    return db.query(`
        SELECT * FROM department;
    `, (err, rows)=> {
        if (err) throw err;
        let table  = cTable.getTable(rows);
        console.log(table);
        departmentNext();
    });
}
function viewRoles(){
    const q = db.query(`
        SELECT * FROM role;
    `, (err, rows)=> {
        if (err) throw err;
        let table  = cTable.getTable(rows);
        rows.forEach(e =>{
            console.log(e);
        })
        console.log(table);
        roleNext();
    });
}
function viewEmployees(){
    const q = db.query(`
        SELECT * FROM employee;
    `, (err, rows)=> {
        if (err) throw err;
        let table  = cTable.getTable(rows);
        console.log(table);
        employeeNext();
    });
}
// end view functions //


// do next (after view) functions //
function departmentNext(){
    inquirer.prompt(nextDepartment).then(answer => {
        switch(answer.dNext){
            case "Main menu":
                return mainMenu();
            case "Add a department":
                return addDepartment();
        }
    })
}
function roleNext(){
    inquirer.prompt(nextRole).then(answer => {
        switch(answer.rNext){
            case "Main menu":
                return mainMenu();
            case "Add a role":
                return addRole();
        }
    })
}
function employeeNext(){
    inquirer.prompt(nextEmployee).then(answer => {
        switch(answer.eNext){
            case "Main menu":
                return mainMenu();
            case "Add an employee":
                return addEmployee();
        }
    })
}

// end do next functions //


// add data functions //
function addDepartment(){
    inquirer.prompt(department).then(answer => {
        db.query(`INSERT INTO department (name) VALUES ("${answer.newDept}")`,((err, result)=>{
            if (err) throw err;
            console.log("Department successfully added");
        } ));
    }).then(()=>{
        return mainMenu();
    });
}
//THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
function addRole() {
    inquirer.prompt(role).then(answer => {
        db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.roleTitle}"),("${answer.roleSalary}"), ("${answer.deptId}")`, ((err, result) => {
            if (err) throw err;
            console.log("Successfully created role");
        }));
    })
}
function addEmployee(){
    inquirer.prompt(employee).then(answer => {
        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.eFirstName}", "${answer.eLastName}", "${answer.eRoleId}", "${answer.eManagerId}")`, (err, rows) => {
            if (err) throw err;
            const table = cTable.getTable(rows);
            console.log(table);
        });
    })
}
function updateEmployeeRole() {
    getEmployeeList();
}
function mainMenu() {
    inquirer.prompt(menu).then(answer => {
        switch (answer.main) {
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "View all employees":
                viewEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                getEmployeeList();
                inquirer.prompt(updateEmployee);
        }
    });
}

//connect to database, run seeds/schema queries, then prompt main menu.
function start() {
    db.connect((err) => {
        if (err) throw err;
        console.log('connected');
        db.query(`${sqlSchema}`, (err) => {
            if (err) throw err;
            console.log('schema created successfully');
            db.query(`${sqlSeeds}`, (err) => {
                if (err) throw err;
                console.log('seeded values successfully');
                mainMenu();
            });
        });
    });
}
db.query(`SELECT name FROM department`, (e, rows)=>{
    if (e) throw e;
    departmentsArray = rows;
    departmentsArray.forEach(r =>{
        console.log(r.name);
    })
});
db.query(`SELECT id FROM department`, (err, rows) =>{
        if (err)throw err;
        console.log(rows);
    }
);

start();
