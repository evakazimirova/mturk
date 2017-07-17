import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../http.service';
import { CommonService } from '../../../common.service';

@Component({
  selector: 'na-annotating-fragments-table',
  templateUrl: './annotating-fragments-table.component.html',
  styleUrls: ['./annotating-fragments-table.component.scss']
})
export class AnnotatingFragmentsTableComponent implements OnInit {
  constructor(private common: CommonService,
              private http: HttpService) {}

  ngOnInit() {
    // при оценке фрагмента
    this.common.fragmentRated.subscribe(
      rating => {
        // перескакиваем на следуюущий фрагмент
        this.common.rating[this.common.emotion][this.common.cf] = rating;
        if (this.common.cf < this.common.csv.length - 1) {
          this.common.setFragment(this.common.cf + 1);
        }
      }
    );

    // обновляем таблицу при заходе на страницу и при смене FID
    this.updateCSV();
    this.common.videoChanged.subscribe(
      success => {
        this.updateCSV();
      },
      error => {
        console.error(error);
      }
    );
  }

  // обновление таблицы
  updateCSV() {
    // фиксим символы переноса
    this.common.task.result = this.common.task.fragments[this.common.task.currentFragment].result.replace(/\\n/g, '\n');

    // парсим CSV в массив
    const csv = this.CSVToArray(this.common.task.fragments[this.common.task.currentFragment].result, ',');

    // выкидываем первую строку с заголовками
    csv.shift();

    // запоминаем данные
    this.common.updateCSV(csv);
  }

  // парсер CSV
  CSVToArray(strData, strDelimiter){
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
    while (arrMatches = objPattern.exec( strData )){
      let strMatchedDelimiter = arrMatches[ 1 ];
      if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter){
        arrData.push([]);
      }

      let strMatchedValue;
      if (arrMatches[ 2 ]){
        strMatchedValue = arrMatches[ 2 ].replace(
          new RegExp( "\"\"", "g" ),
          "\""
        );
      } else {
        strMatchedValue = arrMatches[ 3 ];
      }
      arrData[ arrData.length - 1 ].push( strMatchedValue );
    }
    return( arrData );
  }

  // проверка, является ли объект числом
  isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
}