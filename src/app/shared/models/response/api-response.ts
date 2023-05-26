import {autoserialize, autoserializeAs, inheritSerialization} from "cerialize";
import {UserSession} from "../dto/user-session";
import {Account} from "../dto/account";

export class ApiResponse {
  @autoserialize isSuccess: boolean;
  @autoserialize message: string;
}

@inheritSerialization(ApiResponse)
export class DeletedResponse extends ApiResponse {
  @autoserialize result: boolean;
}

@inheritSerialization(ApiResponse)
export class LoginResponse extends ApiResponse {
  @autoserializeAs(UserSession,'result') result: UserSession;
}

@inheritSerialization(ApiResponse)
export class AccountResponse extends ApiResponse {
  @autoserializeAs(Account,'result') result: Account;
}

@inheritSerialization(ApiResponse)
export class AccountsResponse extends ApiResponse {
  @autoserializeAs(Account,'result') result: Array<Account>;
}
