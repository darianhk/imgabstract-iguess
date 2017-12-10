var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var searchTermSchema = new Schema (
{
  searchVal: String,
  offset: String,
  searchDate: Date
},
  {timestamp: true}
);

var modelClass = mongoose.model('searchterm', searchTermSchema)

module.exports = modelClass;