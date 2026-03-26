USE project_management;

-- INSERT SKILLS with some examples

INSERT INTO Skills (skill_name, skill_type) VALUES
('Java', 'Backend'),
('JavaScript', 'Frontend'),
('JUnit', 'Testing'),
('Photoshop', 'Design'),
('MySQL', 'Database'),
('Python', 'Backend');

-- INSERT POOL MEMBERS

INSERT INTO PoolMembers (first_name, last_name, email, phone, work_address, home_address) VALUES
('Jenny', 'Smith', 'jenny@example.com', '07123456789', 'Company Office', '123 Main St'),
('John', 'Doe', 'john@example.com', '07987654321', 'Company Office', '456 Oak Rd');

-- ASSIGN SKILLS TO MEMBERS

INSERT INTO PoolMemberSkills VALUES
(1, 1, 'expert'),        -- Jenny - Java
(1, 5, 'intermediate'),  -- Jenny - MySQL
(2, 2, 'junior'),        -- John - JavaScript
(2, 4, 'expert');        -- John - Photoshop

-- INSERT CLIENTS

INSERT INTO Clients (organisation_name, first_name, last_name, email, address, preferred_contact) VALUES
('TechCorp Ltd', 'Alice', 'Brown', 'alice@techcorp.com', 'London', 'email'),
('Creative Solutions', 'Mark', 'Green', 'mark@creative.com', 'Birmingham', 'post');

-- INSERT PROJECT

INSERT INTO Projects (client_id, title, start_date, end_date, budget, description, phase) VALUES
(1, 'Inventory Management System', '2026-03-01', '2026-09-01', 50000.00,
 'System to manage warehouse inventory', 'development');

-- PROJECT REQUIRES TWO SKILLS

INSERT INTO ProjectSkills VALUES
(1, 1),  -- Java
(1, 5);  -- MySQL

-- QUERY: FIND MATCHING POOL MEMBERS

SELECT DISTINCT pm.member_id, pm.first_name, pm.last_name
FROM PoolMembers pm
JOIN PoolMemberSkills pms ON pm.member_id = pms.member_id
JOIN ProjectSkills ps ON pms.skill_id = ps.skill_id
WHERE ps.project_id = 1;

-- ASSIGN MATCHING MEMBERS

INSERT INTO ProjectAssignments VALUES (1, 1);

-- ADDITIONAL REPORT 1

SELECT p.title, c.organisation_name
FROM Projects p
JOIN Clients c ON p.client_id = c.client_id;

-- ADDITIONAL REPORT 2

SELECT pm.first_name, pm.last_name, COUNT(pms.skill_id) AS total_skills
FROM PoolMembers pm
LEFT JOIN PoolMemberSkills pms ON pm.member_id = pms.member_id
GROUP BY pm.member_id;