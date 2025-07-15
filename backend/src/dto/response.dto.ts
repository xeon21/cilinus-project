// src/login/dto/guest-login-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto_GuestLogin {
    @ApiProperty({
        example: 1,
        description: '게스트 사용자의 고유 디비 일련 ID',
    })
    userId: number;

}

//유저정보 데이터
export class ResponseDto_UserData {
    @ApiProperty({
        example: 1,
        description: '쿼리 결과 : 1이면 성공, 0이면 실패',
    })
    result: number;
    
     @ApiProperty({
        example: 'kim',
        description: ' 사용자의 이름',
    })
    userName: string;

    @ApiProperty({
        example: 1,
        description: ' 사용자의 userLv',
    })
    userLv: number;
   
    @ApiProperty({
        example: 10,
        description: ' 사용자의 보유 골드',
    })
    userHaveGold: number;
   
    @ApiProperty({
        example: 12,
        description: '사용자가 보유한 나무의 갯수',
    })
    userSumofTree: number;
     
    // @ApiProperty({
    //     example: 0.258,
    //     description: '사용자의 나무가 흡수하고 있는 시간당 탄소량',
    // })
    // treeSumofCarbon: number;

     @ApiProperty({
        example: 0.487,
        description: '지난 로그인 부터 현재까지 사용자가 흡수한 총 탄소량',
    })
    userGetSumofCarbon: number;

    @ApiProperty({
        example: 0.487,
        description: '사용자가 현재 보유하고 있는 총 탄소량',
    })
    userHaveSumofCarbon: number;

     @ApiProperty({
        example: 4.487,
        description: '사용자가 현재까지 획득한 총 탄소량의 합',
    })
    userTotalCollectedCo2:number;
}



//내 나무 정보 데이터
export class ResponseDto_TreeData {
    @ApiProperty({
        example: 1,
        description: '쿼리 결과 : 1이면 성공, 0이면 실패',
    })
    result: number;

    @ApiProperty({
        example: 1000,
        description: '나무 인덱스 번호',
    })
    treeIndex: number;

     @ApiProperty({
        example: "0000123",
        description: '7단계로 표현되는 메인맵의 X좌표',
    })
    LocationMapX: string;

     @ApiProperty({
        example: "0000123",
        description: '7단계로 표현되는 메인맵의 X좌표',
    })
    LocationMapY: string;

    @ApiProperty({
        example: "1",
        description: '25개로 표현되는 최종 나무심기 맵의 배열좌표',
    })
    plantMapPos: number;
    
    @ApiProperty({
        example: "2023-12-12T12:00:00Z",
        description: '나무 심은 날짜',
    })
    treePlantDate: string;

     @ApiProperty({
        example: "2023-12-12T12:00:00Z",
        description: '나무 종료일자',
    })
    treeEndDate: string;
    
     @ApiProperty({
        example: "2023-12-12T12:00:00Z",
        description: '나무의 남은 성장 날짜',
    })
    treeRemainDate: string;

    @ApiProperty({
        example: 0.234,
        description: '나무의 현재 탄소 흡수량',
    })
    treeCo2: string;
    
}

//내 나무 정보 데이터
export class ResponseDto_TreeDataAll {
    @ApiProperty({
        example: 1,
        description: '쿼리 결과 : 1이면 성공, 0이면 실패',
    })
    result: number;
    
    // @ApiProperty({
    //     example: 1,
    //     description: '내가 보유한 나무의 시간당 탄소 흡수량 총합',
    // })
    // sumofCo2: number;

    @ApiProperty({
        type: [ResponseDto_TreeData],
        description: '나무 정보 배열열',
        example: [ 
            {
              
                treeIndex: 1000,
                treeName:"고사리",
                LocationMapX: "0000123",
                LocationMapY: "0000123",
                plantMapPos: 1,
                treePlantDate: "2023-12-12T12:00:00Z",
                treeEndDate: "2023-12-12T12:00:00Z",
                treeRemainDate: "2023-12-12T12:00:00Z",
                treeCo2: 0.24
                
            },
            {
                treeIndex: 1000,
                treeName:"고사리",
                LocationMapX: "0000123",
                LocationMapY: "0000123",
                plantMapPos: 2,
                treePlantDate: "2023-12-12T12:00:00Z",
                treeEndDate: "2023-12-12T12:00:00Z",
                treeRemainDate: "2023-12-12T12:00:00Z",
                treeCo2: 0.24
               
            }
        ]
    })
    treeDataList: ResponseDto_TreeData[];
}


//나무 합성 후 결과 데이터 
export class ResponseDto_CombineTree {
    @ApiProperty({
        example: 1,
        description: '쿼리 결과 : 1이면 성공, 0이면 실패',
    })
    result: number;

     @ApiProperty({
        example: 2000,
        description: '생성된 나무 인덱스 번호',
    })
    treeIndex: number;
   
}


//맵 인포
export class ResponseDto_MapData {
   
    @ApiProperty({
        example: "3000",
        description: '나무 일련번호',
    })
    treeIndex: number;

    @ApiProperty({
        example: "1",
        description: '나무 위치 배열 ',
    })
    plantMapPos: number;

     @ApiProperty({
        example: "doek hwan",
        description: '나무 심은 유저 이름 ',
    })
    ownerName: string;

     @ApiProperty({
        example: "0.445",
        description: '현재 나무의 탄소 흡수량',
    })
    carbon: number;
}



//아이템 인포
export class ResponseDto_ItemInfo {
   
    
    @ApiProperty({
        example: 1000,
        description: '아이템템 일련번호',
    })
     itemIndex: number;

    @ApiProperty({
        example: 99,
        description: '수량 ',
    })
    itemAmount: number;

     @ApiProperty({
        example: 1,
        description: '1:식물관련아이템 2:장비관련아이템3.재화관련아이템',
    })
    itemCategory: number;

    
}
//최종 맵 정보 
export class ResponseDto_FinalMapInfo {
     @ApiProperty({
        example: "1",
        description: '해당 맵 진입 가능 여부, 0:불가, 1:가능 ',
    })
    isActive: number;

     @ApiProperty({
        type: [ResponseDto_MapData],
        description: '식재된 나무 정보 리스트',
        example: [ 
            {
                "treeIndex": 1000,
                "plantMapPos": 15,
                "ownerName": "testname",
                "carbon": 0.167
            },
           {
                "treeIndex": 1000,
                "plantMapPos": 14,
                "ownerName": "erer",
                "carbon": 0.167
            }
        ]
    })
    MapData: ResponseDto_MapData[];
}


//내 아이템 정보 
export class ResponseDto_GetMyItem {
     @ApiProperty({
        example: "1",
        description: '질의 결과  ',
    })
    result: number;

     @ApiProperty({
        type: [ResponseDto_ItemInfo],
        description: '아이템 정보보',
        example: [ 
            {
                "itemIndex": 1000,
                "itemAmount": 99,
                "itemCategory": 1
              
            },
           {
                "itemIndex": 1001,
                "itemAmount": 99,
                "itemCategory": 1
            }
        ]
    })
    MapData: ResponseDto_ItemInfo[];
}



//내 양모장 정보 데이터
export class ResponseDto_NurseryData {
     @ApiProperty({
        example: 1000,
        description: '나무 인덱스',
    })
    nurseryTreeIndex: number;
    
     @ApiProperty({
        example: "고사리",
        description: '나무 이름',
    })
    nurseryTreeName: string;
    
    @ApiProperty({
        example: 4,
        description: '양묘장 배열',
    })
    nurseryMapPos: number;
    
     @ApiProperty({
        example: "2023-12-12T12:00:00Z",
        description: '식묘 시간',
    })
    nurseryPlantDate: string;
    
     @ApiProperty({
        example: "2023-12-12T12:00:00Z",
        description: '나무 사망시각(수확시간)',
    })
    nurseryEndDate: string;
    
     @ApiProperty({
        example: "2023-12-12T12:00:00Z",
        description: '나무의 남은 생명',
    })
    nurseryRemainDate: string;
    
     @ApiProperty({
        example: 1.567,
        description: '양묘장에서 얻을수 있는 총 시간당 탄소량',
    })
    nurseryTreeCo2: number;
}



//내 나무 정보 데이터
export class ResponseDto_GetMyNurseryData {
    @ApiProperty({
        example: 1,
        description: '쿼리 결과 : 1이면 성공, 0이면 실패',
    })
    result: number;
    
    @ApiProperty({
        type: [ResponseDto_NurseryData],
        description: '나무 정보 배열',
        example: [ 
            {
                nurseryTreeIndex: 1000,
                nurseryTreeName:"고사리",
                nurseryMapPos: 1,
                nurseryPlantDate: "2023-12-12T12:00:00Z",
                nurseryEndDate: "2023-12-12T12:00:00Z",
                nurseryRemainDate: "2023-12-12T12:00:00Z",
                nurseryTreeCo2: 0.24
                
            },
            {
                nurseryTreeIndex: 1000,
                nurseryTreeName:"고사리",
                nurseryMapPos: 1,
                nurseryPlantDate: "2023-12-12T12:00:00Z",
                nurseryEndDate: "2023-12-12T12:00:00Z",
                nurseryRemainDate: "2023-12-12T12:00:00Z",
                nurseryTreeCo2: 0.24
               
            }
        ]
    })
    treeDataList: ResponseDto_NurseryData[];
}



//골드 스왑 결과 데이터
export class ResponseDto_SwapGold {
    @ApiProperty({
        example: 1,
        description: '쿼리 결과 : 1이면 성공, 0이면 실패',
    })
    result: number;

     @ApiProperty({
        example: 100,
        description: '얻은 골드량량',
    })
    swapGold: number;
   
}



//내 양모장 정보 데이터
export class ResponseDto_TreeInfomation {
    @ApiProperty({
        example: 0,
        description: '나무 레벨',
    })
    itemLv: number;
	
	@ApiProperty({
        example: "물이끼",
        description: '나무 한글 이름',
    })
    name_KR: string;
    
	@ApiProperty({
        example: "Sphagnum moss",
        description: '나무 영문 이름',
    })
	name_EN: string;
    
	@ApiProperty({
        example: "Sphagnum moss",
        description: '나무 학명',
    })
	name_EC: string;
    
	@ApiProperty({
        example: 0.167,
        description: 'Life1 시기의 탄소 흡수량',
    })
	co2_1: number;
    
	@ApiProperty({
       example: 0.417,
        description: 'Life2 시기의 탄소 흡수량',
    })
	co2_2: number;
    
	@ApiProperty({
        example: 0,
        description: 'Life3 시기의 탄소 흡수량',
    })
	co2_3: number;
    
	@ApiProperty({
       example: 0,
        description: 'Life4 시기의 탄소 흡수량',
    })
	co2_4: number;
    
	@ApiProperty({
        example: 6,
        description: '첫번째 생명주기의 시간',
    })
	life_1: number;
    
	@ApiProperty({
        example: 6,
        description: '두번째 생명주기의 시간',
    })
	life_2: number;
    
	
	@ApiProperty({
        example: 0,
        description: '세번째 생명주기의 시간',
    })
	life_3: number;
    
	@ApiProperty({
        example: 0,
        description: '네번째 생명주기의 시간',
    })
	life_4: number;
 }
