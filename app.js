//express
const express = require('express');
const app = express();
const port = 3000;
app.use(express.static('public')); //needed for css

//body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( {extended: true} ));

//mailchimp
const mailchimp = require("@mailchimp/mailchimp_marketing");
mailchimp.setConfig({
    apiKey: "deleted for gitHub",
    server: "deleted for gitHub"
});
const listId = "deleted for gitHub";

//routes-----------------------

    // Route -> /
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/signup.html');
    });

    app.post('/', (req, res) => { 
        
        //data from input
        const firstName = req.body.firstName
        const lastName = req.body.lastName
        const email = req.body.email

        //async data from input with mailchimp
        async function run() {
            const response = await mailchimp.lists.addListMember(listId, {
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: firstName,
                        LNAME: lastName
                    }
            });
            res.sendFile(__dirname + "/success.html") //everything OK
            // console.log(response);  //if I want to add more info, I can check this object
            console.log(`Successfully created an audience. The audience id is ${response.id}.`); 
        }
        run().catch(e => res.sendFile(__dirname + "/failure.html")); //ERROR (for example same email that in database)
        
    })

    // Route -> /success
    app.get('/success', (req, res) => {
        res.sendFile(__dirname + '/success.html');
    });

    app.post('/success', (req, res) => {
        res.redirect('/');
    });

    // Route -> /failure
    app.get('/failure', (req, res) => {
        res.sendFile(__dirname + '/failure.html');
    });

    app.post('/failure', (req, res) => {
        res.redirect('/');
    });

//-----------------------------

// heroku: process.env.PORT
app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening on port ${port}.`);
});