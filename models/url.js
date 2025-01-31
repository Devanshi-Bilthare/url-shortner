const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    shortId:{
        type:String,
        required : true,
        unique:true
    },
    url:{
        type:String,
        required:true
    }
})

const URL = mongoose.model('url',urlSchema)

module.exports = URL