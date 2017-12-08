// Again we are importing the libraries we are going to use
var express = require('express');
var jwt    = require('jsonwebtoken');
var router = express.Router();
var jsonpatch = require('json8-patch');
var path = require('path');
var uuidv1 = require('uuid/v1');
var easyimg = require('easyimage');
var config = require('../config');

router.get('/',function(req, res){
  res.send("You just landed to the world of Services");
});

//Route to the login endpoint
router.post('/login',function(req, res){

  //validate if username/password is empty
  if(isEmpty(req.body.username) || isEmpty(req.body.password))
	{
		return res.status(400).json({
          success: false,
          message: 'Please Fill in the username & password'          
    	});
	}

  //defining a payload to be used to create the jwt token. Since we are accepting any username/pssword payload used is same
	const payload = {
		admin : 'admin'
	};

  //create a jwt token by providing the payload as well as the secret
	var token = jwt.sign(payload, config.secret, {
          expiresIn: '1h' // expires in 24 hours
    });

  //send a token as a json response
	res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
    });
});

//Acts as a middleware for this router. It intercepts any request for the route defined below this. Used to validate the jwt token
router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        return res.status(401).json({ 
          success: false,
          message: 'Failed to authenticate token.' 
        });    
      } else {
        // if everything is good, forward the request to next handler
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });

  }
});

//Route to the patch endpoint
router.post('/patch',function(req, res){

  //validate jsondoc is not empty or null
	if(isEmpty(req.body.jsondoc))
	{
		return res.status(400).json({
          success: false,
          message: 'Please provide json document'
    	});
	}

  //validate jsonpatch is not empty or null
	if(isEmpty(req.body.jsonpatch))
	{
		return res.status(400).json({
          success: false,
          message: 'Please provide json patch'
    	});
	}

  //Apply the patch and send the updated jsondoc
	res.json(jsonpatch.apply(JSON.parse(req.body.jsondoc), JSON.parse(req.body.jsonpatch)).doc);
	
});

//Route to resize image
router.post('/resizeimage',function(req, res){

  //validate url is not empty or null
	if(isEmpty(req.body.url))
	{
		return res.status(400).json({
          success: false,
          message: 'Please provide url of the image'
    	});
	}	
 
  //generate a uuid for each resize image request
  let uuid = uuidv1();

  easyimg.rescrop({
     src:req.body.url, dst:path.join(__dirname,'../image_'+uuid+'.jpg'),
     width:50, height:50,     
     x:0, y:0
  }).then(
  function(image) {
     res.sendFile(path.join(__dirname,'../image_'+uuid+'.jpg'));
  },
  function (err) {
    console.log(err);
  }
); 
  	
});


//Utility method to validate a string is empty or undefined or null
function isEmpty(value) {
	return typeof value == 'string' && !value.trim() || typeof value == 'undefined' || value === null;
}

// We export this module so that we can import it in our server.js file and gain access to the routes we defined.
module.exports = router;