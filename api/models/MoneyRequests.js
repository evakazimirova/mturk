/**
 * MoneyRequests.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    RID: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },

    AID: {
      model: 'Annotators',
      required: true
    },

    defrayed: {
      type: 'boolean',
      required: true
    },

    price: {
      type: 'float',
      required: true
    }
  }
};

