import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  post<T>(endpoint: string, body: unknown, headers?: Record<string, string>): Observable<T> {
    const options = headers ? { headers: new HttpHeaders(headers) } : {};
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, options);
  }

  get<T>(endpoint: string,headers?: Record<string, string>) : Observable<T> {
    const options = headers ? { headers: new HttpHeaders(headers) } : {};
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, options);
  }
}
