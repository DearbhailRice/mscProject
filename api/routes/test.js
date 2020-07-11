var express = require("express");
var router = express.Router();
var connection = require('../bin/database');
router.get("/test'", function (res) {
    connection.query(
        "SELECT * FROM 'test_table'", function (error, results, feilds) {
            if (error) throw error;
            res.json(results);
            result = JSON.stringify(results, null, 4);
            console.log("test", result)
        }

    )
    res.send(result);
});

module.exports = router;





