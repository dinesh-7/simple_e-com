const express = require('express');

const router = express.Router();

router.get('/',(req,res)=>{
    console.log("from API");
    res.write("Hello DInesh");
    res.end();
});

router.put('/',(req,res)=>{
    console.log("from API");
    res.write("Hello put from DInesh");
    res.end();
});

module.exports = router;