
import { LoginRepository } from './login.repository';
import { Injectable } from "@nestjs/common";


@Injectable()
export class LoginService {
  
  constructor(
    //private readonly blogMongoRepo: BlogMongoRepository,
    private readonly mysqlProvider: LoginRepository,
  ) {}

  guestLogin(uuid: string, username?: string) {
     return this.mysqlProvider.guestLogin(uuid,username);
  }

}
