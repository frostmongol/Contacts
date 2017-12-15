module.exports = function(app) {
    var express = require('express');
    var bodyParser = require('body-parser');
    var mongoose = require('mongoose');
    var events = require('events');
    //DB Connection
    mongoose.connect('mongodb://test:test@ds129156.mlab.com:29156/contacts');

    //Create Schema
    var contactSchema = new mongoose.Schema({
        name: String,
        age: Number,
        phone: String
    });
    //Create Model
    var Contact = mongoose.model('Contact', contactSchema);

    //isEmpty function declaration
    function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    };

    //urlEncodedParser definition (checks for POST requests and parses them)
    var urlEncodedParser = bodyParser.urlencoded({extended:true})

    //GET Handling
    app.get('/', function(req, res) {
        Contact.count({}, function(err, count){
            var number = count;
            res.render('homepage', {number: number});
        });
    })

    //POST Handling
    app.post('/', urlEncodedParser, function(req, res) {
        //get data
        console.log(req.body)
        if (typeof req.body.request != 'undefined') {
                Contact.find({'name': (req.body.request.toUpperCase())}, function(err, data) {
                    if (err) throw err;
                    var contactData = data
                    console.log(typeof contactData)
                    if (isEmpty(contactData) == false) {
                        res.render('id', {contactData: contactData})
                    } else {
                        res.render('homepage', {err: "No matching Name"})
                    }
                });
        } else if (typeof req.body.nameCreate != 'undefined') {
            //get data && pass to database
            var newContact = Contact({
                name: req.body.nameCreate.toUpperCase(),
                age: req.body.ageCreate,
                phone: req.body.phoneCreate
            }).save(function(err, data){
                var contactData = [{
                    name: req.body.nameCreate.toUpperCase(),
                    age: req.body.ageCreate,
                    phone: req.body.phoneCreate
                }]
                console.log(contactData)
                if (err) throw err;
                //Render Page with Contact Information
                res.render('id', {contactData: contactData});
            });
        //Catch empty requests
        } else {res.render('homepage', {err: "Please fill out form"})}
    })
}
