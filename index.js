const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');

const newDeptPrompt = [
    {
        type: 'input',
        name: 'name',
        message: "What's the name of the department you'd like to add?",
        validate: nameInput => {
            if (nameInput) {
                return true;
            } else {
                console.log('need a valid name');
                return false;
            }
        }
    }
];
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    }
);

function start(){
    db.connect();
    mainMenu();
}




const mainMenu = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'menu',
            message: 'Please select an action:',
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add a New Department', 'Add a New Role', 'Add a New Employee', 'Update Employee Role', 'Quit'],
            validate: actionInput => {
                if (actionInput) {
                    return true;
                } else {
                    console.log('Please select an action.')
                    return false;
                }
            }
        }
    ]).then(action => {
        console.log(action.menu);

            if (action.menu === 'View All Departments') {
                viewDepartments();
            }
            if  (action.menu==='View All Roles')
                 viewRoles();
            if (action.menu==='View All Employees')
                 viewEmployees();
            if (action.menu==='Add a New Department')
                 newDepartment();
            if (action.menu==='Add a New Role')
                 newRole();
            if (action.menu==='Add a New Employee')
                 newEmployee();
            if (action.menu==='Update Employee Role')
                 updateRole();
            else console.log("node index.js to start again")

    });
};

const viewDepartments = () => {
    db.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};

const viewRoles = () => {
    db.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};

const viewEmployees = () => {
    db.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;
        console.table(res);
        mainMenu();
    });
};

const newDepartment = () => {
    console.log(`please enter a department`);

    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: "What's the name of the department you'd like to add?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log('need a valid name');
                    return false;
                }
            }
        }
    ]).then((department) => {
        db.query('INSERT INTO departments SET ?', {
            name: department.name
        });

        mainMenu();
    });
};

const newRole = () => {
    console.log(`Enter a new role`);

    db.query('SELECT * FROM departments', (err, res) => {
        if (err) throw err;;

        return inquirer.prompt([
            {
                type: 'input',
                name: 'job_title',
                message: "What's the new job title?",
                validate: job_titleInput => {
                    if (job_titleInput) {
                        return true;
                    } else {
                        console.log("valid name required")
                    }
                }
            },
            {
                type: 'input',
                name: 'salary',
                message: "What's the salary?",
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log("Need valid salary.")
                    }
                }
            },
            {
                type: 'list',
                name: 'department_id',
                message: "What's the department id?",
                choices: res.map(departments => departments.name),
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log("Valid dept. id required")
                    }
                }
            }
        ]).then((role) => {
            const selectedDepartment = res.find(departments => departments.name === role.department_id);

            db.query('INSERT INTO roles SET ?', {
                job_title: role.job_title,
                salary: role.salary,
                department_id: selectedDepartment.id
            });

            mainMenu();
        });
    })
};

const newEmployee = () => {
    console.log(`Enter new employee`);

    db.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;;
        return inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "What's the new employee's first name?",
                validate: first_nameInput => {
                    if (first_nameInput) {
                        return true;
                    } else {
                        console.log("No first name has been entered, please try again.")
                    }
                }
            },
            {
                type: 'input',
                name: 'last_name',
                message: "What's the new employee's last name?",
                validate: last_nameInput => {
                    if (last_nameInput) {
                        return true;
                    } else {
                        console.log("No last name has been entered, please try again.")
                    }
                }
            },
            {
                type: 'input',
                name: 'manager_id',
                message: "What's the new employee's manager's employee id?",
                validate: manager_idInput => {
                    if (manager_idInput) {
                        return true;
                    } else {
                        console.log("No manager id has been entered, please try again.")
                    }
                }
            },
            {
                type: 'list',
                name: 'role_name',
                message: "What's the new employee's role?",
                choices: res.map(roles => roles.job_title),
                validate: role_idInput => {
                    if (role_idInput) {
                        return true;
                    } else {
                        console.log("No role id has been entered, please try again.")
                    }
                }
            }
        ]).then((employee) => {
            const selectedRole = res.find(roles => roles.job_title === employee.role_name);

            db.query('INSERT INTO employees SET ?', {
                first_name: employee.first_name,
                last_name: employee.last_name,
                manager_id: employee.manager_id,
                role_id: selectedRole.id
            });

            mainMenu();
        });
    });
};

const updateRole = () => {
    db.query('SELECT * FROM employees', (err, res) => {
        if (err) throw err;;

        return inquirer.prompt([
            {
                type: 'list',
                name: 'employee_name',
                message: "Which employee would you like to update?",
                choices: res.map(employees => employees.last_name),
                validate: employee_idInput => {
                    if (employee_idInput) {
                        return true;
                    } else {
                        console.log('No employee has been selected, please try again.');
                        return false;
                    }
                }
            }
        ]).then((employeeName) => {
            const employeeLastName = employeeName.employee_name;

            db.query('SELECT * FROM roles', (err, res) => {
                if (err) {
                    throw err;
                };

                return inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role_id',
                        message: "What's the role id you'd like to update this employee to?",
                        choices: res.map(roles => roles.job_title),
                        validate: role_idInput => {
                            if (role_idInput) {
                                return true;
                            } else {
                                console.log('No role id has been entered, please try again.');
                                return false;
                            }
                        }
                    }
                ]).then(selectedEmployee => {
                    const selectedRole = res.find(roles => roles.job_title === selectedEmployee.role_id);

                    db.query("UPDATE employees SET ? WHERE last_name = " + "'" + employeeLastName + "'", {
                        role_id: selectedRole.id
                    });

                    mainMenu();
                });
            });
        });
    });
};


start();
