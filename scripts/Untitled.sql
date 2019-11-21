SELECT * FROM db_archiver.tblTasks;	

-- IDENTITY SCHEMA
DROP DATABASE identity;
create database identity;

use identity;

-- IDENTITY.IDENTITY table 
-- DROP TABLE IF EXISTS identity.identity;

CREATE TABLE identity.identity (
  id int NOT NULL AUTO_INCREMENT,
  active BOOLEAN,
  locked BOOLEAN,
  uid varchar(50),
  email varchar(50),
  password varchar(100),
  last_logged_in TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8

SELECT * from identity.identity;


-- IDENTITY.IDENTITY_ROLE table 
-- DROP TABLE IF EXISTS identity.identity_role;

CREATE TABLE identity.identity_role (
  identity_id int NOT NULL,
  role_id int,
  PRIMARY KEY (identity_id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8

SELECT * from identity.identity_role;


-- CSRS SCHEMA
DROP DATABASE csrs;
create database csrs;

use csrs;

-- CSRS.IDENTITY table 
-- DROP TABLE IF EXISTS csrs.identity;

CREATE TABLE csrs.identity (
  id int NOT NULL AUTO_INCREMENT,
  uid varchar(50),
  PRIMARY KEY (id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8

SELECT * from csrs.identity;

-- CSRS.CIVIL_SERVANT table 
-- DROP TABLE IF EXISTS csrs.civil_servant;

CREATE TABLE csrs.civil_servant (
  id int NOT NULL AUTO_INCREMENT,
  identity_id int NOT NULL,
  organisational_unit_id int, 
  grade_id int, 
  profession_id int, 
  full_name varchar(50),
  PRIMARY KEY (identity_id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8

SELECT * from csrs.civil_servant;



-- CSRS.CIVIL_SERVANT_OTHER_AREAS_OF_WORK table 
-- DROP TABLE IF EXISTS csrs.civil_servant_other_areas_of_work;

CREATE TABLE csrs.civil_servant_other_areas_of_work (
  civil_servant_id int NOT NULL,
  other_areas_of_work_id int,
  PRIMARY KEY (civil_servant_id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8

SELECT * from csrs.civil_servant_other_areas_of_work;


-- CSRS.CIVIL_SERVANT_INTERESTS table 
-- DROP TABLE IF EXISTS csrs.civil_servant_interests;

CREATE TABLE csrs.civil_servant_interests (
  civil_servant_id int NOT NULL,
  interests_id int,
  PRIMARY KEY (civil_servant_id)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8

SELECT * from csrs.civil_servant_interests;