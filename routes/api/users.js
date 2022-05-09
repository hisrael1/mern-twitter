const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const keys = require('../../config/keys');

const passport = require('passport');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');



router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({
      id: req.user.id,
      handle: req.user.handle,
      email: req.user.email
    });
  })

  // When querying in postman
  // {"id":"62782978f51685bc4d38e1c3","handle":"\"jimbo\"","email":"\"kyleamin@jimbo.raz\""}

// listens for any get requests on the api/users/test route
// takes in the request and response objects but we only user res here
// router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
  
    if (!isValid) {
      return res.status(400).json(errors);
    }
  
      // Check to make sure nobody has already registered with a duplicate email
      User.findOne({ email: req.body.email })
        .then(user => {
          if (user) {
            // Throw a 400 error if the email address already exists
            return res.status(400).json({email: "Duplicate Email Detected"})
          } else {
            // Otherwise create a new user
            const newUser = new User({
              handle: req.body.handle,
              email: req.body.email,
              password: req.body.password
            })
  
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                  .then(user => res.json(user))
                  .catch(err => console.log(err));
              })
            })
          }
        })
    })


router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    console.log(errors);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
    
    User.findOne({email})
        .then(user => {
        if (!user) {
            return res.status(404).json({email: 'This user does not exist'});
        }
    
        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if (isMatch) {
            const payload = {id: user.id, handle: user.handle};

            jwt.sign(
                payload,
                keys.secretOrKey,
                // Tell the key to expire in one hour
                {expiresIn: 3600},
                (err, token) => {
                    res.json({
                        success: true,
                        token: 'Bearer ' + token
                    });
                });
            } else {
                return res.status(400).json({password: 'Incorrect password'});
            }
        })
    })
})

module.exports = router;

//   router.post('/login', (req, res) => {
//       // login is the route
//       // body.email grabs the email from the http request
//     const email = req.body.email;
//     const password = req.body.password;
  
//     // searches the mongoose database for the first email that matches
//     // the email from the http request. Then returns a promise.
//     // If no user exists returned promise will be an error.
//     // If user exists it will salt the password and compare it will salted passwords in the db
//     // If a match is found it will return "success" as a json object
//     // Otherwise will return an error
//     // delve deeper into promises
//     // Paraphrasing this is where I left off.
//     User.findOne({email})
//     // where does this lowercase user come from?
//       .then(user => {
//         if (!user) {
//           return res.status(404).json({email: 'This user does not exist'});
//         }
  
//         bcrypt.compare(password, user.password)
//         .then(isMatch => {
//           if (isMatch) {
//             const payload = {id: user.id, handle: user.handle};
      
//             jwt.sign(
//               payload,
//               keys.secretOrKey,
//               // Tell the key to expire in one hour
//               {expiresIn: 3600},
//               (err, token) => {
//                 res.json({
//                   success: true,
//                   token: 'Bearer ' + token
//                 });
//               });
//           } else {
//             return res.status(400).json({password: 'Incorrect password'});
//           }
//         })
//       })
//   })