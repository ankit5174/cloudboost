# cloudboost

Task is to build a simple stateless microservice in Nodejs, with three major functionalities -
Authentication
JSON patching
Image Thumbnail Generation

# Prerequisites

Should have ImageMagick installed in your system
Download/Installation Link : http://www.imagemagick.org/script/download.php

Note: Please check the checkbox Install Legacy Utilities (eg. convert), when installing on windows system

Add Imagemagick to your environmental path if not added.

# Installing

1. Create a new folder "cloudboost"
2. Right click -> Git Bash Here
3. git clone https://github.com/ankit5174/cloudboost.git <enter/>
4. Open the folder name cloudboost->Right click -> Git Bash Here
5. npm start
6. Ctrl+C to stop

# Testing

1. Start the server using npm start
2. Open Postman in chrome browser[It is an extension]
3. Testing each operation

   3.1. Login
   
        3.1.1. Add the url as localhost:3000/login        
        3.1.2. Select Post action type        
        3.1.3. In the body add two key value pair
        
                username:username
                
                password:password
                
        3.1.4. Click Send. You will get a token in json format
    
    3.2. Json Patch
    
         3.2.1. Add the url as localhost:3000/patch                 
         3.2.2. Select Post action type        
         3.2.3. In the body add  key value pair
         
                token: <token from prev response>
                
                jsondoc: {"baz": "qux", "foo": "bar"}
                
                jsonpatch: [ { "op": "replace", "path": "/baz", "value": "boo" }, { "op": "add", "path": "/hello","value": ["world"] }, { "op": "remove", "path": "/foo"}]
                
        3.2.4. Click Send.
        
                Response : { "baz": "boo", "hello": ["world"]}
    
    3.3 Image Thumbnail
    
        3.3.1. Add the url as localhost:3000/resizeimage        
        3.3.2. Select Post action type        
        3.3.3. In the body add  key value pair
        
               token: <token from prev response>
               
               url: https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1200px-Flag_of_India.svg.png
               
        3.3.4. Click Send.
        
                Response : A thumbnail of the image
               
# Test Cases

npm test

# Demo Video

https://youtu.be/qYDXAwd1vmE
                
    
           
        
