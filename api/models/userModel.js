/**
 * Created by perryd on 2/21/16.
 */
//Grabbed this bit of code from http://www.davidkalosi.com/node.js/mongoose-and-dynamic-model-loading/
//The idea is to store one mongoose model per file, in this case in a folder called /models.
//In the app, then, we just require('./models'), which runs index.js, compiling and exporting
//each schema in the folder. The nice thing about this is that to include a new model, you can just
//drop the schema into the folder.


//Schema: User

//todo: This should match what session is looking for

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    login: String,
    password: String,
    isLoggedIn: Boolean,
    name: String
});

var User = mongoose.model('User', userSchema);

exports.User = User;