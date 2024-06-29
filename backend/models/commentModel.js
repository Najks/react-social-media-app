const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var commentSchema = new Schema({
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'user' }, 
  image: { type: Schema.Types.ObjectId, ref: 'photo' },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Comment', commentSchema);
