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

    birthdate: {
      type: 'date',
      required: true
    },

    city: {
      type: 'string',
      required: true
    },

    country: {
      type: 'string',
      required: true
    },

    education: {
      type: 'string',
      required: true
    },

    english: {
      type: 'string',
      defaultsTo: 'NO'
    },

    family: {
      type: 'string',
      required: true
    },

    gender: {
      type: 'string',
      required: true
    },

    hobby: {
      type: 'text',
      required: true
    },

    language: {
      type: 'string',
      required: true
    },

    name: {
      type: 'string',
      required: true
    },

    profession: {
      type: 'string',
      required: true
    },

    speciality: {
      type: 'string',
      required: true
    },

    university: {
      type: 'string',
      required: true
    }
  }
};

