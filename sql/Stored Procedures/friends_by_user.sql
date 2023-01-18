CREATE DEFINER=`b642accb70bcd1`@`%` PROCEDURE `friends_by_user`(in usr int)
BEGIN
select first_name, gender, users.iduser, IFNULL(get_friends.count_friends, 0) AS count_friends  from users join friends on users.iduser=friends.friend
left join get_friends on users.iduser=get_friends.user
where friends.user=usr
order by users.iduser desc;
END