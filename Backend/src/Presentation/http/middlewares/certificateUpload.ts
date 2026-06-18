import multer from 'multer'
// import path from 'path'
// import fs from 'fs'
import { AppError } from '../../../Domain/errors/app.error'
import { settingsMessages } from '../../../Shared/constsnts/messages/settingsMessages'
import { statusCode } from '../../../Shared/Enumes/statusCode'

// const uploadPath = path.join(__dirname, '../../uploads')
// if(!fs.existsSync(uploadPath)){
//     fs.mkdirSync(uploadPath, {recursive: true})
// }


export const certificateUpload = multer({
    storage: multer.memoryStorage(),
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        const allowed = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'application/pdf'
        ]

        if(allowed.includes(file.mimetype)){
            cb(null, true)
        } else {
            cb(new AppError(settingsMessages.error.INVALID_FILE_TYPE, statusCode.BAD_REQUEST))
        }
    }
})