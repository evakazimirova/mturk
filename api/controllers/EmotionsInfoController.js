/**
 * EmotionsInfoController
 *
 * @description :: Server-side logic for managing Emotioninfoes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getAll: (req, res, next) => {
    EmotionsInfo.find().exec((error, emotions) => {
      newEmotions = {};
      for (const e of emotions) {
        const EID = e.EID;
        delete e.EID;
        delete e.createdAt;
        delete e.updatedAt;
        newEmotions[EID] = e;
      }
      res.json(newEmotions);
    });
  }
};

