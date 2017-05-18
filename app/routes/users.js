var express = require('express');
var router = express.Router();

router.route('/')
  .get(function(request, response){
    response.send('Hello world');
  });
router.route('/:name')
  .all(function (request, response, next) {
    // то же, что и app.param()
  })
  .get(); // сначала будет обрабатываться all, а затем любой другой запрос

module.exports = router;