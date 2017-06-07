/**
 * EmotionInfo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    shortName: {
      type: 'string',
      primaryKey: true,
      autoIncrement: true
    },

    longName: {
      type: 'string',
      required: true
    },

    scale: {
      type: 'integer',
      defaultsTo: 1
    }
  }
};

