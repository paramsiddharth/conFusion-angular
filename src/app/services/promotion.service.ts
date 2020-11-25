import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { of, Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { map, catchError } from 'rxjs/operators';
import { features } from 'process';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient,
    private processHttpMsgService: ProcessHTTPMsgService) { }

  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${baseURL}/promotions`)
      .pipe(this.processHttpMsgService.handleError);
  }

  getPromotion(id: string): Observable<Promotion> {
    return this.http.get<Promotion>(`${baseURL}/promotions/${id}`)
    .pipe(this.processHttpMsgService.handleError);
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return this.http.get<Promotion[]>(`${baseURL}/promotions`, {
      params: {
        featured: 'true'
      }
    }).pipe(map(promos => promos[0]))
      .pipe(catchError(this.processHttpMsgService.handleError));
  }
}
