import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class HttpService {
  constructor(private http: Http) {}

  // получение данных
  getRough(url) {
    return this.http.get(url);
  }

  // получение данных JSON
  get(url) {
    return this.http.get(url)
      .map((response: Response) => response.json());
  }
}