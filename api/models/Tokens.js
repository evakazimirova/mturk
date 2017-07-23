/**
 * Tokens.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    id: {
      type: 'integer',
      required: true,
      primaryKey: true
    },

    AID: {
      model: 'Annotators',
      required: true
    },

    token: {
      type: 'string', // в зашифрованном (SHA1) виде
      required: true
    }
  }
};

