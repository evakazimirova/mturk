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

    englishTestMark: {
      type: 'integer'
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
    },

    firstTime: {
      type: 'boolean',
      defaultsTo: true
    },

    registered: {
      type: 'boolean',
      defaultsTo: false
    },

    banned: {
      type: 'boolean',
      defaultsTo: false
    },

    moneyAvailable: {
      type: 'float',
      defaultsTo: 0
    },

    rating: {
      type: 'integer',
      defaultsTo: 0
    },

    lastlogin: {
      type: 'datetime'
    },

    tutorials: {
      type: 'string'
    }
  }
};

