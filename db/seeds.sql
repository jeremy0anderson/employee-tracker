USE employee_db;
INSERT INTO department (name) VALUES ("HR"), ("ACCOUNTING"), ("MARKETING");
INSERT INTO role (title, salary, department_id) VALUES ("HR REP", 124000.00, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("first name", "last name", 1, NULL);
