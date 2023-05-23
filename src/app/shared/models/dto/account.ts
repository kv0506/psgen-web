import {autoserialize} from "cerialize";

export class Account {
  @autoserialize id: string;
  @autoserialize category: string;
  @autoserialize name: string;
  @autoserialize pattern: string;
  @autoserialize length: number;
  @autoserialize includeSpecialCharacter: boolean;
  @autoserialize useCustomSpecialCharacter: boolean;
  @autoserialize customSpecialCharacter: boolean;
}