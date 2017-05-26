const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

const configuration = require('../config');

// пытаемся подключиться к базе данных
global.db = new Connection(configuration.db);

module.exports = {
  // вынуть данные из таблицы
  select: (table, query, cb) => {
    global.db.on('connect', function(err) {
      if (err) {
        console.log(err)
      } else {
        let where;
        if (query.where) {
          where = 'WHERE ' + query.where;
        } else {
          where = '';
        }

        const sqlQuery = `SELECT ${query.cols} FROM ${table} ${where}`;

        request = new Request(sqlQuery, function(err, rowCount) {
          if (err) {
            console.log(err)
          } else {
            console.log(rowCount + ' row(s) selected from ' + table);
          }
        });

        global.db.execSql(request);

        let output = [];
        request.on('row', function(columns) {
          let rowData = {}
          // заполняем объект возвращёнными данными
          columns.forEach(function(column) {
            if (column.value === null) {
              rowData[column.metadata.colName] = 'NULL';
            } else {
              rowData[column.metadata.colName] = column.value;
            }
          });

          output.push(rowData);
        });

        // возвращаем массив объектов из запроса
        request.on('requestCompleted', function (rowCount, more, returnStatus, rows) {
          cb(output);
        });
      }
    });
  },

  // вставка ряда в таблицу базы данных
  insert: (table, data) => {
    global.db.on('connect', function(err) {
      if (err) {
        console.log(err)
      } else {
        const queryData = generateQueryData(data);

        const sqlQuery = `INSERT INTO Annot_video.dbo.${table} (${queryData.cols}) VALUES (${queryData.vals})`;

        request = new Request(sqlQuery, function(err, rowCount) {
          if (err) {
            console.log(err)
          } else {
            console.log(rowCount + ' row(s) inserted into ' + table);
          }
        });

        global.db.execSql(request);
      }
    });
  },

  // обновление данных таблицы
  update: (table, data, where) => {
    global.db.on('connect', function(err) {
      if (err) {
        console.log(err)
      } else {
        const queryData = generateQueryDataForSet(data);

        const sqlQuery = `UPDATE ${table} SET ${queryData} WHERE ${where}`;
        console.log(sqlQuery);

        request = new Request(sqlQuery, function(err, rowCount) {
          if (err) {
            console.log(err)
          } else {
            console.log(rowCount + ' row(s) updated of ' + table);
          }
        });

        global.db.execSql(request);
      }
    });
  },

  // удаление записи из таблицы
  delete: (table, where) => {
    global.db.on('connect', function(err) {
      if (err) {
        console.log(err)
      } else {
        const sqlQuery = `UPDATE ${table} SET ${queryData} WHERE ${where}`;
        console.log(sqlQuery);

        request = new Request(sqlQuery, function(err, rowCount) {
          if (err) {
            console.log(err)
          } else {
            console.log(rowCount + ' row(s) deleted from ' + table);
          }
        });

        global.db.execSql(request);
      }
    });
  }
};

function generateQueryData(data) {
  queryData = {
    cols: '',
    vals: ''
  };

  for (let field in data) {
    queryData.cols += field + ', ';
    queryData.vals += `'${data[field]}', `;
  }

  queryData.cols = queryData.cols.slice(0, -2);
  queryData.vals = queryData.vals.slice(0, -2);

  return queryData;
}

function generateQueryDataForSet(data) {
  queryData = '';

  for (let field in data) {
    queryData += `${field} = '${data[field]}', `;
  }

  queryData = queryData.slice(0, -2);

  return queryData;
}