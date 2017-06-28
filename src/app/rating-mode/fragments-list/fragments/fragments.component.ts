import { HttpService } from '../../../http.service';
import { CommonService } from '../../../common.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'na-fragments',
  templateUrl: './fragments.component.html',
  styleUrls: ['./fragments.component.scss']
})
export class FragmentsComponent implements OnInit {

  constructor(private common: CommonService, private http: HttpService) {}

  ngOnInit() {
    this.common.fragmentRated.subscribe(
      (rating) => {
        this.common.rating[this.common.emotion][this.common.cf] = rating;
        if (this.common.cf < this.common.csv.length - 1) {
          this.common.setFragment(this.common.cf + 1);
        }
      }
    );

    // 3. При выборе видеозаписи, открывается файл на сервере с именем, совпадающим с именем csv. В этом файле содержится информация о фрагментах, которые необходимо оценить. Структура файла: Номер фрагмента;Начало фрагмента;Конец фрагмента
    // 4. Web-интерфейс отображает список фрагментов, и выставленную им оценку в выбранной шкале.
    this.common.task.result = this.common.task.result.replace(/\\n/g, '\n'); // если символы переноса строки выглядят как '\n', то меняем их именно на переносы
    const csv = this.CSVToArray(this.common.task.result, ',');

    // выкидываем строки
    csv.shift(); // первую (названия столбцов)
    // csv.pop(); // последнюю (пустая строка)

    this.common.updateCSV(csv); // запоминаем данные для доступа во всех компонентах
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
