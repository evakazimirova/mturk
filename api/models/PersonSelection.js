/**
 * PersonSelection.js
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
      type: 'integer',
      required: true
    },

    CURI: {
      type: 'string',
      required: true
    },

    personName: {
      type: 'string',
      required: true
    },

    PersonImage: {
      type: 'string',
      required: true
    }
  }
};

