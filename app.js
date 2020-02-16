const express = require('express');
const cors = require('cors');
const fs= require('fs');
const bodyParser = require('body-parser');
const auth = require('./middleware/auth'); 
const mongoose = require('./db/mongoose');
const multer = require('multer');
const path= require('path');
const app = express(); 
const uploadimg = require('./middleware/image_upload')

app.use(cors());
app.use('/images', express.static(path.join('./products')))

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const User = require('./models/User');
const Product = require('./models/Product');
const Contact = require('./models/Contact');
const Cart = require('./models/Cart');
const middleware = require('./middleware/middleware');
 require('./db/mongoose');
app.get("/testtwo", middleware, function(req, res){
    console.log("this should load after the middleware");
   
    })

app.use(bodyParser.urlencoded({ extended: false }));
// registration
app.post('/register', (req, res) => {
    console.log(req.body);
    data={
        'fname': req.body.fname,
        'lname': req.body.lname,
        'email': req.body.email,
        'username': req.body.username,
        'password': req.body.password,
        'image': req.body.image,
        'usertype':"user"
    }
    var mydata = new User(data);

    mydata.save().then(function (data) {
        alert(Success)
        res.send(data);
 }).catch(function (e) {
      res.send(e);
    });

    
});
// login
app.post("/login", async function(req, res){
    const user = await User.checkCrediantialsDb(req.body.username,req.body.password)
    const tokens = await user.generateAuthToken()
    res.send({token:tokens,user})

   })

     //dashboard tokens client file
     app.get('/user/me',auth,function(req,res)
     {  
         res.send(req.user);
     })

     app.get('/users', function (req, res) {
        User.find().then(function (user) {
            res.send(user);
        }).catch(function (e) {
            res.send(e)
        });
    
    });
// updateprofile
app.put('/updateprofile',auth,function (req, res) {   
    console.log(req.body);
    User.findByIdAndUpdate({_id: req.user._id}, req.body, (err, user) => {
      res.send("succesfull");
    });
  });

  
// updateprofilephoto
app.put('/updatephoto', auth, uploadimg, function (req, res) {
    req.files.map(function(img){
        var image = img.filename
    
        User.findOneAndUpdate({_id: req.user._id},{'image': image}, (err, docs) => {
            if (err) {
                return res
                    .status(500)
                    .send({error: "unsuccessful"})

            } else {
                console.log(image)
                res.send("Profile Picture Update Successfull!"+ docs)
            }
        })
    })
})

// add product
      app.post('/product', (req,res) => {
        console.log(req.body);
        var mydata = new Product(req.body);
        mydata.save().then(function (data){
            
            res.send(data);
        }).catch(function (e) {
            res.send(e);
        });
        });

          //update product
  app.put('/updateprod',function (req, res) {   
    console.log(req.body);
    Product.findByIdAndUpdate(req.body.id, req.body, { new: true }, (err, prod) => {
      res.send("succesfull");
    });
  });
        // image upload
        var storage = multer.diskStorage({
            destination: 'products',
            filename: (req, file, callback) => {
                let ext = path.extname(file.originalname);
                callback(null, "Product" + Date.now() + ext);
            }
          });
          
          var imageFileFilter = (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|png|gif)$/)) {
                return cb(new Error('You can upload only image files!'), false);
            }
            cb(null, true);
          };
          
          var upload = multer({
            storage: storage,
            fileFilter: imageFileFilter,
            limits: { fileSize: 1000000000 }
          });

          app.post('/uploadprod', upload.single('imageFile'), (req, res) => {
            res.send(req.file);
            console.log(req.file);
        });
        // add message
        app.post('/contact', (req,res) => {
            console.log(req.body);
            var mydata = new Contact(req.body);
            mydata.save().then(function (data){
                
                res.send(data);
            }).catch(function (e) {
                res.send(e);
            });
            });
            // show products
            
            app.get('/showproducts',function(req,res){
                Product.find().then(function(Product){
                    console.log(Product);
                    res.send(Product);
                }).catch(function(e){
                    res.send(e);
                });
              });

              //show message
              app.get('/showmessage',function(req,res){
                Contact.find().then(function(Contact){
                    console.log(Contact);
                    res.send(Contact);
                }).catch(function(e){
                    res.send(e);
                });
              });
                 //delete message
            app.delete('/deletemessage/:id',auth, function (req, res) {    
            
                console.log(req.params.id);
             Contact.findByIdAndDelete(req.params.id).then(function(){
                 res.send("Successfully deleted");
             }).catch(function(e){
                 res.send(e);
             }) ;
             });


              //delete products
            app.delete('/deleteproducts/:id',auth, function (req, res) {    
            
        console.log(req.params.id);
     Product.findByIdAndDelete(req.params.id).then(function(){
         res.send("Successfully deleted");
     }).catch(function(e){
         res.send(e);
     }) ;
     });

     app.get('/product/:id',function (req,res){
        uid=req.params.id.toString();
        Product.findById(uid).then(function(prod){
            console.log(prod);
            res.send(prod);
        }).catch(function(e){
            res.send(e);
            console.log(e);
        });
      });

    app.get('/this',auth,function(req,res){
      res.send(req.book);
  })

  
// add to cart
app.post('/cart', auth, (req,res) => {
    console.log(req.body);
    var mydata = new Cart(req.body);
    mydata.save().then(function (data){
        res.send(data);
    }).catch(function (e) {
        res.send(e);
    });
    });
  // add to cart
app.get('/viewcart/:id', (req,res) => {
    console.log(req.params.id)
    Cart.find({uid:req.params.id}).populate("uid").populate("pid").then(function(prod){
        res.send(prod);
        console.log(prod)
    }).catch(function(e){
        res.send(e);
    })
})
//   //logout
//   app.post('/logout', Auth, async (req,res) =>{
//     try {
//         req.user.tokens = [];
//         await req.user.save()
//         res.send()
//         } catch (e) {
//         res.status(500).send()
//         }
//        });
        

app.listen(8000);
