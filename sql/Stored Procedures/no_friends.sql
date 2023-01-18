CREATE DEFINER=`b642accb70bcd1`@`%` PROCEDURE `no_friends`()
BEGIN
select iduser, first_name, gender from users where iduser not in (select distinct friends.user from friends)
order by iduser desc;
END