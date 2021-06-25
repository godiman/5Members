const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    
        destination: (req, file, cb)=>{
            return cb(null, 'public/notice_file');
        },
        filename: (req, file, cb) =>{
            return cb(null, file.fieldname + '_' + Date.now().toString() + path.extname(file.originalname));
        }
        
    });

    var noticeFile = multer({
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            if(ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.doc' && ext !== '.docx' && ext !== '.pdf' && ext !== '.xls' && ext !== '.xlsx' && ext !== '.jpeg') {
                // checks the file extension
                req.fileValidationError = "Invalid extension";
                return callback(null, false, req.fileValidationError);
            }
            callback(null, true);
        }
}).single('notice_file');

module.exports = noticeFile;