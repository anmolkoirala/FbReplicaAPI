const express = require('express');
const User = require('../models/user')
const Dashboard = require('../models/dashboard_dummy')
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require("path");
const router = new express.Router()
const bcrypt = require('bcrypt');


///////////////////////////////IMAGE UPLOAD PROCESS////////////////////////////////////////////////////////
const storage = multer.diskStorage({
     destination: "./public/Profileuploads",
     filename: (req, file, callback) => {
         let ext = path.extname(file.originalname);
         callback(null,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      `${file.fieldname}-${Date.now()}${ext}`);
     }
 });
 
 const imageFileFilter = (req, file, cb) => {
     if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
         return cb(new Error("Please Choose an Image to Upload not files."), false);
     }
     cb(null, true);
 };
 
 const upload = multer({
     storage: storage,
     fileFilter: imageFileFilter
 })

///////////////////////////////////////USER LOGIN//////////////////////////////////////////////////////////
 router.post('/usersignin', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user == null) {
                let err = new Error('404: Email not found!');
                err.status = 401;
                return next(err);
            } else {
                bcrypt.compare(req.body.password, user.password)
                    .then((isMatch) => {
                        if (!isMatch) {
                            let err = new Error('ERROR: Password does not match!');
                            err.status = 400;
                            return next(err);
                        }
                        let token = jwt.sign({ _id: user._id }, process.env.SECRET);
                        res.json({ userStatus: 'Successfully Logged In!', token: token });
                    }).catch(next);
            }
        }).catch(next);
});
////////////////////////////////////USER REGISTERATION/////////////////////////////////////////////////
router.post("/usersignup", (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    var myData = new User(req.body);
  console.log(req.body);
    myData.save().then(function(){
         res.json('User register successfully');
    }).catch(function(e){
    
    if (e.name === 'ValidationError'){
        return res.status(500).json({ message: 'Email is already taken' })
    }else{
        res.send(e)
    }
    });
});

///////////////////////////////IMAGE UPLOAD///////////////////////////////////////////////////////////////////

router.post("/profileimgupload",upload.single('profilepicture'), (req, res) => {
    res.json(req.file);
});

/////////////////////////////////USER DETAILS PASS-LOGGED IN USER DETAILS////////////////////////////////////////////////////////
router.get('/singleuser', auth.verifyUser, (req, res, next) => {
    res.json({ _id: req.user._id, firstname: req.user.firstname, 
        lastname: req.user.lastname, email: req.user.email,address: req.user.address,
        profilepicture: req.user.profilepicture,
         gender: req.user.gender, dob: req.user.dob});
});


//////////////////////////////////FB Dashboard DATA///////////////////////////////////////////////////////////////////
router.get('/dashboardlist', auth.verifyUser,(req,res)=>{
    Dashboard.find().then(function(dashboard){
         res.json(dashboard);
    }).catch(function(e){
         res.send(e)
    });
});

//////////////////////////////////Dashboard DUMMY DATA REGISTER VIA NODE//////////////////////////////////////////////////////////
router.post("/dashboarddummy", upload.single('userimage'),(req, res) => {
    req.body.userimage = req.file.filename;
    console.log(req.body);
    var myData         = new Dashboard(req.body);
    myData.save().then(function(){
        res.send('Timeline User Added');
    }).catch(function(e){
        res.send(e)
    });
});

module.exports = router;