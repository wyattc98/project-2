DROP DATABASE IF EXISTS blogdb;
CREATE DATABASE blogdb;

use blogdb;
ALTER TABLE Blogs
ADD title varchar(255);

