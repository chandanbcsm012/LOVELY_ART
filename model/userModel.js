var mongoose = require("mongoose");
// Setup schema
var userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: true
  },
  type: String,
  photo: String,
  password: String,
  phone: String,
  create_date: {
    type: Date,
    default: Date.now
  }
});
// Export User model
var User = (module.exports = mongoose.model("users", userSchema));
module.exports.get = function(callback, limit) {
  User.find(callback).limit(limit);
};
