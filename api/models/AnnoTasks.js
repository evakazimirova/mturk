/**
 * AnnoTasks.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    ATID: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },

    TID: {
      model: 'Tasks',
      required: true
    },

    AID: {
      model: 'AnnotatorInfo',
      required: true
    },

    status: {
      type: 'integer',
      defaultsTo: 1
    },

    price: {
      type: 'float',
      defaultsTo: 0
    },

    done: {
      type: 'integer',
      defaultsTo: 0
    },

    result: {
      type: 'text'
    },

    deadline: {
      type: 'datetime'
    }
  }
};

