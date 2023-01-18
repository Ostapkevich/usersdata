CREATE DEFINER=`b642accb70bcd1`@`%` PROCEDURE `users_with_friends_сount`()
BEGIN
select users.iduser, users.first_name, users.gender, get_friends.count_friends from users
 join get_friends on users.iduser=get_friends.user
 order by users.iduser desc;
END