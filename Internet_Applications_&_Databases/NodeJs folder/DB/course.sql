CREATE DATABASE course;
USE course;

CREATE TABLE user ( 
  `id` INT NOT NULL AUTO_INCREMENT,  
  `username` VARCHAR(25) NOT NULL,
  `password` VARCHAR(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

CREATE TABLE course (
    `cid` INT NOT NULL AUTO_INCREMENT,
    `courseid` VARCHAR(25) NOT NULL,
    `coursename` VARCHAR(100) NOT NULL,
    `studentnum` INT UNSIGNED,
    PRIMARY KEY (`cid`)
) ENGINE = InnoDB;