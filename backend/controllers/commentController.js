var CommentModel = require('../models/commentModel');  

module.exports = {

    listByImage: function(req, res) {
        var imageId = req.params.imageId;
        CommentModel.find({image: imageId})
        .populate('author', 'username')
        .exec(function(err, comments) {
            if (err) {
                console.error("Error retrieving comments:", err);
                return res.status(500).json({
                    message: 'Error getting comments.',
                    error: err
                });
            }
            return res.json(comments);
        });
    },

    /**
     * Create a new comment
     */
    create: function(req, res) {
        console.log(req.body);  
        var comment = new CommentModel({
            text: req.body.text,
            author: req.body.author,
            image: req.body.image
        });
    
        comment.save(function(err, comment) {
            if (err) {
                console.error("Error saving comment:", err);  
                return res.status(500).json({
                    message: 'Error saving comment',
                    error: err
                });
            }
            return res.status(201).json(comment);
        });
    },

    async deleteByPhotoId(photoId) {
        try {
            await CommentModel.deleteMany({ photo: photoId });
            console.log('Deleted comments associated with photo ID:', photoId);
        } catch (error) {
            console.error('Error when deleting comments by photo ID:', error);
            throw error;
        }
    },

    /**
     * Delete a comment
     */
    remove: function(req, res) {
        var id = req.params.id;
        CommentModel.findByIdAndRemove(id, function(err, comment) {
            if (err) {
                return res.status(500).json({
                    message: 'Error deleting comment.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};
exports.unlike = function(req, res) {
    const { id, userId } = req.params;
    PhotoModel.findByIdAndUpdate(id, { $pull: { likes: userId } }, { new: true })
        .then(photo => {
            res.status(200).json({ likes: photo.likes.length });
        })
        .catch(error => {
            console.error('Error unliking photo:', error);
            res.status(500).json({ message: 'Error unliking photo', error });
        });
};


exports.undislike = function(req, res) {
    const { id, userId } = req.params;
    PhotoModel.findByIdAndUpdate(id, { $pull: { dislikes: userId } }, { new: true })
        .then(photo => {
            res.status(200).json({ dislikes: photo.dislikes.length });
        })
        .catch(error => {
            console.error('Error undisliking photo:', error);
            res.status(500).json({ message: 'Error undisliking photo', error });
        });
};