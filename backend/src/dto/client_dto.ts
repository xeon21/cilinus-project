//나무 심기 
export interface PlantTree {
    treeIndex: number;
    LocationMapX: string;
    LocationMapY: string;
    plantMapPos: number;
   
}

//양묘장 심기기
export interface PlantNursury {
    treeIndex: number;
    plantMapPos: number;
   
}

//고정 확률 나무 합성
export interface CombineFomulaTree {
    src1: number;
    src2: number;
}


//랜덤 확률 나무 합성
export interface CombineRandomTree {
    src1: number;
    src2: number;
    src3: number;
}

//최종 맵 정보 
export interface FinalMapInfo {
    isActive: number;
    MapData: MapData[];
}

//맵 인포포
export interface MapData {
   
    plantMapPos: number;
    ownerName: string;
    treeIndex: number;
    carbon: number;
}


//최종 맵 정보요청   
export interface GetFinalMapInfo {
    LocationMapX: string;
    LocationMapY: string;
}


//내 양모장 정보 데이터
export interface ItemInfo {
    itemLv: number;
    name_KR: string;
    name_EN: string;
    name_EC: string;
    co2_1: number;
    co2_2: number;
    co2_3: number;
    co2_4: number;
    life_1: number;
    life_2: number;
    life_3: number;
    life_4: number;
 }
