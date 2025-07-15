import { IsNotEmpty, IsIn } from 'class-validator';

//유저정보 데이터
export interface UserData {
    userName: string;
    userLv: number;
    userHaveGold: number;
    userSumofTree: number;
   // treeSumofCarbon: number;
    userGetSumofCarbon: number;
    userHaveSumofCarbon: number;
    userHaveTotalSumofCarbon: number;
}

//내 나무 정보 데이터
export interface TreeData {
    treeIndex: number;
    treeName: string;
    treeX: string;
    treeY: string;
    plantPos: string;
    treePlantDate: string;
    treeEndDate:string;
    treeRemainDate: string;
    TreeCo2: number;
}

//내 양모장 정보 데이터
export interface NusuryData {
    nursuryTreeIndex: number;
    nursuryTreeName: string;
    nusuryMapPos: number;
    nursuryPlantDate: string;
    nursuryEndDate: string;
    nursuryRemainDate: string;
    nursuryTreeCo2: number;
}

//내 보유 아이템 정보 데이터
export interface ItemData {
    itemIndex: number;
    itemAmount: number;
    itemCategory: number;
}

//클라이언트로 보내는 유저정보 데이터 
export interface GetUserInfo {
    result: number;
    userdata: UserData;
}

//클라이언트로 보내는 내 나무 데이터 
export interface GetMyTreeInfo {
    result: number;
    treeDataList: TreeData[];
}

//클라이언트로 보내는 양모장 정보
export interface GetMyNusuryInfo {
    result: number;
    nusurydata: NusuryData[];
}

//클라이언트로 보내는 내 아이템 데이터 
export interface GetMyItemInfo {
    result: number;
    itemdata: ItemData[];
}

//클라이언트로 보내는 로그인 데이터 
export interface  LoginResult{
    result: number;
}

export class UserDto {
    userIdx: number;
    userName: string;
    userId: string;
    regTime: Date;
    roles: string[];
}

export class UpdateUserRoleDto {
    @IsNotEmpty()
    @IsIn(['admin', 'viewer'])
    role: string;
}