/**
 * Tasks.js
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

    PID: {
      model: 'Projects',
      required: true
    },

    CID: {
      model: 'Persons',
      required: true
    },

    task: {
      type: 'string',
      required: true
    },

    csv: {
      type: 'text'
    },

    annoCount: {
      type: 'integer',
      defaultsTo: 0
    },

    annoTasks: {
      collection: 'AnnoTasks',
      via: 'TID'
    }
  }
};

