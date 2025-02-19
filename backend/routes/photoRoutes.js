var express = require('express');
// Vključimo multer za file upload
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

var router = express.Router();
var photoController = require('../controllers/photoController.js');

function requiresLogin(req, res, next){
    if(req.session && req.session.userId){
        return next();
    } else{
        var err = new Error("You must be logged in to view this page");
        err.status = 401;
        return next(err);
    }
}

router.get('/', photoController.list);
//router.get('/publish', requiresLogin, photoController.publish);
router.get('/:id', photoController.show);
//        fetch(`http://localhost:3001/photos/${userId}`)


router.post('/', requiresLogin, upload.single('image'), photoController.create);


router.post('/:id/like/:userId', photoController.like);
router.post('/:id/dislike/:userId', photoController.dislike);
router.get('/:id/check-like/:userId', photoController.checkLike)
router.post('/:id/unlike/:userId', photoController.unlike);
router.post('/:id/undislike/:userId', photoController.undislike);;

router.put('/:id', photoController.update);

router.delete('/:id', photoController.remove);

router.post('/:id/report', requiresLogin, photoController.reportPhoto);

module.exports = router;

