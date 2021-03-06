/**
 * FragmentsController
 *
 * @description :: Server-side logic for managing Fragments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  // достаём фрагмент по FID
	getFragment: (req, res, next) => {
    let FID = req.param('FID');
    FragmentsModerate.findOne({
      FID: FID
    }).populateAll().exec((error, fragment) => {
      if (error) {
        sails.log(error);
      } else {
        // отправляем результат
        res.json({
          FID: FID,
          video: fragment.VID.URL,
          result: fragment.csv === null ? '' : fragment.csv
        });
      }
    });
  }
};

