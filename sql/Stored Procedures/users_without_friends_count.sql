CREATE DEFINER=`b642accb70bcd1`@`%` PROCEDURE `users_without_friends_count`()
BEGIN
set @count=0;
select iduser, first_name, gender, @count as 'count_friends' from users  where iduser not in (select distinct friends.user from friends) 
 order by iduser desc;
END