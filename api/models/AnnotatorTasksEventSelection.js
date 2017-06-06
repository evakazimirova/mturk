/**
 * AnnotatorTasksEventSelection.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    ATID: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      required: true
    },

    TID: {
      model: 'TasksEventSelection',
      required: true
    },

    AID: {
      model: 'Annotators',
      required: true
    },

    status: {
      type: 'integer',
      required: true
    },

    price: {
      type: 'float',
      required: true
    }
  }
};

