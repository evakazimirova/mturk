import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../../../http.service';
import { CommonService } from '../../../../common.service';
import { AnnotatingService } from '../../../annotating/annotating.service';

@Component({
  selector: 'na-annotating-fragments-table',
  templateUrl: './annotating-fragments-table.component.html',
  styleUrls: ['./annotating-fragments-table.component.scss']
})
export class AnnotatingFragmentsTableComponent implements OnInit {
  constructor(private http: HttpService,
              public annot: AnnotatingService) {}

  ngOnInit() {
    // обновляем таблицу при заходе на страницу и при смене FID
    this.updateCSV();
    this.annot.videoChanged.subscribe(
      success => {
        this.updateCSV();
      },
      error => {
        console.error(error);
      }
    );

    $(document).ready(() => {
      console.log($('.right-col tbody').scrollTop);
    });
  }

  // обновление таблицы
  updateCSV() {
    // фиксим символы переноса
    this.annot.task.FIDs[this.annot.FID].result.csv = this.annot.task.FIDs[this.annot.FID].result.csv.replace(/\\n/g, '\n');

    // парсим CSV в массив
    const csv = this.CSVToArray(this.annot.task.FIDs[this.annot.FID].result.csv, ',');

    // запоминаем данные
    this.annot.updateCSV(csv);
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
