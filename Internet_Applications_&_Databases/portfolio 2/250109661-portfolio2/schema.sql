CREATE DATABASE project_management;
USE project_management;

-- CLIENTS table

CREATE TABLE Clients (
    client_id INT AUTO_INCREMENT PRIMARY KEY,
    organisation_name VARCHAR(100) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    address VARCHAR(255),
    preferred_contact ENUM('post', 'email') NOT NULL
);

-- POOL MEMBERS table

CREATE TABLE PoolMembers (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    work_address VARCHAR(255),
    home_address VARCHAR(255)
);

-- SKILLS table

CREATE TABLE Skills (
    skill_id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
    skill_type VARCHAR(50) NOT NULL
);

-- PROJECTS table

CREATE TABLE Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    client_id INT,
    title VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2),
    description TEXT,
    phase ENUM('design','development','testing','deployment','complete') NOT NULL,
    FOREIGN KEY (client_id) REFERENCES Clients(client_id)
        ON DELETE SET NULL
);

-- POOL MEMBER SKILLS (M:N) table

CREATE TABLE PoolMemberSkills (
    member_id INT,
    skill_id INT,
    experience_level ENUM('junior','intermediate','expert') NOT NULL,
    PRIMARY KEY (member_id, skill_id),
    FOREIGN KEY (member_id) REFERENCES PoolMembers(member_id)
        ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skills(skill_id)
        ON DELETE CASCADE
);

-- PROJECT SKILLS (M:N) table

CREATE TABLE ProjectSkills (
    project_id INT,
    skill_id INT,
    PRIMARY KEY (project_id, skill_id),
    FOREIGN KEY (project_id) REFERENCES Projects(project_id)
        ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES Skills(skill_id)
        ON DELETE CASCADE
);


-- PROJECT ASSIGNMENTS table

CREATE TABLE ProjectAssignments (
    project_id INT,
    member_id INT,
    PRIMARY KEY (project_id, member_id),
    FOREIGN KEY (project_id) REFERENCES Projects(project_id)
        ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES PoolMembers(member_id)
        ON DELETE CASCADE
);