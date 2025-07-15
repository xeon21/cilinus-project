import { Injectable } from '@nestjs/common';
import { MysqlProvider } from '../database/mysql.provider';
import * as UserDto from "../dto/user.dto";

@Injectable()
export class UsersRepository {
  constructor(private readonly db: MysqlProvider) {}

  async findUserByIdx(userIdx: number): Promise<{ UserIdx: number; UserPass: string } | null> {
    const query = 'SELECT UserIdx, UserPass FROM user_info WHERE UserIdx = ?';
    const [user] = await this.db.executeQuery<any[]>(query, [userIdx]);
    return user || null;
  }

  async updatePassword(userIdx: number, hashedPassword: string): Promise<void> {
    const query = 'UPDATE user_info SET UserPass = ? WHERE UserIdx = ?';
    await this.db.executeQuery(query, [hashedPassword, userIdx]);
  }
    //유저 정보 가져오기기
    async getUserInfo(uIndex: number): Promise<UserDto.GetUserInfo> {
        const query = 'CALL GetUserInfo(?)';
        const param = [uIndex];
        const rows = await this.db.executeQuery<any[]>(query,param);
        
        
        if (!rows || rows.length === 0) {
            console.log('Raw Result Not Exist');
  
            return{
                  result: 0,
                  userdata : {
                      userName: 'None',
                      userLv: 0,
                      userHaveGold: 0,
                      userSumofTree: 0,
                    //  treeSumofCarbon: 0,
                      userGetSumofCarbon: 0,
                      userHaveSumofCarbon: 0,
                      userHaveTotalSumofCarbon:0
                  }
            }
        }
 
        const firstRow = rows[0];
        const userdata = firstRow[0];
        console.log('GetUserInfo Raw Result:',firstRow);
        return {
              result: 1,
              userdata: {
                  userName:userdata.UserName,
                  userLv: userdata.User_Lv,
                  userHaveGold: userdata.User_HaveGold,
                  userSumofTree: userdata.userSumofTree,
               //   treeSumofCarbon: userdata.tree_Co2,
                  userGetSumofCarbon: userdata.getCo2,
                  userHaveSumofCarbon: userdata.User_HaveCo2,
                  userHaveTotalSumofCarbon:userdata.User_TotalCollected_Co2
              }
          };
    }
    
    //내 나무 정보 가져오기
    async getMyTreeInfo(uIndex: number): Promise<UserDto.GetMyTreeInfo> {
        const query = 'CALL GetMyTreeInfo(?)';
        const param = [uIndex];
      
        const rows = await this.db.executeQuery<any[]>(query,param);
       
        const firstRow = rows[0];
        console.log('getMyTreeInfo Raw Result:',firstRow);
        
        if (!rows || rows.length === 0) {
            console.log('Raw Result Not Exist');
      
            return{
                    result: 0,
                    treeDataList : []
                  }
         }
            
        return {
                    result: 1,
                    treeDataList: firstRow.map(row => ({
                        treeIndex: row.TreeIndex,
                        treeName: row.treeName,
                        treeX: row.X_Position,
                        treeY: row.Y_Position,
                        plantPos: row.Plant_Position,
                        treePlantDate : row.plantedTime,
                        treeEndDate: row.treeEndDate,
                        treeRemainDate: row.total_lifespan_hours,
                        treeCo2: row.current_hourly_co2_absorption
                  })),
              };
    }

     //내 양모장 정보 가져오기기
    async getMyNusuryInfo(uIndex: number): Promise<UserDto.GetMyNusuryInfo> {
        const query = 'CALL GetMyNusuryInfo(?)';
        const param = [uIndex];
     
        console.log(param);
        const rows = await this.db.executeQuery<any[]>(query,param);
        console.log('getMyNusuryInfo Raw Result:',rows);
        const firstRow = rows[0];
             
        if (!rows || rows.length === 0) {
            console.log('Raw Result Not Exist');
            const userdata = [];    
            return{
                    result: 0,
                    nusurydata : userdata
                 }
        }
           
        return {
                result: 1,
                nusurydata: firstRow.map(row => ({
                        nursuryTreeIndex: row.nursuryTreeIndex,
                        nursuryTreeName: row.nursuryTreeName,
                        nusuryMapPos: row.nusuryMapPos,
                        nursuryRemainDate: row.nursuryRemainDate,
                        nursuryPlantDate : row.nursuryPlantDate,
                        nursuryEndDate: row.nursuryEndDate,
                        nursuryTreeCo2:row.nursuryTreeCo2
                 })),
             };
    }
 
    //내 보유한 아이템 정보 가져오기기
    async getMyItem(uIndex: number): Promise<UserDto.GetMyItemInfo> {
        const query = 'CALL GetMyItemInfo(?)';
        const param = [uIndex];
     
        console.log(param);
        const rows = await this.db.executeQuery<any[]>(query,param);
        console.log('getMyItem Raw Result:',rows);
        const firstRow = rows[0];
             
        if (!rows || rows.length === 0) {
            console.log('Raw Result Not Exist');
            const userdata = [];    
            return{
                    result: 0,
                    itemdata : userdata
                 }
        }
           
        return {
                result: 1,
                itemdata: firstRow.map(row => ({
                     itemIndex: row.ItemIndex,
                     itemAmount: row.ItemAmount,
                     itemCategory: row.ItemCategory,
                    
                 })),
             };
    }
      
}
