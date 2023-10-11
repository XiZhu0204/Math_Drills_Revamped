const express = require('express');
const router = express.Router();
const user_performance = require('../models/user_performance');


async function getUsers() {
    const data = await user_performance.find({}, 'user_name -_id');
    return data;
}

// get list all users
router.get('/', (req, res) => {
    getUsers().then((user_names) => {
        for (let i = 0; i < user_names.length; i++){
            user_names[i] = user_names[i]['user_name']
        }
        res.status(200).json(user_names);
    }).catch((err) => {
        res.status(500).json({'Error': err});
    });
})

async function findUser(name) {
    const data = await user_performance.find({user_name: `${name}`});
    return data;
}

// get user by name
router.get('/:name', (req, res) => {
    findUser(req.params.name).then((result) => {
        if (result.length === 0) {
            res.status(404).json({'Error': "User not found."});
        } else {
            // access the array item instead of sending the one entry array
            res.status(200).json(result[0]);
        }
    }).catch((err) => {
        res.status(500).json({'Error': err});
    });
});

async function saveUser(name) {
    let new_user = user_performance();
    new_user.user_name = name;
    const data = await new_user.save();
    return data;
}

// creates new user
router.post('/', (req, res) => {
    saveUser(req.body.user_name).then(() => {
        res.status(200).end();
    }).catch((err) => {
        res.status(400).json({'Error': err});
    });
});

async function deleteUser(name) {
    const data = await user_performance.deleteOne({user_name: `${name}`});
    return data;
}

// delete user by name
router.delete('/:name', (req, res) => {
    deleteUser(req.params.name).then((result) => {
        if (result['deletedCount'] === 0) {
            res.status(404).send("The user did not exist. No changes occured.");
        } else {
            res.status(200).send("The user was deleted.");
        }
    }).catch((err) => {
        res.status(500).json({'Error': err});
    });
});

module.exports = router;