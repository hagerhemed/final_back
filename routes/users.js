const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { auth, restrictTo } = require("../middlewares/auth");


  const nodemailer = require('nodemailer');
  const mg = require('nodemailer-mailgun-transport');
const { options } = require('./products');



router.get(`/`, async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList) {
        res.status(500).json({success: false})
    } 
    res.json(userList);
})

router.get('/:id',async(req,res)=>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user) {
        res.status(500).json({message: 'The user with the given ID was not found.'})
    } 
    res.status(200).json(user);
})

router.post('/', async(req, res) => {
const newUser= new User(req.body);
await newUser.save();

if(!newUser)
return res.status(400).json('the user cannot be created!')

   res.status(201).json({data:{User:newUser}});
})

router.patch('/:id',async (req, res)=> {

    const userExist = await User.findById(req.params.id);
    let newPassword
    if(req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = userExist.password;
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            password: newPassword,
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            street: req.body.street,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        { new: true}
    )

    if(!user)
    return res.status(400).json('the user cannot be created!')

    res.json(user);
})

router.post('/login', async (req,res) => {
    const user = await User.findOne({email: req.body.email})
    const secret = process.env.secret;
    if(!user) {
        return res.status(400).json('The user not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.password)) {
        const token = jwt.sign(
            {
                id: user.id,
                role:user.role,
            },
            secret,
            {expiresIn : '1d'}
        )
       
        res.status(200).json({user: user.email , token: token}) 
    } else {
       res.status(400).json('password is wrong!');
    }

    
})








router.post('/register', async (req, res) => {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json({ data: { User: newUser } });
    } catch (err) {
      if (err.name === 'ValidationError' && err.errors.email) {
        // Email already exists error
        return res.status(400).json({ error: err.errors.email.message });
      }
      // Handle other errors
      return res.status(400).json({ error: err.message });
    }
  });


router.delete('/:id', (req, res)=>{
    User.findByIdAndDelete(req.params.id).then(user =>{
        if(user) {
            return res.status(200).json({success: true, message: 'the user is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "user not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})

router.get("/get/count", async (req, res) => {
    const userCount = await User.find().count();
  
    if (!userCount) {
      return res.status(500).json({ success: false });
    }
  
    res.json({ userCount });
  });




router.post('/forgot-password', (req, res) => {
    const {email} = req.body;
    User.findOne({email: email})
    .then(user => {
        if(!user) {
            return res.send({Status: "User not existed"})
        } 
        const token = jwt.sign({id: user._id}, "jwt_secret_key", {expiresIn: "1d"})
        var transporter = nodemailer.createTransport({
            host:process.env.HOST,
            port:465,
            service: 'hotmail',
            auth: {
              user: process.env.USER_EMAIL,
              pass: process.env.USER_PASS
            }
          });
          
          var mailOptions = {
            from: `Cineflix support <${process.env.USER_EMAIL}>`,
            to:email,
            subject: 'Reset your password',
            text: `http://localhost:4029/reset_password/${user._id}/${token}`
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              return res.send({Status: "Success"})
            }
          });
    })
})


router.post('/reset-password/:id/:token', (req, res) => {
    const {id, token} = req.params
    const {password} = req.body

    jwt.verify(token, "jwt_secret_key", (err, decoded) => {
        if(err) {
            return res.json({Status: "Error with token"})
        } else {
            bcrypt.hash(password, 10)
            .then(hash => {
                User.findByIdAndUpdate({_id: id}, {password: hash})
                .then(u => res.send({Status: "Success"}))
                .catch(err => res.send({Status: err}))
            })
            .catch(err => res.send({Status: err}))
        }
    })
})

module.exports =router;