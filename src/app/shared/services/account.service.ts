import {Injectable} from '@angular/core';
import {AuthService} from "./auth.service";
import {HttpService} from "./http.service";
import {AccountResponse, AccountsResponse, DeletedResponse} from "../models/response/api-response";
import {CreateAccount, DeleteAccount, UpdateAccount} from "../models/request/account";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private http: HttpService, private authService: AuthService) {
  }

  public async get(accountId: string): Promise<AccountResponse> {
    return await this.http.get<AccountResponse>(`accounts?accountId=${accountId}`, AccountResponse, this.authService.getAuthToken());
  }

  public async getAll(): Promise<AccountsResponse> {
    return await this.http.get<AccountsResponse>('accounts', AccountsResponse, this.authService.getAuthToken());
  }

  public async create(body: CreateAccount): Promise<AccountResponse> {
    return await this.http.put<AccountResponse>('accounts', body, AccountResponse, this.authService.getAuthToken());
  }

  public async update(body: UpdateAccount): Promise<AccountResponse> {
    return await this.http.post<AccountResponse>('accounts', body, AccountResponse, this.authService.getAuthToken());
  }

  public async delete(body: DeleteAccount): Promise<DeletedResponse> {
    return await this.http.put<DeletedResponse>('accounts', body, DeletedResponse, this.authService.getAuthToken());
  }
}
