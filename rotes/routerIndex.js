const {Router} = require("express");
const routerIndex = Router();
const mysql = require("mysql2/promise");
// const {connectionConfig}=require("../keys/key");
const {poolConfig}=require("../keys/key");
routerIndex.get('/', async (req, res) => {
    try {
        const pool = await mysql.createPool(poolConfig);
        let usersArray = [];
        let users = await pool.query("CALL users_with_friends_сount();");//юзеры, у которых есть друзья
        if (users[0][0].length === 0) {
            users = await pool.query("CALL all_users_count();");//все юзеры
            usersArray = users[0][0];
        } else {
            let restUsers = await pool.query("CALL users_without_friends_count();");//возвращает юзеров у которых нет друзей
            usersArray = users[0][0].concat(restUsers[0][0]);

            usersArray.sort(function (a, b) {
                if (a.iduser > b.iduser) return -1;
            });
        }
        pool.end();
        res.render("index", {
            user: usersArray,
            layout: false
        });
    } catch (error) {
        res.status(500).json({
            message: " Server error: " + error.message,
        });
    }
});

module.exports = routerIndex;