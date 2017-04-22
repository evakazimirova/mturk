import { HttpService } from '../http.service';
import { CommonService } from '../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-fragments-list',
  templateUrl: './fragments-list.component.html',
  styleUrls: ['./fragments-list.component.scss']
})
export class FragmentsListComponent implements OnInit {
  pathToData: string;
  csv: any;
  emotions: string[];

  constructor(private common: CommonService, private http: HttpService) {
    this.common.cf = 0
  }

  ngOnInit() {
    // 4. Выбор шкалы осуществляется пользователем из некоторого заранее заданного файла.
    this.http.get('./assets/conf.json').subscribe(
      (conf) => {
        this.emotions = conf.emotions;
      },
      (error) => console.log(error)
    );

    this.common.currentFragment.subscribe(
      (i) => {
        if(i >= 0 && i < this.common.csv.length) {
          this.common.cf = i
        }
      }
    );

    this.common.markForThisChunk.subscribe(
      (mark) => {
        this.csv[this.common.cf][3] = mark;
        if(this.common.cf < this.common.csv.length - 1) {
          this.common.setFragment(this.common.cf + 1);
        }
      }
    );

    // 3. При выборе видеозаписи, открывается файл на сервере с именем, совпадающим с именем csv. В этом файле содержится информация о фрагментах, которые необходимо оценить. Структура файла: Номер фрагмента;Начало фрагмента;Конец фрагмента
    // 4. Web-интерфейс отображает список фрагментов, и выставленную им оценку в выбранной шкале.
    this.common.currentVideo.subscribe(
      (video) => {
        this.http.getRough(video + ".csv").subscribe(
          data => {
            this.csv = this.CSVToArray(data.text(), ";");

            // Дополняем таблицу оценками
            for (let row of this.csv) {
              row.push(-1);
            }

            // выкидываем первую и последнюю строки (названия столбцов и пустая строка)
            this.csv.pop();
            this.csv.shift();

            this.common.updateCSV(this.csv); // запоминаем данные для доступа во всех компонентах
            // console.log(this.csv);
          },
          error => console.log(error)
        );
      },
      (error) => console.log(error)
    );
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
