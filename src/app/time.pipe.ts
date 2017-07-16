import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  transform(seconds: string | number): string {
    seconds = +seconds; // убеждаемся, что это число
    let minutes: string | number = parseInt(seconds / 60 + ''),
        hours: string | number = parseInt(minutes / 60 + '');

    seconds = seconds - minutes * 60; // вычитаем минуты
    minutes = minutes - hours * 60; // вычитаем часы

    seconds = seconds < 10 ? '0' + seconds.toFixed(2) : seconds.toFixed(2);
    minutes = minutes < 10 ? '0' + minutes.toFixed(0) : minutes.toFixed(0);
    hours = hours < 10 ? '0' + hours.toFixed(0) : hours.toFixed(0);

    return `${hours}:${minutes}:${seconds}`;
  }

}
