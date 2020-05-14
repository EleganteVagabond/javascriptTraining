'use strict';

// image manipulation
const sharp = require('sharp')
// file system
const fs = require('fs')
// used to set the postimage url
const CONTAINER_URL = '/api/containers/'

module.exports = function (PostImage) {
    // the endpoint for uploads which creates and ImageFile object and saves the file to the server (outside of the db)
    PostImage.upload = function (ctx, options, accessToken, postId, cb) {
        if (!options) {
            options = {}
        }
        ctx.req.params.container = 'postImages'
        // ensure the directory exists (should probably be done 1x in a server startup script)
        var serverDir = './server/storage/' + ctx.req.params.container
        if (!fs.existsSync(serverDir)) {
            fs.mkdirSync(serverDir)
        }
        // use the ImageFile upload endpoint to actually upload the file then create the database hooks so we can load it later
        PostImage.app.models.ImageFile.upload(ctx.req, ctx.result, options, (err, file) => {
            if (err) {
                cb(err)
            } else {
                var fileInfo = file.files.file[0]
                // open file
                sharp(serverDir + '/' + fileInfo.name)
                    .resize(100)
                    .toFile(serverDir + '/100-' + fileInfo.name, (err) => {
                        if (!err) {
                            PostImage.create({
                                // url to Image dl endpoint for the original file (see explorer for format)
                                url: CONTAINER_URL + fileInfo.container + '/download/' + fileInfo.name,
                                // url to Image dl endpoint for the thumbnail
                                thumbnail: CONTAINER_URL + fileInfo.container + '/download/100-' + fileInfo.name,
                                created_at: new Date(),
                                postId: postId,
                                userId: userId,
                            }, (pierr, pi) => {
                                if (pierr) {
                                    cb(pierr)
                                } else {
                                    cb(null, pi)
                                }
                            })
                        }
                    })
            }
        })
    }
    // configures the route
    PostImage.remoteMethod(
        'upload',
        {
            description: 'Uploads a file',
            accepts: [
                { arg: 'ctx', type: 'object', http: { source: 'context' } },
                { arg: 'options', type: 'object', http: { source: 'query' } },
                { arg: 'access_token', type: 'string' },
                { arg: 'post_id', type: 'string' },
                { arg: 'user_id', type: 'string' }
            ],
            returns: {
                arg: 'fileObject', type: 'object', root: true
            },
            http: { verb: 'post' }
        }
    )

};
