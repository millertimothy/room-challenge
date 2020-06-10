import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

import {
  insertOne,
  getByKey,
  getAll,
  deleteOne,
  update,
} from '../services/arangodb';
import { BadRequestError } from '../errors/bad-request-error';
import { UserInput, UserOutput, UserDbInput } from './user-interfaces';

const scryptAsync = promisify(scrypt);

export class User {
  async save(userInput: UserInput): Promise<UserOutput> {
    const result = await insertOne(
      'users',
      await this.formatDbInput(userInput),
    );
    return this.formatDbOutput(result);
  }

  async getUser(username: string): Promise<UserOutput> {
    const user = await getByKey('users', username);
    return this.formatDbOutput(user);
  }

  async getUsers(): Promise<Array<UserOutput>> {
    const users = await getAll('users');
    return users.map(this.formatDbOutput);
  }

  async deleteUser(username: string): Promise<UserOutput> {
    const result = await deleteOne('users', username);
    return this.formatDbOutput(result);
  }

  async updateUser(updateUserInput: UserInput): Promise<UserOutput> {
    const { _key, ...newValue } = await this.formatDbInput(updateUserInput);
    const user = await update('users', _key, newValue);
    return this.formatDbOutput(user);
  }

  async signIn(username: string, password: string): Promise<UserOutput> {
    const user = await getByKey('users', username);
    const passwordsMatch = await this.compare(user.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError('Username or password is invalid.');
    }
    return this.formatDbOutput(user);
  }

  async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    return buf.toString('hex') === hashedPassword;
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

  private formatDbOutput(userDbOutput: any): UserOutput {
    const { _key: username, mobileToken = null } = userDbOutput;
    return { username, mobileToken };
  }

  private async toHash(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }
}
