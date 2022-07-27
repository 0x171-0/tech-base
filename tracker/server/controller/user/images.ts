import config from 'config'
import ImagesDb from '../../db/modules/user/images'
import { TechBaseRouter } from '../../infra/interfaces/express'
import { ErrorHandler } from '../../middleWares/errorHandler'
import { ErrorType } from '../../infra/enums/errorType'
import path from 'path'
import { Request } from 'express'
import logger from '../../utils/logger'
const tag = 'controller/user/images'

const AWS = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')

const s3 = new AWS.S3({
	accessKeyId: config.get('aws.s3.accessKeyId'),
	secretAccessKey: config.get('aws.s3.secretAccessKey'),
	Bucket: config.get('aws.s3.bucket'),
})

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: config.get('aws.s3.userImagesFolder'),
		acl: 'public-read',
		key: function (req: Request, file: any, cb: any) {
			const { userId, randomNum } = req.body
			cb(null, `${userId}_${randomNum}${path.extname(file.originalname)}`)
		},
	}),
})

class Images {
	usUpload = upload.fields([
		{
			name: 'userImage',
			maxCount: 1,
		},
	])

	uploadImage: TechBaseRouter = async (req, res, next) => {
		const _tag = '/uploadImage'
		try {
			const { randomNum } = req.body
			// @ts-ignore
			const fileName = req.files.userImage[0].originalname
			const newImg = `${req.me.id}_${randomNum}${path.extname(fileName)}`

			const upload = await ImagesDb.uploadImage(req.me.id, newImg)
			if (upload.error) {
				throw new ErrorHandler(403, ErrorType.DatabaseError, upload.error)
			}
			res.status(200).send({
				result: 'success',
				data: upload,
			})
		} catch (error) {
			logger.error({
				tag: tag + _tag,
				error,
			})
			next(error)
		}
	}
}

// TODO: Delete images
/*   const deleteImg = await User.deleteImg( userId );
  if ( deleteImg ) {
    const s3 = new AWS.S3( {
      accessKeyId: ACCESSKEYID,
      secretAccessKey: SECRETACCESSKEY,
      Bucket: 'white-100.online',
    } );
    s3.deleteObject( {
      Bucket: 'white-100.online/TechBase/user',
      Key: deleteImg[0].picture,
    }, function(err, data) {
      if (err) throw new ErrorHandler( 403, 'DatabaseError', err );
      console.log( 'deleteImg data', data );
    } );
  } */

export = new Images()
