import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

import {
  UserOutput,
  UpdateUserInput,
  UserDbInput,
  RegisterUserInput,
  UserInput,
  UserDocument,
} from './user-interfaces';
import {
  insertOne,
  deleteOne,
  getByKey,
  update,
  executeAQL,
} from '../utils/arangodb';
import { arangoConfig } from '../config/arangodb';
import { BadRequestError } from '../errors/bad-request-error';

const scryptAsync = promisify(scrypt);

const { users } = arangoConfig;

export class User {
  constructor(private username: string) {}

  async register(registerUserInput: RegisterUserInput): Promise<UserOutput> {
    const dbInput = await this.formatDbInput({
      username: this.username,
      ...registerUserInput,
    });
    const result = await insertOne(users, dbInput);
    return this.formatDocument(result);
  }

  async deleteUser(): Promise<UserOutput> {
    const result = await deleteOne(users, this.username);
    return this.formatDocument(result);
  }

  async getUser(): Promise<UserOutput> {
    const result = await getByKey(users, this.username);
    return this.formatDocument(result);
  }

  async signIn(password: string): Promise<UserOutput> {
    const result = await getByKey(users, this.username);
    const passwordsMatch = await this.compare(result.password, password);
    if (!passwordsMatch || !result.password) {
      throw new BadRequestError('Username or password is invalid.');
    }
    return this.formatDocument(result);
  }

  async updateUser(updateUserInput: UpdateUserInput): Promise<UserOutput> {
    const dbInput = await this.formatDbInput({
      username: this.username,
      ...updateUserInput,
    });
    const result = await update(users, this.username, dbInput);
    return this.formatDocument(result);
  }

  async getUserRooms(): Promise<Array<string>> {
    const aql = `FOR r IN rooms 
    FILTER POSITION(r.participants[*], "${this.username}")
    RETURN r._key`;
    const result = await executeAQL(aql);
    return result;
  }

  private async formatDbInput(userInput: UserInput): Promise<UserDbInput> {
    const { username: _key, password = null, ...others } = userInput;
    if (password) {
      const hashed = await this.toHash(password);
      return { _key, password: hashed, ...others };
    } else {
      return { ...others, _key };
    }
  }

  private formatDocument(userDocument: UserDocument): UserOutput {
    return {
      username: userDocument._key,
      ...(userDocument.mobileToken && {
        mobileToken: userDocument.mobileToken,
      }),
    };
  }

  private async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return buf.toString('hex') === hashedPassword;
  }

  private async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }
}
