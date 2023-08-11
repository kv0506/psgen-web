import {Injectable} from '@angular/core';
import {LoginRequest} from "../models/request/login";
import {LoginResponse} from "../models/response/api-response";
import {Deserialize, Serialize} from "cerialize";
import {LocalStorageService} from "ngx-webstorage";
import {HttpService} from "./http.service";
import {UserSession} from "../models/dto/user-session";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentSession: UserSession | undefined;

  constructor(private http: HttpService, private localStorage: LocalStorageService) {
    let cachedUserObj = this.localStorage.retrieve('CurrentSession');
    if (cachedUserObj) {
      this.currentSession = Deserialize(JSON.parse(cachedUserObj), UserSession);
    }
  }

  public isLoggedIn(): boolean {
    let today = new Date();
    if (
      this.currentSession?.expiresAt != undefined &&
      this.currentSession?.expiresAt > today
    ) {
      return true;
    }

    return false;
  }

  public getCurrentSession(): UserSession | undefined {
    return this.currentSession;
  }

  public getAuthToken(): string | undefined {
    return this.currentSession?.id;
  }

  public async login(body: LoginRequest): Promise<LoginResponse> {
    let response = await this.http.post<LoginResponse>('login', body, LoginResponse, undefined);
    if (response.isSuccess) {
      this.localStorage.store(
        'CurrentSession',
        JSON.stringify(Serialize(response.result))
      );
      this.currentSession = response.result;
    }

    return response;
  }

  public logout() {
    this.currentSession = undefined;
    this.localStorage.clear('CurrentSession');
  }
}
