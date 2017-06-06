/**
 * MarkUPResults.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    TID: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },

    CID: {
      type: 'integer',
      required: true
    },

    AID: {
      type: 'integer',
      required: true
    },

    CSV: {
      type: 'text',
      required: true
    },

    done: {
      type: 'boolean',
      required: true
    }
  }
};

