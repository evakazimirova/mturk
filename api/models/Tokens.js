/**
 * Tokens.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    AID: {
      model: 'Annotators',
      primaryKey: true,
      required: true
    },

    token: {
      type: 'string', // в зашифрованном (SHA1) виде
      required: true
    }
  }
};

