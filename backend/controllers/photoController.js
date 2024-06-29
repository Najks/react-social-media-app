var PhotoModel = require('../models/photoModel.js');
var CommentModel = require('../models/commentModel.js')
const User = require('../models/userModel.js');
const commentController = require('../controllers/commentController');


async function deleteCommentsByPhotoId(photoId) {
    try {
        await CommentModel.deleteMany({ photo: photoId });
    } catch (error) {
        console.error(`Failed to delete comments for photo ${photoId}: ${error}`);
        throw error;  
    }
}

async function deleteLikesByPhotoId(photoId) {
    try {
        await LikeModel.deleteMany({ photo: photoId });
    } catch (error) {
        console.error(`Failed to delete likes for photo ${photoId}: ${error}`);
        throw error;
    }
}

async function deleteDislikesByPhotoId(photoId) {
    try {
        await DislikeModel.deleteMany({ photo: photoId });
    } catch (error) {
        console.error(`Failed to delete dislikes for photo ${photoId}: ${error}`);
        throw error;
    }
}


/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {

    /**
     * photoController.list()
     */
    list: function (req, res) {
        PhotoModel.find()
        .populate('postedBy')
        .exec(function (err, photos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }
            var data = [];
            data.photos = photos;
            //return res.render('photo/list', data);
            return res.json(photos);
        });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
    
        PhotoModel.findOne({ _id: id })
            .populate('postedBy', 'username')
            .exec(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting photo.',
                        error: err
                    });
                }
    
                if (!photo) {
                    return res.status(404).json({
                        message: 'No such photo'
                    });
                }
    
                return res.json(photo);
            });
    },
    
    /**
     * photoController.create()
     */
    create: function (req, res) {
        var photo = new PhotoModel({
			name : req.body.name,
			path : "/images/"+req.file.filename,
			postedBy : req.session.userId,
			views : 0,
			likes : 0
        });

        photo.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            }

            return res.status(201).json(photo);
            //return res.redirect('/photos');
        });
    },

    /**
     * photoController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.name = req.body.name ? req.body.name : photo.name;
			photo.path = req.body.path ? req.body.path : photo.path;
			photo.postedBy = req.body.postedBy ? req.body.postedBy : photo.postedBy;
			photo.views = req.body.views ? req.body.views : photo.views;
			photo.likes = req.body.likes ? req.body.likes : photo.likes;
			
            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },
    

    publish: function(req, res){
        return res.render('photo/publish');
    },

    like: function (req, res) {
    var id = req.params.id;
    var userId = req.params.userId;

    // check ce je uporabnik že lajkal fotografijo
    PhotoModel.findOne({_id: id, likesBy: userId}, function (err, result) {
        if (err) {
            return res.status(500).json({
                message: 'Error when checking if user liked photo',
                error: err
            });
        }

        if (result) {
            // uporabnik že lajkal fotografijo, vrnite ustrezno sporočilo
            return res.status(400).json({
                message: 'User already liked this photo'
            });
        } else {
            // ID uporabnika v polje lajkov
            PhotoModel.findOneAndUpdate(
                {_id: id},
                {$inc: {likes: 1}, $push: {likesBy: userId}},
                {new: true}, // Vrni posodobljen dokument
                function (err, photo) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when liking photo',
                            error: err
                        });
                    }

                    return res.json(photo);
                }
            );
        }
    });
},

dislike: function (req, res) {
    var id = req.params.id;
    var userId = req.params.userId;

    // check ali je uporabnik že nevšečkal fotografijo
    PhotoModel.findOne({_id: id, dislikesBy: userId}, function (err, result) {
        if (err) {
            return res.status(500).json({
                message: 'Error when checking if user disliked photo',
                error: err
            });
        }

        if (result) {
            // Če je uporabnik že nevšečkal 
            return res.status(400).json({
                message: 'User already disliked this photo'
            });
        } else {
            // add ID uporabnika v polje nevšečkov
            PhotoModel.findOneAndUpdate(
                {_id: id},
                {$inc: {dislikes: 1}, $push: {dislikesBy: userId}},
                {new: true}, //nov posodobljen dokument
                function (err, photo) {
                    if (err) {
                        return res.status(500).json({
                            message: 'Error when disliking photo',
                            error: err
                        });
                    }

                    return res.json(photo);
                }
            );
        }
    });
},

like: async function (req, res) {
    const id = req.params.id;
    const userId = req.params.userId;

    try {
        const photo = await PhotoModel.findById(id);

        if (!photo) {
            return res.status(404).json({
                message: 'Photo not found'
            });
        }

        if (photo.likesBy && photo.likesBy.includes(userId)) {
            return res.status(400).json({
                message: 'User already liked this photo'
            });
        } else {
            const updatedPhoto = await PhotoModel.findByIdAndUpdate(
                id,
                { $inc: { likes: 1 }, $push: { likesBy: userId } },
                { new: true }
            );
            return res.json(updatedPhoto);
        }
    } catch (error) {
        console.error('Error when liking photo:', error);
        return res.status(500).json({
            message: 'Error when liking photo',
            error: error
        });
    }
},

dislike: async function (req, res) {
    const id = req.params.id;
    const userId = req.params.userId;

    try {
        const photo = await PhotoModel.findById(id);

        if (!photo) {
            return res.status(404).json({
                message: 'Photo not found'
            });
        }

        if (photo.dislikesBy && photo.dislikesBy.includes(userId)) {
            return res.status(400).json({
                message: 'User already disliked this photo'
            });
        } else {
            const updatedPhoto = await PhotoModel.findByIdAndUpdate(
                id,
                { $inc: { dislikes: 1 }, $push: { dislikesBy: userId } },
                { new: true }
            );
            return res.json(updatedPhoto);
        }
    } catch (error) {
        console.error('Error when disliking photo:', error);
        return res.status(500).json({
            message: 'Error when disliking photo',
            error: error
        });
    }
},

checkLike: async function (req, res) {
    const id = req.params.id;
    const userId = req.params.userId;

    try {
        const photo = await PhotoModel.findById(id);

        if (!photo) {
            return res.status(404).json({
                message: 'Photo not found'
            });
        }

        const isLiked = photo.likesBy.includes(userId);

        return res.json({ isLiked });
    } catch (error) {
        console.error('Error checking like:', error);
        return res.status(500).json({
            message: 'Server error',
            error: {
                message: error.message,
                stack: error.stack
            }
        });
    }
},
unlike: async function (req, res) {
    const id = req.params.id;
    const userId = req.params.userId;

    try {
        const photo = await PhotoModel.findById(id);

        if (!photo) {
            return res.status(404).json({
                message: 'Photo not found'
            });
        }

        if (!photo.likesBy || !photo.likesBy.includes(userId)) {
            return res.status(400).json({
                message: 'User has not liked this photo'
            });
        } else {
            const updatedPhoto = await PhotoModel.findByIdAndUpdate(
                id,
                { $inc: { likes: -1 }, $pull: { likesBy: userId } },
                { new: true }
            );
            return res.json(updatedPhoto);
        }
    } catch (error) {
        console.error('Error when unliking photo:', error);
        return res.status(500).json({
            message: 'Error when unliking photo',
            error: error
        });
    }
},

undislike: async function (req, res) {
    const id = req.params.id;
    const userId = req.params.userId;

    try {
        const photo = await PhotoModel.findById(id);

        if (!photo) {
            return res.status(404).json({
                message: 'Photo not found'
            });
        }

        if (!photo.dislikesBy || !photo.dislikesBy.includes(userId)) {
            return res.status(400).json({
                message: 'User has not disliked this photo'
            });
        } else {
            const updatedPhoto = await PhotoModel.findByIdAndUpdate(
                id,
                { $inc: { dislikes: -1 }, $pull: { dislikesBy: userId } },
                { new: true }
            );
            return res.json(updatedPhoto);
        }
    } catch (error) {
        console.error('Error when undisliking photo:', error);
        return res.status(500).json({
            message: 'Error when undisliking photo',
            error: error
        });
    }
},

 remove: async function (req, res) {
        var id = req.params.id;

        try {
            const photo = await PhotoModel.findByIdAndRemove(id);
            if (!photo) {
                return res.status(404).json({ message: 'Photo not found' });
            }
            //pomozne fun na vrhu doc
            await deleteCommentsByPhotoId(id);
            await deleteLikesByPhotoId(id);
            await deleteDislikesByPhotoId(id);
    
            return res.status(204).send(); 
        } catch (error) {
            console.error('Error when deleting photo and associated data:', error);
            return res.status(500).json({
                message: 'Error when deleting the photo and associated data.',
                error: error.toString()
            });
        }
    },

    
    

    reportPhoto: async function (req, res, next) {
        try {
            const id = req.params.id;
            const userId = req.params.userId;
            // preverim, ali je uporabnik že prijavil to sliko
            const photo = await PhotoModel.findById(id);
            if (!photo) {
                return res.status(404).json({ message: "Photo not found" });
            }
            if (photo.inappropriateReports.includes(userId)) {
                return res.status(400).json({ message: "You have already reported this photo" });
            }
            photo.inappropriateReports.push(userId);
            await photo.save();
            // ce vec od tresholda, bo visibility hidden
            if (photo.inappropriateReports.length >= 5) { 
                photo.visible = false;
                await photo.save();
            }
            return res.status(200).json({ message: "Photo reported successfully" });
        } catch (error) {
            console.error('Error reporting photo:', error); 
            return res.status(500).json({}); //ce se ni prazno mnozico
        }
    },
    getUserPhotos: async function (req, res, next) {
        try {
            const userId = req.params.userId; 
            const photos = await PhotoModel.find({ postedBy: userId }).populate('postedBy'); // spec user 
            res.json(photos); 
        } catch (error) {
            res.status(500).json({ error: error.message }); // Če pride do napake, pošljite ustrezno sporočilo o napaki
        }
    }
};