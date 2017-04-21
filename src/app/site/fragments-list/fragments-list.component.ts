import { HttpService } from '../http.service';
import { PushService } from '../push.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-fragments-list',
  templateUrl: './fragments-list.component.html',
  styleUrls: ['./fragments-list.component.scss']
})
export class FragmentsListComponent implements OnInit {
  pathToData: string;
  csv: any;

  currentFragment = 0;

  constructor(private push: PushService, private http: HttpService) { }

  ngOnInit() {
    // читаем файл конфигурации
    // this.http.get('./assets/conf.json').subscribe(
    //   (conf) => {
    //     this.pathToData = conf.pathToData;
    //   },
    //   (error) => console.log(error)
    // );

    this.push.markForThisChunk.subscribe(
      (mark) => {
        console.log("Фрагмент оценнён в " + mark);

        this.csv[this.currentFragment][3] = mark;
        this.currentFragment++;
        // this.markForThisChunk = msg
        // currentChunkRating.text(rating)

        // nextChunk = currentChunk.next();

        // currentChunk.removeClass('warning');
        // currentChunk.addClass('success');
        // nextChunk.addClass('warning');

        // currentChunk = nextChunk;
        // currentChunkRating = currentChunk.find('td:last-child');
      }
    );

    // 3. При выборе видеозаписи, открывается файл на сервере с именем, совпадающим с именем csv. В этом файле содержится информация о фрагментах, которые необходимо оценить. Структура файла:
    // Номер фрагмента/Начало фрагмента/Конец фрагмента
    this.push.currentVideo.subscribe(
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
