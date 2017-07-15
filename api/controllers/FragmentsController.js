/**
 * FragmentsController
 *
 * @description :: Server-side logic for managing Fragments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getFragment: (req, res, next) => {
    let FID = req.param('FID');

    Fragments.findOne({
      FID: FID
    }).populateAll().exec((err, fragment) => {
      res.json({
        FID: FID,
        video: fragment.VID.URL,
        result: fragment.csv === null ? '' : fragment.csv
      });
    });
  }
};

