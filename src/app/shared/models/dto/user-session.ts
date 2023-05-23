import {autoserialize, autoserializeAs} from "cerialize";

export class UserSession {
  @autoserialize id: string;
  @autoserialize userId: string;
  @autoserialize secret: string;
  @autoserializeAs(Date) expiresAt: Date;
}
