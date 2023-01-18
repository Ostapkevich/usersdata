CREATE DEFINER=`b642accb70bcd1`@`%` PROCEDURE `top`()
BEGIN
select iduser, first_name, gender, get_friends.count_friends from users join get_friends on users.iduser=get_friends.user
 order by get_friends.count_friends desc
 limit 5;
END