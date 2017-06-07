/**
 * TasksEventSelection.js
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
      model: 'PersonSelection',
      required: true
    },

    events: {
      type: 'string',
      required: true
    },

    annoCount: {
      type: 'integer',
      defaultTo: 0
    },

    annotators: {
      collection: 'AnnotatorTasksEventSelection',
      via: 'TID'
    }
  }
};

