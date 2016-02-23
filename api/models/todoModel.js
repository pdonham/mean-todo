/**
 * Created by perryd on 2/21/16.
 */
//Grabbed this bit of code from http://www.davidkalosi.com/node.js/mongoose-and-dynamic-model-loading/
//The idea is to store one mongoose model per file, in this case in a folder called /models.
//In the app, then, we just require('./models'), which runs index.js, compiling and exporting
//each schema in the folder. The nice thing about this is that to include a new model, you can just
//drop the schema into the folder.


//Schema: Todo

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var todoSchema = new Schema({
    title: String,
    description: String,
    details: String
});
var Todo = mongoose.model('Todo', todoSchema);

exports.Todo = Todo;