const {Router} = require("express");
const path = require("path");
const fs = require("fs");
const routerApi = Router();
const mysql = require("mysql2/promise");
const {connectionConfig} = require("../keys/key");
const {poolConfig} = require("../keys/key");
routerApi.get("/users", async (req, res) => {
    try {
        let insertValue = '';
        const usersArray = [];
        let mailArray = [];
        let femailArray = [];
        let randomArray = [];
        function promiseReadeFile(src) {
            return new Promise((resolve, reject) => {
                fs.readFile(path.join(__dirname, src), "utf-8",
                    (err, data) => {
                        if (err) {
                            reject(err)
                        } else {
                            resolve(data);
                        }
                    }
                );
            })
        }

        Promise.all([promiseReadeFile('../public/male.txt'), promiseReadeFile('../public/male.txt')])
            .then((arr) => {
                mailArray = arr[0].split('\n');
                femailArray = arr[1].split('\n');
                if (mailArray.length < femailArray.length) {
                    addToUsersArray(mailArray, femailArray, 'mail', 'femail');
                } else {
                    addToUsersArray(femailArray, mailArray, 'femail', 'mail');
                }
           
                random();
                createInsertValue();
                execute();
            });

        function addToUsersArray(a, b, gender1, gender2) {//добавляем в общий массив юзеров из двух  массивов муж. и жен. по одной записи по очереди, чтобы чередовались м. и ж.
            for (let i = 0; i < a.length; i++) {
                usersArray.push([a[i], gender1]);
                usersArray.push([b[i], gender2]);
            }
            for (let i = a.length; i < b.length; i++) { // добавляем оставшихся юзеров из массива, где их было больше
                usersArray.push([b[i], gender2]);
            }
        }

        function random() {
            const k = usersArray.length;
            while (randomArray.length < k) {
                let number = Math.floor(Math.random() * k);
                if (!randomArray.includes(number)) {
                    randomArray.push(number);
                }
            }
        }

        function createInsertValue() {
            for (let number of randomArray) {
                insertValue = insertValue + `('${usersArray[number][0]}','${usersArray[number][1]}'),`;
            }
            insertValue = insertValue.slice(0, insertValue.length - 1);
        }

        async function execute() {
            const pool = await mysql.createPool(poolConfig);
            await pool.query('DELETE FROM users;');
            await pool.query(`INSERT INTO users (first_name, gender) VALUES ${insertValue};`);
            const result = await pool.query("SELECT * FROM users ORDER BY idUser DESC;");
            pool.end();
            res.json(result[0]);
        }
    } catch (error) {
        res.json({
            message: " Server error: " + error.message
        });
    }
});

routerApi.get("/friends", async (req, res) => {
    try {
        const pool = await mysql.createPool(poolConfig);
        const users = await pool.query("SELECT iduser FROM users;");
        if (users[0].length > 0) {
            let insertValue = '';
            const k = users[0].length;//кол-во имеющихся юзеров
            let i = 0,
                j = 0;
            const first = Math.floor(k * 0.3);
            const second = Math.floor(k * 0.6);
            const third = Math.floor(k * 0.9);
            let userid = [];//массив друзей для одного юзера
            let number;//номер друга в массиве userid

            for (const element of users[0]) {//для каждого юзера из выбранных в базе определяем друзей

                let colFriends = Math.floor(Math.random() * 201);//max кол-во друзей

                if (j === first) {// пропускаем одного юзера, оставляем без друзей
                    j++;
                    continue;
                }
                if (j === second) {//пропускаем второго юзера, оставляем без друзей
                    j++;
                    continue;
                }
                if (j === third) {//пропускаем третьего юзера, оставляем без друзей
                    j++;
                    continue;
                }

                while (i < colFriends) {
                    number = Math.floor(Math.random() * k);//определяем номер друга в массиве юзеров users[0]
                    if (userid.includes(number, 0) || userid.includes(element.iduser, 0)) {//проверка на повторяющихся друзей или самого юзера (чтобы не былдругом сам у себя
                        i++;
                        continue;
                    }
                    userid.push(number);
                    insertValue = insertValue + `(${element.iduser},${users[0][number].iduser}),`;
                    i++;
                }
                userid.length = 0;
                i = 0;
                j++;
            }
            insertValue = insertValue.slice(0, insertValue.length - 1);

            await pool.query('DELETE FROM friends');
            await pool.query(`INSERT INTO friends(user, friend) VALUES ${insertValue};`);
            res.status(201).send('Created');
        } else {
            res.status(501).send('Not created');
        }

        pool.end();
    } catch (error) {
        res.status(500).json({
            message: " Server error: " + error.message
        });
    }
});
routerApi.get("/users:usr/friends", async (req, res) => {
    try {
        const connection = await mysql.createConnection(connectionConfig);
        const user = req.params.usr;
        let friends = await connection.query(` CALL friends_by_user(${user});`);
        res.json(friends[0]);
    } catch
        (error) {
        res.status(500).json({message: " Server error: " + error.message});
    }
});
routerApi.get("/max-following", async (req, res) => {
    try {
        const connection = await mysql.createConnection(connectionConfig);
        let friends = await connection.query(` CALL top;`);
        res.json(friends[0]);
    } catch
        (error) {
        res.status(500).json({message: " Server error: " + error.message});
    }
});
routerApi.get("/not-following", async (req, res) => {
    try {
        const connection = await mysql.createConnection(connectionConfig);
        let friends = await connection.query(` CALL no_friends();`);
        res.json(friends[0]);
    } catch
        (error) {
        res.status(500).json({message: " Server error: " + error.message});
    }
});
routerApi.put("/", async (req, res) => {
    try {
        const connection = await mysql.createConnection(connectionConfig);
        await connection.query(` CALL updateUser(${req.body.id},'${req.body.name}','${req.body.gender}');`);
        res.status(204);
        res.end();
    } catch
        (error) {
        res.status(500).json({message: " Server error: " + error.message});
    }
});
routerApi.delete("/", async (req, res) => {
    try {
        const connection = await mysql.createConnection(connectionConfig);
        const str = `DELETE FROM users WHERE iduser=${req.body.idUser};`
        console.log(str);
        let delOk = await connection.query(`DELETE FROM users WHERE iduser=${req.body.idUser};`);
        console.log(delOk);
        // res.status(204).json({message: `User idUser ${req.body.idUser} has been deleted.`});
        res.status(204);
        res.end();
    } catch
        (error) {
        res.status(500).json({message: " Server error: " + error.message});
    }
});
routerApi.post("/", async (req, res) => {
    try {
        const connection = await mysql.createConnection(connectionConfig);
        const result = await connection.query(`CALL newUser('${req.body.name}', '${req.body.gender}');`);
        res.status(201);
        res.send(`${result[0][0][0]['LAST_INSERT_ID()']}`);      //запрос  возвращает iduser последней добавленной записи
        connection.end();
    } catch
        (error) {
        res.status(500).json({message: " Server error: " + error.message});
    }
});

module.exports = routerApi;
