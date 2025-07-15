
import { GameRepository } from "./game.repository";
import { Injectable } from "@nestjs/common";
import * as ClientDto from "../dto/client_dto";
import { RequestDto_SwapGold } from "../dto/request.dto"; // DTO 임포트

@Injectable()
export class GameService {
  
    constructor( private readonly mysqlProvider: GameRepository ) {}

}
