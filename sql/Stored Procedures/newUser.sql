CREATE DEFINER=`b642accb70bcd1`@`%` PROCEDURE `newUser`(in n varchar(45), g varchar(8))
BEGIN
INSERT users (first_name, gender) VALUES (n, g);
SELECT LAST_INSERT_ID();
END