var express = require('express');
var router = express.Router();
var commentController = require('../controllers/commentController');

// zascita poti
function requiresLogin(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/image/:imageId', commentController.listByImage);

router.post('/', commentController.create); 

router.delete('/:id', requiresLogin, commentController.remove);

module.exports = router;
