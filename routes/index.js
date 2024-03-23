var express = require('express');
var router = express.Router();
const ShortUrl = require('../models/url')
const shortId = require('shortid')
const createHttpError = require('http-errors')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/',async (req,res,next)=>{
  try{
    const {url} = req.body
    if(!url){
      throw createHttpError.BadRequest('Provide a valid url')
    }

    const urlExist = await ShortUrl.findOne({url})
    if(urlExist){
      res.render('index',{short_url:`http://localhost:3000/${urlExist.shortId}`})
      return
    }

    const shortUrl = new ShortUrl({url:url,shortId:shortId.generate()})
    const result = await shortUrl.save()

    res.render('index',{short_url:`http://localhost:3000/${result.shortId}`})

  }catch(err){
    next(err)
  }
})

router.get('/:shortId',async (req,res,next)=>{
  try{
    const {shortId} = req.params
    const result = await ShortUrl.findOne({shortId})
    if(!result){
      throw createHttpError.NotFound('Short urldoes not exist')
    }

    res.redirect(result.url)
  }catch(err){
    next(err)
  }

 
})

router.use((req,res,next)=>{
  next(createHttpError.NotFound())
})

router.use((err,req,res,next)=>{
  res.status(err.status || 500)
  res.render('index',{error:err.message})
})

module.exports = router;
