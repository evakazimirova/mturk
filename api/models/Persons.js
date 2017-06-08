/**
 * Persons.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    CID: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },

    VID: {
      model: 'Videos',
      required: true
    },

    personName: {
      type: 'string',
      required: true
    },

    personImage: {
      type: 'string',
      required: true
    }
  }
};

