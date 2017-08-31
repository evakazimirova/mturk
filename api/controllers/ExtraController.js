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
  },

  // достаём список видео для туториалов
	tutorialVideos: (req, res, next) => {
    // открываем csv с перечнем видео
    fs.readFile(__dirname + "/../../assets/cat_video.csv", "utf-8", function(error, data) {
      if (error) {
        sails.log(error);
      } else {
        // парсим csv в массив
        const csv = CSVToArray(data);

        // выкидываем последнюю строку
        csv.pop();

        // вынимаем заголовки
        let title = csv.shift();
        let keys = [];
        for (const k of title) {
          keys.push(k);
        }

        // формируем массив объектов
        let objects = [];
        for (const row of csv) {
          let d = {};

          for (const i in row) {
            d[keys[i]] = row[i];
          }

          objects.push(d);
        }

        // отправляем результат
        res.json(objects);
      }
    });
  }
};

// парсер CSV
function CSVToArray(strData, strDelimiter) {
  strDelimiter = (strDelimiter || ",");

  const objPattern = new RegExp(
    (
      "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
      "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
      "([^\"\\" + strDelimiter + "\\r\\n]*))"
    ),
    "gi"
    );

  let arrData = [[]];
  let arrMatches = null;
  while (arrMatches = objPattern.exec(strData)){
    let strMatchedDelimiter = arrMatches[1];
    if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter){
      arrData.push([]);
    }

    let strMatchedValue;
    if (arrMatches[2]){
      strMatchedValue = arrMatches[2].replace(
        new RegExp( "\"\"", "g" ),
        "\""
      );
    } else {
      strMatchedValue = arrMatches[3];
    }
    arrData[arrData.length - 1].push(strMatchedValue);
  }
  return(arrData);
}