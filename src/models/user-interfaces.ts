export interface UserInput {
  username: string;
  password?: string;
  mobileToken?: string;
}

export interface UserDbInput {
  _key: string;
  password?: string;
  mobileToken?: string;
}

export interface UserOutput {
  username: string;
  mobileToken?: string;
}

export interface RegisterUserInput {
  password: string;
  mobileToken?: string;
}

export interface UpdateUserInput {
  password?: string;
  mobileToken?: string;
}

export interface UserDocument {
  _key: string;
  password: string;
  mobileToken?: string;
}
