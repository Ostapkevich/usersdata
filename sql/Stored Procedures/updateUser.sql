CREATE DEFINER=`b642accb70bcd1`@`%` PROCEDURE `updateUser`(in id int,n varchar(45),g varchar(8))
BEGIN
update users set first_name=n, gender=g where iduser=id; 
END