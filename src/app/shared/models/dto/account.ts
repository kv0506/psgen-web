import {autoserialize} from "cerialize";

export class Account {
  @autoserialize id: string;
  @autoserialize category: string;
  @autoserialize name: string;
  @autoserialize username: string;
  @autoserialize pattern: string;
  @autoserialize length: number;
  @autoserialize includeSpecialCharacter: boolean;
  @autoserialize useCustomSpecialCharacter: boolean;
  @autoserialize customSpecialCharacter: string;
  @autoserialize notes: string;
}
