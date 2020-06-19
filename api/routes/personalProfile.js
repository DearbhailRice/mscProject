var express = require("express");
var router = express.Router();
var connection = require('../bin/database');

router.get("/personal-proile", function (res) {

    connection.query(
        "SELECT user_id, user_name, user_email_address,user_start_date, user_bank_staff_number,user_current_trust_employee_in_current_role,contact_details_tel_number, contact_details_personal_email,  contact_details_preffer_personal_email_contact, address_line_1, address_line_2, address_line_3,  address_postcode,address_town, address_county, emergency_contact_details_name, emergency_contact_details_tel_number, emergency_contact_details__relationship,clinical_area_title,role_title,band_title FROM user INNER Join contact_details on user.user_id = contact_details.contact_details_user_id INNER JOIN address on user.user_id=address.address_user_id INNER Join emergency_contact_details on user.user_id =emergency_contact_details.emergency_contact_details_user_id INNER JOIN clinical_area_to_user_lookup on user.user_id = user.user_id INNER Join clinical_area on clinical_area_to_user_lookup.clinical_area_to_user_lookup_clinical_area_id = clinical_area.clinical_area_id INNER JOIN role on user.user_role_id_fk= role.role_id INNER JOIN band on role.role_band_id= band.band_id; ",
        req.params.test_id,
        function (error, results, feilds) {
            if (error) throw error;
            res.json(results);
        }
    );


    let profileArray = [];
    fetch("http://localhost:3001/personal_profile_select")
        .then(res => {

            console.log(res.status);
            if (res.status === 200) { return res.json(); }
            // throw `Invalid Query`
        })
        .then(dbres => {
            profileArray = dbres.map(item => {
                return [
                    item.user_name,
                    item.user_email_address,
                    item.user_start_date,
                    item.user_bank_staff_number,
                    item.user_current_trust_employee_in_current_role,
                    item.contact_details_tel_number,
                    item.contact_details_personal_email,
                    item.contact_details_preffer_personal_email_contact,
                    item.address_line_1,
                    item.address_line_2,
                    item.address_line_3,
                    item.address_postcode,
                    item.address_town,
                    item.address_county,
                    item.emergency_contact_details_name,
                    item.emergency_contact_details_tel_number,
                    item.emergency_contact_details__relationship,
                    item.clinical_area_title,
                    item.role_title,
                    item.band_title

                ];
            });
            console.log("test array " + JSON.stringify(profileArray, null, 4));

            res.send(result);
        });
});
module.exports = router;