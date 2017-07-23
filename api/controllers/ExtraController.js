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
	countries: (req, res, next) => {
    res.json(countriesCities.getCountries());
  },

	cities: (req, res, next) => {
    res.json(countriesCities.getCities(req.param('country')));
  },

	languages: (req, res, next) => {
    res.json(languages);
  },

	universities: (req, res, next) => {
    // fs.readFile(__dirname + '/../../assets/world-universities.json', "utf-8", function(err, universities) {
      res.json(universities);
    // });
  }
};

