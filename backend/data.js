const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({ name: String,email:String,password:String});
userSchema.methods.generateHash = function(upass){
    return bcrypt.hashSync(upass,bcrypt.genSaltSync(8),null);
};
userSchema.methods.validPassword = function(upass){
    return bcrypt.compareSync(upass,this.password);
}
module.exports = mongoose.model('User',userSchema);