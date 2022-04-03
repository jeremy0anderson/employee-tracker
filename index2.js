


// const inquirer = require('inquirer');
// const cTable = require("console.table");
// const mysql = require('mysql2');
// const dotenv = require('dotenv');
//
// // const db = mysql.createConnection({
// //     host: "localhost",
// //     user: "root",
// //     password: process.env.DB_PASSWORD
// // })
// let r;
//
// dotenv.config();
// const db = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: process.env.DB_PASSWORD,
//     database: "employee_db"
// });
//
//
// function p(q){
//     return inquirer.prompt(q);
// }
// const menu = [{
//     type: "list",
//     name: "main",
//     message: "choose an option",
//     choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee role"]
// }];
//
// const department =[{
//     type: "input",
//     name:"newDept",
//     message:"Please enter the name of the department you'd like to add"
// }];
// const role =[
//     {
//         type: "input",
//         name:"roleTitle",
//         message:"Please enter the name of the role you'd like to add"
// },
//     {
//         type: "number",
//         name:"roleSalary",
//         message:"Please enter the salary amount this role receives"
//     },
//     {
//         type:"list",
//         name:"deptId",
//         message:"Please select the department id this role falls under",
//         choices: []
//     }
// ];
// const employee = [
//     {
//         type: "input",
//         name: "eFirstName",
//         message:"Enter the employee's first name"
//     },
//     {
//         type: "input",
//         name: "eLastName",
//         message:"Enter the employee's last name"
//     },
//     {
//         type: "input",
//         name: "eRoleId",
//         message:"Enter the role id the employee falls under"
//     },
//     {
//         type: "input",
//         name: "eManagerId",
//         message:"Enter the employee manager's ID"
//     }
// ];
//
// function viewDepartments() {
//     return db.query(`
//         SELECT * FROM department;
//     `, (err, rows)=> {
//         if (err) throw err;
//         let table  = cTable.getTable(rows);
//         console.log(table);
//         mainMenu();
//     });
// }
//
// function viewRoles(){
//     const q = db.query(`
//         SELECT * FROM role;
//     `, (err, rows)=> {
//         if (err) throw err;
//         let table  = cTable.getTable(rows);
//         console.log(table);
//         mainMenu();
//     });
// }
//
//
// function viewEmployees(){
//     const q = db.query(`
//         SELECT * FROM employee;
//     `, (err, rows)=> {
//         if (err) throw err;
//         let table  = cTable.getTable(rows);
//         console.log(table);
//         mainMenu();
//     });
// }
// function getIds(employee){
//     switch(employee){
//         case "role":
//
//     }
// }
//
// function addDepartment(){
//     p(department).then(answer => {
//         db.query(`INSERT INTO department (name) VALUES ("${answer.newDept}")`,((err, result)=>{
//                 if (err) throw err;
//             console.log("Department successfully added");
//         } ));
//     });
// }
//
// function addEmployee(){
//     p(employee).then(answer => {
//         db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answer.eFirstName}", "${answer.eLastName}", "${answer.eRoleId}", "${answer.eManagerId}")`, (err, rows) => {
//             if (err) throw err;
//             const table = cTable.getTable(rows);
//             console.log(table);
//         });
//     })
// }
//
// function addRole() {
//     p(role).then(answer => {
//         db.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answer.roleTitle}"),("${answer.roleSalary}"), ("${answer.deptId}")`, ((err, result) => {
//             if (err) throw err;
//             console.log("Successfully created role");
//         }));
//     })
// }
//
// function mainMenu() {
//     console.log('running');
//     inquirer.prompt(menu).then(answer => {
//         switch (answer.main) {
//             case "View all departments":
//                 viewDepartments();
//                 break;
//             case "View all roles":
//                 viewRoles();
//                 p(menu);
//                 break;
//             case "View all employees":
//                 viewEmployees();
//                 p(menu);
//                 break;
//             case "Add a department":
//                 addDepartment();
//                 break;
//             case "Add a role":
//                 addRole();
//                 p(menu);
//                 break;
//             case "Add an employee":
//                 addEmployee();
//                 p(menu);
//                 break;
//         }
//     });
// }
//
//
// db.connect(err => {
//     if (err) throw err;
//     console.log("connected");
//     mainMenu();
//
// });