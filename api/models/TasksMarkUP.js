/**
 * TasksMarkUP.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

let attributes = {
  TID: {
    type: 'integer',
    primaryKey: true,
    autoIncrement: true
  },

  CID: {
    model: 'PersonSelection',
    required: true
  }
}

for (let i = 1; i <= 20; i++) {
  attributes[`E${i}`] = {
    type: 'boolean',
    defaultsTo: 0
  }
}


module.exports = {
  attributes: attributes
};

