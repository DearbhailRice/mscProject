var express = require("express");
var router = express.Router();
var connection = require('../bin/database');

router.get("/test'", function (req, res) {
    console.log("in tests router api");
    connection.query(
        "SELECT * FROM test_table",
        req.params.test_id,
        function (error, results, feilds) {
            if (error) throw error;
            res.json(results);
        }
    );
    res.send(results);
});



//     connection.query(
//         "SELECT * FROM 'test_table'", function (error, results, feilds) {
//             if (error) throw error;
//             res.json(results);
//             // result = JSON.stringify(results, null, 4);
//             // console.log("test", result)
//         }

//     )
//     res.send(result);
// });

// INSERT INTO `msc_project`.`test_table` (`test_id`, `first_name`, `second_name`) VALUES (NULL, 'first name 3', 'second name 3');

module.exports = router;





