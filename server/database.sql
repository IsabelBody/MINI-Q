CREATE DATABASE miniqb;

-- Table 1: Clinicians
CREATE TABLE clinicians (
    clinician_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

-- Table 2: Responses
CREATE TABLE responses (
    response_id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    NHI VARCHAR(255) NOT NULL,
    dateofbirth DATE,
    submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    response JSON NOT NULL, -- response, medicine, comment
    actioned BOOLEAN DEFAULT FALSE
);

-- Table 3: Invitation clinicians to register
CREATE TABLE invitations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE
);

-- Table 4: Resources 
/* Allow admins to iterate upon resources such as privacy statement.
  You are able to store html tags for styling. Or even markdown. 
*/ 
CREATE TABLE Resources (
    id SERIAL PRIMARY KEY,
    type VARCHAR(255) UNIQUE NOT NULL,  -- To identify the type of resource (e.g., 'privacy_statement')
    content TEXT NOT NULL               -- The actual text or HTML content of the resource
);


