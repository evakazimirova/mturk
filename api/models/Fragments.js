/**
 * Fragments.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    FID: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },

    VID: {
      model: 'Videos',
      required: true
    },

    HID: {
      model: 'Humans',
      required: true
    },

    csv: {
      type: 'text'
    }
  }
};
