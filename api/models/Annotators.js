/**
 * Annotators.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    AID: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },

    login: {
      type: 'string',
      required: true
    },

    email: {
      type: 'email',
      required: true
    },

    password: {
      type: 'string', // в зашифрованном (SHA1) виде
      required: true
    },

    emailToken: {
      type: 'string' // в зашифрованном (SHA1) виде
    },

    registered: {
      type: 'boolean',
      defaultsTo: false
    },

    banned: {
      type: 'boolean',
      defaultsTo: false
    },

    firstName: {
      type: 'string',
      required: true
    },

    secondName: {
      type: 'string',
      required: true
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

    tasks: {
      collection: 'AnnoTasks',
      via: 'AID'
    },

    otherInfo: {
      collection: 'AnnotatorInfo',
      via: 'AID'
    },
  }
};

