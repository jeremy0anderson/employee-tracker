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
const updateRolePrompt = [
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
];
const updateRolePrompt2=[
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
];
const menuPrompt=[
    {
        type: 'list',
        name: 'opt',
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
]
// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_db'
    },
    ()=>{console.log('connected')}
);

db.connect(function() {
    mainMenu();
});


const mainMenu = () => {
    return inquirer.prompt(menuPrompt).then(action => {
        console.log(action.opt);
        switch(action.opt){

            case action.opt === 'View All Departments':
                viewDepartments();
                break
            case action.opt === 'View All Roles':
                viewRoles();
                break
            case action.opt === 'View All Employees':
                viewEmployees();
                break
            case action.opt === 'Add a New Department':
                newDepartment();
                break
            case action.opt === 'Add a New Role':
                newRole();
                break
            case action.opt === 'Add a New Employee':
                newEmployee();
                break
            case action.opt === 'Update Employee Role':
                updateRole();
                break
            default:
                console.log('Goodbye! To restart, clear terminal with CNTRL+C and run command "node app.js"')
        }
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

    return inquirer.prompt(newDeptPrompt).then((department) => {
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

        return inquirer.prompt(newRolePrompts).then((role) => {
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

        return inquirer.prompt(updateRolePrompt).then((employeeName) => {
            const employeeLastName = employeeName.employee_name;

            db.query('SELECT * FROM roles', (err, res) => {
                if (err) {
                    throw err;
                };

                return inquirer.prompt(updateRolePrompt2).then(selectedEmployee => {
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


