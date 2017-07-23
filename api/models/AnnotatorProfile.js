/**
 * AnnotatorProfile.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    AID: {
      model: 'Annotators',
      required: true,
      primaryKey: true
    },

    name: {
      type: 'string',
      required: true
    },

    english: {
      type: 'string',
      defaultsTo: 'NO'
    },

    birthdate: {
      type: 'date'
    },

    city: {
      type: 'string'
    },

    country: {
      type: 'string'
    },

    education: {
      type: 'string'
    },

    family: {
      type: 'string'
    },

    gender: {
      type: 'string'
    },

    hobby: {
      type: 'text'
    },

    language: {
      type: 'string'
    },

    profession: {
      type: 'string'
    },

    speciality: {
      type: 'string'
    },

    university: {
      type: 'string'
    }
  }
};

