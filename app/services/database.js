const Request = require('tedious').Request;

module.exports = {
  // функция для вставки ряда в таблицу базы данных
  insertDataIntoTable: (table, queryData) => {
    cols = '';
    vals = '';
    for (let field in queryData) {
      cols += field + ', ';
      vals += `'${queryData[field]}', `;
    }
    cols = cols.slice(0, -2);
    vals = vals.slice(0, -2);

    const sqlQuery = `INSERT INTO Annot_video.dbo.${table} (${cols}) VALUES (${vals})`;

    // const sqlQuery = "SELECT * FROM Annotators";

    request = new Request(sqlQuery, function(err, rowCount) {
      if (err) {
        console.log(err)
      } else {
        console.log(rowCount + ' row(s) inserted into ' + table);
      }
    });

    // request.on('row', function(columns) {
    //   let obj = {}
    //   columns.forEach(function(column) {
    //     obj[column.metadata.colName] = column.value;
    //   });
    //   console.log(obj);
    // });

    global.db.execSql(request);
  }
};