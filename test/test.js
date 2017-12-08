//import all the test libaries
var chai = require('chai');
var chaiHttp = require('chai-http');
var chaiJsonEqual = require('chai-json-equal');
var server = require('../server');
var should = chai.should();
var expect = chai.expect;
var binaryParser = require('superagent-binary-parser');


//setting the plugin configuration to chai
chai.use(chaiHttp);
chai.use(chaiJsonEqual);

//Using Mocha to describe the test
describe('Login',function(){
	//Description what the test should do.
	it('Body does not contain username & password, not allowed to login',function(done){
		//make a request to the server 
		chai.request('http://localhost:3000')
			.post('/login')	//calling endpoint
			.set('content-type', 'application/x-www-form-urlencoded') //setting the header attribtes
            .send({myparam: 'test'}) //setting the header		
			.end(function(err, res){
				
				//assertion to check whether successfull
				expect(err).to.have.status(400);
				res.body.should.have.property('success').eql(false); 
				res.body.should.have.property('message').eql('Please Fill in the username & password');
				done();
				
			});
	});
});

describe('Login',function(){
	it('Body contains username only, not allowed to login',function(done){
		chai.request('http://localhost:3000')
			.post('/login')	
			.set('content-type', 'application/x-www-form-urlencoded')
            .send({username: 'username'})		
			.end(function(err, res){

				expect(err).to.have.status(400);
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('Please Fill in the username & password');
				done();
				
			});
	});
});

describe('Login',function(){
	it('Body contains username and password, allowed to login and token received',function(done){
		chai.request('http://localhost:3000')
			.post('/login')	
			.set('content-type', 'application/x-www-form-urlencoded')
            .send({username: 'username', password: 'password'})		
			.end(function(err, res){
				expect(err).to.be.null;
				res.body.should.have.property('success').eql(true);
				res.body.should.have.property('message').eql('Enjoy your token!');					
				res.body.should.have.property('token');
				done();				
			});
	});
});

describe('Patch Endpoint',function(){
	it('Call patch endpoint without token, will not allow to access the endpoint',function(done){
		chai.request('http://localhost:3000')
			.post('/patch')	
			.set('content-type', 'application/x-www-form-urlencoded')
            .send({jsondoc: '{"baz": "qux", "foo": "bar"}', jsonpatch: '[ { "op": "replace", "path": "/baz", "value": "boo" }, { "op": "add", "path": "/hello","value": ["world"] }, { "op": "remove", "path": "/foo"}]'})		
			.end(function(err, res){
				expect(err).to.have.status(403);
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('No token provided.');									
				done();				
			});
	});
});

describe('Patch Endpoint',function(){
	it('Call patch endpoint with invalid token, will not allow to access the endpoint',function(done){
		chai.request('http://localhost:3000')
			.post('/patch')	
			.set('content-type', 'application/x-www-form-urlencoded')
            .send({token: 'a.b.c', jsondoc: '{"baz": "qux", "foo": "bar"}', jsonpatch: '[ { "op": "replace", "path": "/baz", "value": "boo" }, { "op": "add", "path": "/hello","value": ["world"] }, { "op": "remove", "path": "/foo"}]'})		
			.end(function(err, res){
				expect(err).to.have.status(401);
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('Failed to authenticate token.');									
				done();				
			});
	});
});

describe('Patch Endpoint',function(){
	it('Call patch endpoint with valid token, will allow to access the endpoint', function(done){
		
		chai.request('http://localhost:3000')
			.post('/login')	
			.set('content-type', 'application/x-www-form-urlencoded')
            .send({username: 'username', password: 'password'})		
			.end(function(error, response){
				chai.request('http://localhost:3000')
					.post('/patch')	
					.set('content-type', 'application/x-www-form-urlencoded')
           			.send({token: response.body.token, jsondoc: '{"baz": "qux", "foo": "bar"}', jsonpatch: '[ { "op": "replace", "path": "/baz", "value": "boo" }, { "op": "add", "path": "/hello","value": ["world"] }, { "op": "remove", "path": "/foo"}]'})		
					.end(function(err, res){
						
						let expectedResponse = JSON.parse('{"baz": "boo", "hello": ["world"]}');
						expect(err).to.be.null;
						expect(res).to.have.status(200);
						expectedResponse.should.jsonEqual(res.body);							
						done();				
					});					
    		});				
	});
});

describe('Patch Endpoint',function(){
	it('Call patch endpoint with valid token, but invalid jsondoc or jsonpatch, will throw 500 error', function(done){
		
		chai.request('http://localhost:3000')
			.post('/login')	
			.set('content-type', 'application/x-www-form-urlencoded')
            .send({username: 'username', password: 'password'})		
			.end(function(error, response){
				chai.request('http://localhost:3000')
					.post('/patch')	
					.set('content-type', 'application/x-www-form-urlencoded')
           			.send({token: response.body.token, jsondoc: '{"baz": "qux", "foo": "bar"}', jsonpatch: '[ { "op": "lace", "path": "/baz", "value": "boo" }, { "op": "add", "path": "/hello","value": ["world"] }, { "op": "remove", "path": "/foo"}]'})		
					.end(function(err, res){
						
						expect(err).to.have.status(500);						
						done();				

					});					
    		});				
	});
});


describe('Resize Image Endpoint',function(){
	it('Call resizeimage endpoint without token, will not allow to access the endpoint',function(done){
		chai.request('http://localhost:3000')
			.post('/resizeimage')	
			.set('content-type', 'application/x-www-form-urlencoded')
            .send({url : 'https://www.mapsofindia.com/maps/india/india-flag-1024x600.jpg'})		
			.end(function(err, res){
				expect(err).to.have.status(403);
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('No token provided.');									
				done();				
			});
	});
});

describe('Resize Image Endpoint',function(){
	it('Call resizeimage endpoint with invalid token, will not allow to access the endpoint',function(done){
		chai.request('http://localhost:3000')
			.post('/resizeimage')	
			.set('content-type', 'application/x-www-form-urlencoded')
            .send({token: 'a.b.c', url : 'https://www.mapsofindia.com/maps/india/india-flag-1024x600.jpg'})		
			.end(function(err, res){
				expect(err).to.have.status(401);
				res.body.should.have.property('success').eql(false);
				res.body.should.have.property('message').eql('Failed to authenticate token.');									
				done();				
			});
	});
});

describe('Resize Image Endpoint',function(){
	it('Call resizeimage endpoint with valid token, will allow to access the endpoint', function(done){
		
		chai.request('http://localhost:3000')
			.post('/login')	
			.set('content-type', 'application/x-www-form-urlencoded')
            .send({username: 'username', password: 'password'})		
			.end(function(error, response){
				chai.request('http://localhost:3000')
					.post('/resizeimage')	
					.set('content-type', 'application/x-www-form-urlencoded')
           			.send({token: response.body.token,  url : 'https://www.mapsofindia.com/maps/india/india-flag-1024x600.jpg'})		
           			.buffer()
					.parse(binaryParser)
					.end(function(err, res){
												
						expect(res).to.have.status(200);												
						done();				

					});	
								
    		});				
	});
});

