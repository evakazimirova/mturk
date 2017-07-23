/**
 * ExtraController
 *
 * @description :: Server-side logic for managing extras
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var fs = require('fs');

const countriesCities = require('country-city');
const languages = require('languages-list');
const universities = require('../../assets/world-universities.json');

module.exports = {
  // достаём страны
	countries: (req, res, next) => {
    res.json(countriesCities.getCountries());
  },

  // достаём города страны
	cities: (req, res, next) => {
    res.json(countriesCities.getCities(req.param('country')));
  },

  // достаём языки
	languages: (req, res, next) => {
    res.json(languages);
  },

  // достаём университеты
	universities: (req, res, next) => {
    res.json(universities);
  }
};

