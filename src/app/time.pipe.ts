import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(seconds: string | number): string {
    seconds = +seconds; // убеждаемся, что это число
    let minutes: string | number = parseInt(seconds / 60 + ""),
        hours: string | number = parseInt(minutes / 60 + ""),
        milliseconds = "00";

    seconds = seconds - minutes * 60; // вычитаем минуты
    minutes = minutes - hours * 60; // вычитаем часы

    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    hours = hours < 10 ? "0" + hours : hours;

    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

}
