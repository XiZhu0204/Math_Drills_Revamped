const express = require("express");
const moment = require("moment");
const router = express.Router();
const user_performance = require("../models/user_performance");

async function getUserPerf(name) {
  const data = await user_performance.find({user_name: `${name}`}, "performance -_id");
  return data;
}

// gets performance by name
router.get("/:name", (req, res) => {
  getUserPerf(req.params.name).then((result) => {
    // access the array item instead of sending the one entry array
    res.status(200).json(result[0]["performance"]);
  }).catch((err) => {
    res.status(500).send(`Error occurred: ${err}`);
  });
});

async function updateUserPerf(name, user_data) {
  const data = await user_performance.findOneAndUpdate({ user_name: `${name}` }, { performance: user_data });
  return data;
}

// update performance
router.post("/", (req, res) => {
  const MAX_TIMES_STORED = 10;

  const user_name = req.body.user_name;
  const question_type = req.body.question_type;
  const average_time = req.body.average_time;

  const today = moment().format('MMMM Do YYYY');

  // get the performance object and update corresponding field
  getUserPerf(user_name).then((result) => {
    let performance_collection = result[0]["performance"];
    let question_type_performance = performance_collection[question_type];

    // add to beginning of array to achieve reverse chronological order
    question_type_performance.unshift({
      avg_time: average_time,
      date: today,
    });
    // limit the size of the array to store only the most recent 10 attempts
    if (question_type_performance.length > MAX_TIMES_STORED) {
      question_type_performance.pop();
    }

    performance_collection[question_type] = question_type_performance;
    updateUserPerf(user_name, performance_collection).then((result) => {
      res.status(200).json(result["performance"][question_type]);
    }).catch((err) => {
      res.status(500).json({ Error: err });
    });
  }).catch((err) => {
    res.status(500).json({ Error: err });
  });
});

module.exports = router;
