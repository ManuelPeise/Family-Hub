-- Runs once, when the mysql-data volume is created.
-- MYSQL_DATABASE only provisions StudyHubContextDb; the Identity context needs its own database.
CREATE DATABASE IF NOT EXISTS `IdentityContextDb`;
GRANT ALL PRIVILEGES ON `IdentityContextDb`.* TO 'DevUser'@'%';
FLUSH PRIVILEGES;
