var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var photoSchema = new Schema({
    name: String,
    path: String,
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    views: Number,
    likes: Number,
    dislikes: Number,
    likesBy: [{
        type: Schema.Types.ObjectId,
        ref: 'like'
    }],
    dislikesBy: [{
        type: Schema.Types.ObjectId,
        ref: 'dislike'
    }],
    inappropriateReports: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    visible: {
        type: Boolean,
        default: true
    }
});

const Photo = mongoose.models.Photo || mongoose.model('Photo', photoSchema);
module.exports = Photo;
