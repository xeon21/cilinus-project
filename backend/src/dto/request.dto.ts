import { ApiProperty } from '@nestjs/swagger';

//나무심기할때 유저가 보내는 데이터
export class RequestDto_PlantTree {
    @ApiProperty({
        example: 4019,
        description: ' 나무 Index Ex:이리아르테',
    })
    treeIndex: number;
    
    @ApiProperty({
        example: "1234123",
        description: ' 7단계로 표현되는 메인맵의 X좌표',
    })
    LocationMapX: string;
    
    @ApiProperty({
        example: "1265432",
        description: ' 7단계로 표현되는 메인맵의 Y좌표',
    })
    LocationMapY: string;
    
    @ApiProperty({
        example: "0",
        description: ' 25개로 표현되는 최종 나무심기 맵의 배열열좌표',
    })
    plantMapPos: number;
    
    
}


//고정 확률 나무 합성
export class RequestDto_CombineFomulaTree {
    @ApiProperty({
        example: 1000,
        description: '합성할 재료의 인덱스 1',
    })
    src1: number;

     @ApiProperty({
        example: 1001,
        description: '합성할 재료의 인덱스 2',
    })
    src2: number;
}


//랜덤 확률 나무 합성
export class RequestDto_CombineRandomTree {
    @ApiProperty({
        example: 1000,
        description: '합성할 재료의 인덱스 1',
    })
    src1: number;

     @ApiProperty({
        example: 1000,
        description: '합성할 재료의 인덱스 2',
    })
    src2: number;

    @ApiProperty({
        example: 1000,
        description: '합성할 재료의 인덱스 3',
    })
    src3: number;
}


//최종 맵 요청 정보보
export class RequestDto_FinalMap {
    @ApiProperty({
        example: "1234123",
        description: ' 7단계로 표현되는 메인맵의 X좌표',
    })
    LocationMapX: string;

     @ApiProperty({
        example: "1234123",
        description: ' 7단계로 표현되는 메인맵의 Y좌표',
    })
    LocationMapY: string;

   
}



//양모장에 심을때 유저가 보내는 데이터
export class RequestDto_PlantNursury {
    @ApiProperty({
        example: 1000,
        description: ' 나무 Index Ex:고사리리',
    })
    treeIndex: number;
    
      
    @ApiProperty({
        example: "0",
        description: ' 25개로 표현되는 최종 양모장 맵의 배열좌표',
    })
    plantMapPos: number;
    
    
}




//양모장에 심을때 유저가 보내는 데이터
export class RequestDto_SwapGold {
    @ApiProperty({
        example: 1,
        description: '교환을 원하는 탄소량, 최소단위 1',
    })
    Co2forSwap: number;
 
}
