import { UserOutput, UserDocument } from './user-interfaces';
import { getAll } from '../utils/arangodb';
import { arangoConfig } from '../config/arangodb';

export class Users {
  constructor() {}

  async getUsers(): Promise<Array<UserOutput>> {
    const result = await getAll(arangoConfig.users);
    return result.map(this.formatDocument);
  }

  private formatDocument(userDocument: UserDocument): UserOutput {
    return {
      username: userDocument._key,
      ...(userDocument.mobileToken && {
        mobileToken: userDocument.mobileToken,
      }),
    };
  }
}
