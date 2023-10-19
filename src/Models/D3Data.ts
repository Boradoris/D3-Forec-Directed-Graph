export type D3Data = {
    id : number, // 해당 input 값에 대한 id
    label : string, // 키워드명
    frequency : number, // 건수
    category : string, // 카테고리
    distance : number, // 거리
    nodeId : number, // 모든 input 값에 대한 id
    group : number,
    [prop:string]: any
}