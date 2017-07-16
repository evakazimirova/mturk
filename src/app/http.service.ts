import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class HttpService {
  constructor(private http: Http) {}

  // GET. Получение JSON-объекта
  get(url) {
    return this.http.get(url)
      .map((response: Response) => response.json());
  }

  // GET. Получение любых данных
  getRough(url) {
    return this.http.get(url);
  }

  // POST. Получение JSON-объекта
  post(data: any, url: string) {
    const body = JSON.stringify(data);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(url, body, {
      headers: headers
    }).map((response: Response) => response.json());
  }
}