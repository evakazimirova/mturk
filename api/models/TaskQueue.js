/**
 * TaskQueue.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    TID_E: {
      type: 'integer',
      required: true
    },

    TID_M: {
      type: 'integer',
      required: true
    },

    annotatorsCount: {
      type: 'integer',
      required: true
    }
  }
};

