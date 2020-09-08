const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", function (req, res) {

    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }

    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/14cadd2b01";
    const options = {
        method: "POST",
        auth: "Naveen:0223b513f06e9f44c6d9f8aae367c1ee-us17"
    }
    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }
        response.on("data", function (data) {
            //  console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});


app.post("/failure", function (req, res) {
    res.redirect("/");
});


app.listen(process.env.PORT || 3000, function () {
    console.log("Server is up and running on port 3000");
});

// 0223b513f06e9f44c6d9f8aae367c1ee-us17
//14cadd2b01
//https://server.api.mailchimp.com/3.0/lists/{list_id}/members?skip_merge_validation=<SOME_BOOLEAN_VALUE>' \