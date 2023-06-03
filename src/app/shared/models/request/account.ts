export class CreateAccount {
  category: string;
  name: string;
  username: string;
  pattern: string;
  length: number;
  includeSpecialCharacter: boolean;
  useCustomSpecialCharacter: boolean;
  customSpecialCharacter: string;
}

export class UpdateAccount {
  id: string;
  category: string;
  name: string;
  username: string;
  pattern: string;
  length: number;
  includeSpecialCharacter: boolean;
  useCustomSpecialCharacter: boolean;
  customSpecialCharacter: string;
}

export class DeleteAccount {
  id: string;
}
