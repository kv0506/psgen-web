import {Injectable, Type} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {lastValueFrom} from "rxjs";
import {Deserialize} from "cerialize";
import {environment} from "../../../environments/environment";
import {AlertService} from "./alert.service";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: HttpClient, private alertService: AlertService) {
  }

  public async get<T>(path: string, ctor: Type<T>, authToken: string | undefined): Promise<T> {
    let url = environment.apiConfig.url + path;
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    if (authToken) {
      headers.set('AuthToken', authToken);
    }

    let httpResponse = await lastValueFrom(
      this.http.get(url, {
        headers: headers,
        observe: 'response',
        responseType: 'json',
      })
    );

    return this.parseHttpResponse<T>(httpResponse, ctor);
  }

  public async put<T>(path: string, data: any, ctor: Type<T>, authToken: string | undefined): Promise<T> {
    let url = environment.apiConfig.url + path;
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    if (authToken) {
      headers.set('AuthToken', authToken);
    }

    let httpResponse = await lastValueFrom(
      this.http.put(url, data, {
        headers: headers,
        observe: 'response',
        responseType: 'json',
      })
    );

    return this.parseHttpResponse<T>(httpResponse, ctor);
  }

  public async post<T>(path: string, data: any, ctor: Type<T>, authToken: string | undefined): Promise<T> {
    let url = environment.apiConfig.url + path;
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    if (authToken) {
      headers.set('AuthToken', authToken);
    }

    let httpResponse = await lastValueFrom(
      this.http.post(url, data, {
        headers: headers,
        observe: 'response',
        responseType: 'json',
      })
    );

    return this.parseHttpResponse<T>(httpResponse, ctor);
  }

  public async delete<T>(path: string, data: any, ctor: Type<T>, authToken: string | undefined): Promise<T> {
    let url = environment.apiConfig.url + path;
    let headers = new HttpHeaders({'Content-Type': 'application/json'});

    if (authToken) {
      headers.set('AuthToken', authToken);
    }

    let httpResponse = await lastValueFrom(
      this.http.delete(url, {
        headers: headers,
        body: data,
        observe: 'response',
        responseType: 'json',
      })
    );

    return this.parseHttpResponse<T>(httpResponse, ctor);
  }

  private parseHttpResponse<T>(httpResponse: HttpResponse<any>, ctor: Type<T>): any {
    let apiResponse = Deserialize(httpResponse.body, ctor);

    if (httpResponse.ok) {
      if (!apiResponse.isSuccess) {
        this.alertService.showError(apiResponse.getErrors());
      }
      return apiResponse;
    } else {
      this.alertService.showError(JSON.stringify(httpResponse.body));
    }

    return this.getDefaultApiResponse(apiResponse);
  }

  private getDefaultApiResponse(apiResponse: any): any {
    apiResponse.IsSuccess = false;
    apiResponse.Messages = 'An error occurred in the server. Please try again.';
    return apiResponse;
  }
}
