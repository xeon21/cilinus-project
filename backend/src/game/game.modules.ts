import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameRepository } from './game.repository';
import { MysqlProvider } from '../database/mysql.provider';

@Module({
  controllers: [GameController],
  providers: [GameService, GameRepository, MysqlProvider],
})
export class GameModule {}