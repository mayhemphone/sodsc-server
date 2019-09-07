// // Require needed modules
// let express = require('express')
let async = require('async')

// // Declare an express router
// let router = express.Router()

// // Reference the models
// let db = require('../models')
// let cloudinary = require('cloudinary')
// let multer = require('multer')

// // Include our custom middleware to ensure that users are logged in
// let adminLoggedIn = require('../middleware/adminLoggedIn')
// let loggedIn = require('../middleware/loggedIn')

//temp
let adminLoggedIn = "banana"

require('dotenv').config()
const express = require('express');
const jwt = require('jsonwebtoken')
const router = express.Router();
const db = require('../models')


// POST /merch - create a new merch item
router.post('/', function(req, res) {
	console.log('in the POST /merch route')
  
  // create merch item
  //update for new schema - especially images.  now stored in one field in an array.
  db.Merch.create({
    item: req.body.item,
    category: req.body.category,
    sex: req.body.sex,
    collect: req.body.collect,
    pre_order: req.body.pre_order,
    members_only: req.body.members_only,
    imgs: req.body.imgs,
    price: req.body.price,
    active: req.body.active,
    color: req.body.color,
    no_size: req.body.no_size,
    description: req.body.desc
  })
	.then(merch=>{
		
	    // so relationships can be made
	    
		if ( merch.no_size == true ) {
			// create 0 inventory record for none
			db.Inventory.create({
			  	merchId: merch.id,
			  	size: 'none'
		 	})

		} else {
			// create 0 inventory record for default sizes
			let defaultSizes = ['xs','s','m','l','x','xxl']
			// console.log(defaultSizes)
		    async.forEach(defaultSizes, (cat, done) => {
		      db.Inventory.create({
		      		merchId: merch.id,
		      		size: cat
		      })
		      .spread((inventory, wasCreated) => {
		        merch.addInventory(inventory)
		        .then(() => {
		          // res.redirect, or whatevs
		          // console.log('done adding', cat)
		          done()
		        })
		      })
		    }, () => {
		      // console.log('EVERYTHING is done. Now redirect or something')
		      // res.redirect('merch/inventory')
		    })	  
			} //close if / else statement
		})

  .then(function(merch) {
   
      console.log('EVERYTHING is done. Now redirect or something')
      // res.send({ merch })
    })

  .catch(function(error) {
    console.log('Error when creating merch', error)
		// res.status(500).send({ message: 'Error creating merch'})
  })
})

// // GET /content
// router.get('/', (req, res) => {
// 	db.Merch.findAll()
// 	.then((merch)=>{
// 		 // res.render('merch/index', { merch: merch})
// 	})
// 	.catch((err) => {
// 	    // console.log('Error in POST /merch', err)
// 	    // res.render('404')
// 	  })
// })

// // GET /merch/new - display form for creating new articles
// router.get('/new', adminLoggedIn, (req, res) =>{

// 	// res.render('merch/new')
// })

// // GET /merch/inventory
// router.get('/inventory', adminLoggedIn, (req, res) => {
// 	db.Merch.findAll({ include:[ db.Inventory]} )
// 	.then((merch)=>{
// 		 // res.render('merch/inventory', { merch: merch })
// 	})
// 	.catch((err) => {
// 	    // console.log('Error in GET /merch/inventory', err)
// 	    // res.render('404')
// 	  })
// })

// //INVENTORY EDIT PUT
// router.put('/inventory',  adminLoggedIn, (req,res)=>{

//   // TODO
//   // COME BACK AND MAKE THIS A LOOP YOU LAZY FUCK.
//   	db.Inventory.update({ count : req.body['none']  },{ 
// 		where : { 
// 			merchId: req.body.merchId, 
// 			size: 'none' 
// 		}
// 	})
// 	db.Inventory.update({ count : req.body['xs']  },{ 
// 		where : { 
// 			merchId: req.body.merchId, 
// 			size: 'xs' 
// 		}
// 	})
// 	db.Inventory.update({ count : req.body['s']  },{ 
// 		where : { 
// 			merchId: req.body.merchId, 
// 			size: 's' 
// 		}
// 	})
// 	db.Inventory.update({ count : req.body['m']  },{ 
// 		where : { 
// 			merchId: req.body.merchId, 
// 			size: 'm' 
// 		}
// 	})
// 	db.Inventory.update({ count : req.body['l']  },{ 
// 		where : { 
// 			merchId: req.body.merchId, 
// 			size: 'l' 
// 		}
// 	})
// 	db.Inventory.update({ count : req.body['xl']  },{ 
// 		where : { 
// 			merchId: req.body.merchId, 
// 			size: 'xl' 
// 		}
// 	})
// 	db.Inventory.update({ count : req.body['xxl']  },{ 
// 		where : { 
// 			merchId: req.body.merchId, 
// 			size: 'xxl' 
// 		}
// 	})

//     .then((updatedRows)=>{
//     // console.log('success', updatedRows)
//     // res.redirect('/merch/inventory')
// 	})
//     .catch((err) => {
//       // console.log('Error in POST /reviews', err)
//       // res.render('404')
//     })
// })

// // SINGLE MERCH EDIT PUT

// router.put('/edit/:id',  adminLoggedIn, (req,res)=>{
  
//   // check values for undefined, and store proper true / false values - 
//   //need to change these from doing strings to true booleans
//   let active1 = !req.body.active ? 'false' : 'true';
//   let members_only1 = !req.body.members_only ? 'false' : 'true';
//   let no_size1 = req.body.no_size==undefined ? 'false' : 'true';
//   let no_size1_current = req.body.no_size_current

// 	console.log('')
// 	console.log('')
// 	console.log('no_size1_current:',no_size1_current)
// 	console.log('')
// 	console.log('no_size1:',no_size1)
// 	console.log('')

// 	// check to see if this is different than what's in the db
// 	if (no_size1_current != no_size1){
// 		// if becoming no_size, then delete sizes and create 'none' 
// 		console.log('')
// 		console.log('************ CHANGE************')
// 		console.log('')
// 		if (no_size1 == 'true' ) {
			
// 			console.log('')
// 			console.log('IF - if no_size1:',no_size1)
// 			console.log('')
// 			console.log('************DELETE OLD SIZE RECORDS, MAKE NONE RECORD************')
// 			console.log('')

// 			// delete old size records
// 			db.Inventory.destroy({
// 			    where: {
// 			        merchId: req.body.id
// 			    }
// 			})

// 			// make new 'none' record
// 			db.Inventory.create({
// 			  	merchId: req.body.id,
// 			  	size: 'none'
// 		 	})

// 		} else {

// 			// delete old 'none' record
// 			console.log('')
// 			console.log('ELSE - if no_size1:',no_size1)
// 			console.log('')
// 				console.log('************DELETE OLD NONE RECORD, MAKE SIZE RECORDS************')
// 				console.log('')
// 				//delete this theId?
// 				let theId = req.body.id
// 				db.Inventory.destroy({
// 				    where: {
// 				        merchId: req.body.id
// 				    }
// 				})

// 			// make new size records
// 			let defaultSizes = ['xs','s','m','l','xl','xxl']

// 		    async.forEach(defaultSizes, (cat, done) => {
// 		      db.Inventory.create({
// 		      		merchId: req.body.id,
// 		      		size: cat
// 		      })
// 		    })
// 		}
		

// 	} else {
// 		// nothing changes
// 		console.log('')
// 		console.log('************NO CHANGE************')
// 		console.log('')
// 	}
// 	//now do the merch database update
//   db.Merch.update(
//   {
//   	id: req.body.id,
//     item: req.body.item,
//     category: req.body.category,
//     sex: req.body.sex,
//     collect: req.body.collect,
//     pre_order: req.body.pre_order,
//     members_only: members_only1,
//     img_1: req.body.img_1,
//     img_2: req.body.img_2,
//     img_3: req.body.img_3,
//     price: req.body.price,
//     active: active1,
//     color: req.body.color,
//     no_size: no_size1,
//     desc: req.body.desc
//   },
//     { where: {id: req.params.id} }
//   )
//   .then((updatedRows)=>{
//     // console.log('success', updatedRows)
//     // res.redirect('/merch/' + req.params.id)
//   })
//   .catch((err) => {
//       // console.log('Error in PUT /:id', err)
//       // res.render('404')
//     })
// })

// router.get('/edit/:id', (req,res)=>{
//   // console.log('Reached get route')

// 	db.Merch.findOne({
// 	    where: { id: req.params.id },
// 	    include: [db.Inventory]
// 	})
//     .then(function(merch) {
//   		// console.log('found:', merch)
// 	    if (!merch) throw Error()
// 	    // res.render('merch/edit', { merch: merch })
//   	})
//     .catch((err) => {
//         // console.log('Error in POST /reviews', err)
//         // res.render('404')
//     })
// })



// router.get('/:id', (req, res) => {
// 	db.Merch.findOne({
// 		where: {id: req.params.id },
// 		include: [db.Inventory]
// 	})
// 	.then((merch)=>{
// 		if (!merch) throw Error()
// 		// res.render('merch/show', {merch: merch})
// 	})
// 	.catch((err) => {
// 	    // res.status(400).render('404')
// 	  })
// })



// //cloudinary widget
//  function cloudwidget (req, res) {
//       var post = new Model({
//           title: req.body.title,
//           description: req.body.description,
//           created_at: new Date(),
//           // Now we are requesting the image
//           // from a form text input
//           image: req.body.image
//       });

//       post.save(function (err) {
//           if(err){
//               // res.send(err)
//           }
//           // res.redirect('/');
//       });
//   }


// Export the routes from this file
module.exports = router
