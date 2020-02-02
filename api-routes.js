
// Initialize express router
let router = require('express').Router();
const checkAuth = require("./middleware/auth_check")
//multer for Form Data proccess
const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`)
    }
});

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}
const upload = multer({
     storage: storage,
    limits: {fileSize : 1024 * 1024 * 5},
    fileFilter: fileFilter
});

// const upload = multer({dest:'uploads/'})

// Set default API response
router.get('/', function (req, res) {
    res.json({
        status: `API Its Working`,
        route: router.stack.filter(r => r.route)
        .map(r=> { return {"path":r.route.path, "methods":r.route.methods}}),
        message: 'Welcome to my crafted with love!',
    });
});
// Import user controller
var userController = require('./controller/userController');
// User routes
router.route('/login').post(userController.login);

router.route('/users')
    .get(userController.index)
    .post(upload.single('photo'), userController.new);

router.route('/users/:user_id')
    .get(userController.view)
    .patch(checkAuth, upload.single('photo'), userController.update)
    .put(checkAuth, upload.single('photo'), userController.update)
    .delete(checkAuth, userController.delete);


// Export API routes
module.exports = router;
