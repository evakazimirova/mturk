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


    tasks: {
      collection: 'AnnoTasks',
      via: 'AID'
    },

    otherInfo: {
      collection: 'AnnotatorInfo',
      via: 'AID'
    },

    profile: {
      collection: 'AnnotatorProfile',
      via: 'AID'
    },
  }
};

