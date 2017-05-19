var express = require('express');
var router = express.Router();

router.route('/registration/:sha1')
  .get(function(request, response){
    response.send(request.params.sha1);
  });

module.exports = router;