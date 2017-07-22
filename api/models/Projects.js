/**
 * Projects.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    PID: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },

    projectName: {
      type: 'string',
      required: true
    },

    pricePerTask: {
      type: 'float',
      required: true
    },

    pricePerTaskMedium: {
      type: 'float',
      required: true
    },

    pricePerTaskHard: {
      type: 'float',
      required: true
    },

    annoPerTask: {
      type: 'integer',
      defaultsTo: 6
    },

    projectType: {
      type: 'integer',
      defaultsTo: 1
    },

    EWT: {
      type: 'float',
      required: true
    }
  }
};

