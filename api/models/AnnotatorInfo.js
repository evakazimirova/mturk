/**
 * AnnotatorInfo.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    AID: {
      model: 'Annotators',
      required: true,
      primaryKey: true
    },

    profile: {
      type: 'integer',
      defaultsTo: 0
    },

    englishTest: {
      type: 'string',
      defaultsTo: 'NO'
    },

    demo: {
      type: 'integer',
      defaultsTo: 0
    },

    level: {
      type: 'integer',
      defaultsTo: 1
    },

    taskTaken: {
      type: 'integer'
    }
  }
};

