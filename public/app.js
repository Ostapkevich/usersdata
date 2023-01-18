const targetEl = document.getElementById('defaultModal');
const options = {
    placement: 'bottom-right',
    backdrop: 'static'
    // backdropClasses: 'bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40',
};

const modal = new Modal(targetEl, options);

document.getElementById('nameUser ').addEventListener('input', checkValue)

async function generateUsers() {

    try {
        let users = await fetch("/api/users");
        if (users.ok) {
            let result = await users.json();
            const tableUsers = document.getElementById('users');
            const tableFriends = document.getElementById('friends');
            tableUsers.innerHTML = '';
            tableFriends.innerHTML = '';
            for (let elem of result) {
                tableUsers.innerHTML = tableUsers.innerHTML +
                    `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                ${elem.iduser}
            </th>
            <td class="py-4 px-6">
                ${elem.first_name}
            </td>
            <td class="py-4 px-6">
                ${elem.gender}
            </td>
            <td class="py-4 px-6">
              0
            </td>
        </tr>`
            }
        } else {
            const msg = await users.json();
            alert(`Server error: ${users.status}. ${msg.message}`);
        }
    } catch
        (error) {
        alert(error);
    }
}

async function generateFriends() {
    try {
        let friends = await fetch("/api/friends");
        if (friends.ok) {

            alert('Friends have been generated successfully.');
            window.location.reload();
        } else {
            const msg = await friends.json();
            alert(`Friends have not been generated. Server error: ${friends.status}. ${msg.message}`);
        }
    } catch (error) {
        alert(error);
    }
}

function go() {

    if (document.getElementById('radioUser').checked) {

        getFriendsByIdUser();
    }
    if (document.getElementById('radioTop').checked) {
        getTop();
    }
    if (document.getElementById('radioNoFriends').checked) {
        getZero();
    }
}

async function getFriendsByIdUser() {
    try {
        const elem = document.getElementById('inputUser');
        if (!elem.value) {
            return
        }
        const table = document.getElementById('users').children;
        const elInfo = document.getElementById('info');
        let strInfo = '';
        let Info = [];
        for (const child of table) {
            let col = child.firstElementChild;
            if (col.innerText === elem.value) {
                for (const element of child.children) {
                    Info.push(element.innerText);
                }
                strInfo = `idUser: ${Info[0]}; name: ${Info[1]}; gender: ${Info[2]}; friends: ${Info[3]}`;
                break;
            }
        }
        const friends = await fetch(`/api/users${elem.value}/friends`);
        if (friends.ok) {

            const result = await friends.json();
            if (result[0].length === 0) {
                alert(`There are no any friends for ID_User=${elem.value}`);
                return;
            }
            const tableFriends = document.getElementById('friends');
            tableFriends.innerHTML = '';
            for (let elem of result[0]) {
                tableFriends.innerHTML = tableFriends.innerHTML +
                    `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    ${elem.iduser}
                </th>
                <td class="py-4 px-6">
                    ${elem.first_name}
                </td>
                <td class="py-4 px-6">
                    ${elem.gender}
                </td>
                <td class="py-4 px-6">
                   ${elem.count_friends}
                </td>
            </tr>`
            }
            elem.value = null;
            elInfo.innerText = strInfo;
        } else {
            const msg = await friends.json();
            alert(`Server error: ${friends.status}. ${msg.message}`);
        }
    } catch (error) {
        alert(error);
    }
}

async function getTop() {
    try {
        const elInfo = document.getElementById('info');
        elInfo.innerText = 'Top 5 users';
        const users = await fetch(`/api/max-following`);
        if (users.ok) {
            let result = await users.json();
            const tableFriends = document.getElementById('friends');
            tableFriends.innerHTML = '';
            for (let elem of result[0]) {
                tableFriends.innerHTML = tableFriends.innerHTML +
                    `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    ${elem.iduser}
                </th>
                <td class="py-4 px-6">
                    ${elem.first_name}
                </td>
                <td class="py-4 px-6">
                    ${elem.gender}
                </td>
                <td class="py-4 px-6">
                   ${elem.count_friends}
                </td>
            </tr>`
            }
        } else {
            const msg = await users.json();
            alert(`Server error: ${users.status}. ${msg.message}`);
        }
    } catch (error) {
        alert(error);
    }
}

async function getZero() {
    try {
        const elInfo = document.getElementById('info');
        elInfo.innerText = 'No friends';
        const users = await fetch(`/api/not-following`);
        if (users.ok) {
            let result = await users.json();
            const tableFriends = document.getElementById('friends');
            tableFriends.innerHTML = '';
            for (let elem of result[0]) {
                tableFriends.innerHTML = tableFriends.innerHTML +
                    `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    ${elem.iduser}
                </th>
                <td class="py-4 px-6">
                    ${elem.first_name}
                </td>
                <td class="py-4 px-6">
                    ${elem.gender}
                </td>
                <td class="py-4 px-6">
                  0
                </td>
            </tr>`
            }
        } else {
            const msg = await users.json();
            alert(`Server error: ${users.status}. ${msg.message}`);
        }
    } catch (error) {
        alert(error);
    }
}

async function addUser() {
    try {
        const selectGender = document.getElementById("gender");
        const user = {
            name: document.getElementById("nameUser ").value,
            gender: selectGender.options[selectGender.selectedIndex].text
        };
        if ((user.name === '') || (user.gender === '')) {
            return;
        }
        let result = await fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(user)
        });
        if (result.ok) {

            let idUser = await result.text();
            const tableFriends = document.getElementById('users');
            tableFriends.innerHTML =
                `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <th scope="row" class="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    ${idUser}
                </th>
                <td class="py-4 px-6">
                    ${user.name}
                </td>
                <td class="py-4 px-6">
                    ${user.gender}
                </td>
                <td class="py-4 px-6">
                  0
                </td>
            </tr>` + tableFriends.innerHTML;
            document.getElementById("nameUser ").value = '';
            selectGender.selectedIndex = null;
            alert(`User ${user.name} with idUser=${idUser} has been added.`);
        } else {
            const msg = await result.json();
            alert(`User ${user.name} has not been added. Server error: ${result.status}. ${msg.message}`);
        }
    } catch
        (error) {
        alert(error);
    }
}

function cancel() {
    document.getElementById("nameUser ").value = '';
    document.getElementById("gender").selectedIndex = null;
    modal.hide();
}

async function deleteUser() {
    try {
        let id = prompt('Enter idUser.')
        if (id === null || id === '') {
            return;
        } else if (!isFinite(id)) {
            alert('Incorrect data');
            return;
        }
        const tbody = document.getElementById('users');
        let deletedUserRow = false;
        let i = 0;
        for (const row of tbody.rows) {
            if (row.cells[0].innerText === id) {
                deletedUserRow = true;
                break;
            }
            i++;
        }
        if (deletedUserRow === false) {
            alert(`user with idUser=${id} does not exist.`);
            return;
        }
        let result = await fetch("/api", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify({idUser: Number(id)})
        });
        if (result.ok) {
            tbody.deleteRow(i);
            alert(`User with idUser=${id} has been deleted.`);

        } else {
            const msg = await result.json();
            alert(msg.message);
        }
    } catch (error) {
        alert(error);
    }
}

async function editUser() {
    try {
        const selectGender = document.getElementById("gender");
        const user = {
            id: Number(document.getElementById("nameUser ").dataset.idUserDataset),
            name: document.getElementById("nameUser ").value,
            gender: selectGender.options[selectGender.selectedIndex].text
        };
        console.log(user);
        let result = await fetch("/api", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(user)
        });
        if (result.ok) {
            const tableFriends = document.getElementById('users');
            const numberRow = Number(document.getElementById("nameUser ").dataset.rowNumberDataset);
            tableFriends.rows[numberRow].cells[1].innerText = user.name;
            tableFriends.rows[numberRow].cells[2].innerText = user.gender;
            alert(`User with idUser=${user.id} has been edited.`);
        } else {
            const msg = await result.json();
            alert(`User with idUser=${user.id} has not been edited. Server error: ${result.status}. ${msg.message}`);
        }
    } catch
        (error) {
        alert(error);
    }
}

function checkValue(e) {
    let str = e.target.value;

    if ((str !== "") && str[e.target.value.length - 1].match(/[_a-zа-я]/i) === null) {
        alert(`Only letters "a-z", "а-я" and "_"`);
        e.target.value = str.slice(0, str.length - 1);
    }
}

function showModalAdd() {
    document.getElementById('modalAction').innerText = 'Add user';
    document.getElementById('modalOk').innerText = 'Add user';
    modal.show();
}

function showModalEdit() {
    let idUser = prompt('Enter idUser.');
    document.getElementById("nameUser ").dataset.idUserDataset = idUser;
    if (idUser === null || idUser === '') {
        return;
    } else if (!isFinite(idUser)) {
        alert('Incorrect data');
        return;
    }
    const tbody = document.getElementById('users');
    let editUserRow = false;
    let i = 0;
    for (const row of tbody.rows) {  // по всем строкам таблицы
        if (row.cells[0].innerText === idUser) { // ищем строку с idUser, что ввел пользователь
            editUserRow = true;                                                                                          // пользователь найден в таблице
            document.getElementById('modalOk').innerText = 'Edit user';
            document.getElementById('modalAction').innerText = `Edit idUser=${idUser}, ${row.cells[1].innerText}, ${row.cells[2].innerText}`;//заполняем название модального окна
            document.getElementById("nameUser ").value = row.cells[1].innerText;                                 // заполняем поле имя в модальном окне, найденным в таблице
            document.getElementById("nameUser ").dataset.rowNumberDataset = i;  //записываем в атрибут data тега Input имени юзера в  номер найденной строки в таблице юзеров
            if (row.cells[2].innerText === 'male') {                                                                   // в модальном окне устанавливаем в selectgender нужный вариант
                document.getElementById("gender").selectedIndex = 1;
            } else {
                document.getElementById("gender").selectedIndex = 2;
            }
            break;
        }
        i++;
    }
    if (editUserRow === false) {              // если editUserRow === fals, значит пользователь не был найден
        alert(`User with idUser=${idUser} does not exist.`);
        return;
    }
    modal.show();
}

function modalSelectAction() {
    if (document.getElementById('modalAction').innerText === 'Add user') {
        modal.hide();
        addUser();
    } else {
        modal.hide();
        editUser();
    }
}



