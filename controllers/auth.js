//Modules
require('dotenv').config
const express = require('express');
const jwt = require('jsonwebtoken');

// Resources 
const router = express.Router();
const db = require('../models')


// POST /auth/login route - returns a JWT
router.post('/login', (req, res) => {
	console.log('In the POST /auth/login route')
	console.log(req.body)
	
	db.User.findOne({
		email: req.body.email 
	})
	.then(user=>{
		// make sure there is a user and a pass
		if(!user || !user.password){
			return res.status(404).send({message: 'Invalid login'})
		}

		// Yay, the user exists - now lets check their password
		if (!user.authenticated(req.body.password)){
			//Invalid user credientials (bad pass)
			return res.status(404).send({message: 'Invalid login'})
		}

		// Valid user, good password, now we just need to give them a token
		const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
			expiresIn: 60 * 60 * 24. // 24 hours (in seconds)
		});

		// Send the token!
		res.send({ token })
	})
	.catch((err) => {
	    console.log('Error in POST /auth/login', err)
	    res.status(503).send({message:'Database Error'})
	  });
});

// POST /auth/signup route - create a user in the DB and then log them in
router.post('/signup', (req, res) => {
  
	db.User.findOne({ email:req.body.email })
	.then(user=>{
		//if the user exists, do not let them create an account
		if (user) {
			res.status(409).send({message: 'Email address already in use'})
		}
		
		// GOOD - they don't exist yet
		db.User.create(req.body)

		.then(createdUser=>{
			//We created a user. Make a token, send it!
			const token = jwt.sign(createdUser.toJSON(), process.env.JWT_SECRET, {
				expiresIn: 60*60*24
			})
			res.send({ token })
		})
		.catch((err) => {
	    console.log('Error in POST /auth/signup', err)
	    res.status(503).send({message:'Database Error'})
	  });
	})
	.catch((err) => {
	    console.log('Error in POST /auth/signup', err)
	    res.status(503).send({message:'Database Error'})
	  });
});

// This is what is returned when client queries for new user data
router.post('/current/user', (req, res) => {

	console.log('in the current user route.  should be a logged in user', req.user)

	if (!req.user || !req.user.id){
		return res.status(401).send({message: 'Unauthorized'})
	}

	// Note: this is the user data from the time the token was issued
	// WARNING: if you update the user; those changes will not be reflected here
	// To avoid; reissue a token when the user data is changed
	res.send( { user:req.user} )
});

module.exports = router;
