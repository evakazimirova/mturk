import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  transform(seconds: string | number): string {
    seconds = +seconds; // убеждаемся, что это число
    let minutes: string | number = parseInt(seconds / 60 + '');

    seconds = seconds - minutes * 60; // вычитаем минуты

    seconds = seconds < 10 ? '0' + seconds.toFixed(0) : seconds.toFixed(0);
    minutes = minutes < 10 ? '0' + minutes.toFixed(0) : minutes.toFixed(0);

    return `${minutes}:${seconds}`;
  }

}
