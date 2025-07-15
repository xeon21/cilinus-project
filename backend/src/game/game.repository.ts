import { Injectable } from '@nestjs/common';
import { MysqlProvider } from '../database/mysql.provider';
import * as ClientDto from "../dto/client_dto";
import { RequestDto_SwapGold } from "../dto/request.dto"; // DTO 임포트
@Injectable()
export class GameRepository {
  constructor(private readonly db: MysqlProvider) {}

}
