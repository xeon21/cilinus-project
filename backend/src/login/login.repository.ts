import { Injectable } from '@nestjs/common';
import { MysqlProvider } from '../database/mysql.provider';
import * as UserDto from "../dto/user.dto";

@Injectable()
export class LoginRepository {
  constructor(private readonly db: MysqlProvider) {}

   //로그인 처리
    async guestLogin(uuid: string, username?: string): Promise<any> {
        const query = 'CALL GuestLogin(?,?)';
        console.log('Raw username:',username);
        const param = [uuid,username];
        const rows = await this.db.executeQuery<any[]>(query,param);
        console.log('Raw Result:',rows);
     
             
        if (!rows || rows.length === 0) {
                 console.log('Raw Result Not Exist');
        
                };
           
        const userdata = rows[0][0];
           
        return {
                 UserIdx: userdata.res,
            };
    }
      
}
