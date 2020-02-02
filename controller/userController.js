// userController.js
const jwt = require("jsonwebtoken");

// Import user model
User = require("../model/userModel");
// Handle index actions
exports.index = function(req, res) {
  User.get(function(err, user) {
    if (err) {
      res.json({
        status: "error",
        message: err
      });
    }
    res.json({
      status: "success",
      message: "Users retrieved successfully",
      data: user
    });
  });
};
// Handle create user actions
exports.new = function(req, res) {
  console.log(req.file);
  var user = new User();
  user.name = req.body.name ? req.body.name : user.name;
  user.username = req.body.username;
  user.password = req.body.password;
  user.email = req.body.email;
  user.phone = req.body.phone;
  user.photo = req.file.path.replace("\\", '/');
  user.type = req.body.type;
  // save the user and check for errors
  user.save(function(err) {
    // if (err)
    //     res.json(err);
    res.json({
      message: "New user created!",
      data: user
    });
  });
};
// Handle view user info
exports.view = function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (err) res.send(err);
    res.json({
      message: "User details loading..",
      data: user
    });
  });
};
// Handle update user info
exports.update = function(req, res) {
  User.findById(req.params.user_id, function(err, user) {
    if (err) {res.send(err);}
    try {
        user.name = req.body.name ? req.body.name : user.name;
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.phone = req.body.phone;
        user.photo = req.file.path.replace("\\", '/');
        user.type = req.body.type;
        // save the user and check for errors
        user.save(function(err) {
            if (err) res.status(400).json(err);
            res.status(200).json({
              message: "User Info updated",
              data: user
            });
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({error: "something went worng."});
    }
    
    
  });
};
// Handle delete user
exports.delete = function(req, res) {
  User.remove(
    {
      _id: req.params.user_id
    },
    function(err, user) {
      if (err) res.send(err);
      res.json({
        status: "success",
        message: "User deleted"
      });
    }
  );
};

exports.login = function(req, res, next) {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "auth faield"
        });
      }

      if (
        user[0].email === req.body.email &&
        user[0].password === req.body.password
      ) {
        let token = jwt.sign(
          {
            email: user[0].email,
            userId: user[0]._id
          },
          "LOVER",
          {
            expiresIn: "1h"
          }
        );

        res.status(200).json({
          message: "Login successfully",
          token: token
        });
      } else {
        return res.status(401).json({
          message: "auth faield"
        });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({
        error: err
      });
    });
};
