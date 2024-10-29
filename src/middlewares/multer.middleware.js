import multer from "multer";

// to uploads the files from the local system to local server..

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'Public/temp')
    },
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      // cb(null, file.fieldname + '-' + uniqueSuffix)
      cb(null, file.originalname )
    }
  })
  
  export const upload = multer({
     storage: storage
    
    })