/**
 * Created by perryd on 2/21/16.
 */

//Grabbed this bit of code from http://www.davidkalosi.com/node.js/mongoose-and-dynamic-model-loading/
//The idea is to store one mongoose model per file, in this case in a folder called /models.
//In the app, then, we just require('./models'), which runs the following code, compiling and exporting
//each schema in the folder. The nice thing about this is that to include a new model, you can just
//drop the schema into the folder.

var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

//mongoose.connect('mongodb://localhost/appDB');

var model = {}

fs.readdirSync(__dirname)
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    })
    .forEach(function (file) {
        model = _.extend(model, require(path.join(__dirname, file)));
    });

module.exports = model;