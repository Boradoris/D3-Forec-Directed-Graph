import {D3Data} from '../Models/D3Data';
/*
* Input : Api Data
* Logic : D3Data 객체 배열 저장, (객체 : id, label, frequency ...) ==> Array 저장
* Output : Array: D3Data
*/
export const createD3Obj = (data: any) => {

    const array: Array<D3Data> = [];
    const keyword: D3Data = {
        id : 0,
        label: data.label,
        frequency: 0,
        category: "",
        distance: 20,
        group: 0,
        nodeId : 0
    }
    array.push(keyword);

    const obj = createArray(data.childList);

    let objByFreq = (obj:any) => obj.sort(function (a:any, b:any) {
        return b.frequency - a.frequency;
    });
    objByFreq(obj);

    let count = 1;
    for(let i=0; i<obj.length; i++) {
        if(!obj[i].label.startsWith('#') && !obj[i].label.startsWith('@')) {
            let newObj: D3Data = {
                id : count,
                label : obj[i].label.replace(" ",""),
                frequency : obj[i].frequency,
                category : obj[i].categoryList[0],
                distance : 10,
                group : 0,
                nodeId : 0
            }
            count++;
            array.push(newObj);
        } 
    }
    return array;
}

// 검색 키워드 리스트 추출
export const createArray = (data: Array<D3Data>) => {
    let arr:Array<D3Data> = [];
    if(data) {
        data.map((it: D3Data) => arr.push(it));
    }

    return arr;
}

// 중복 키워드 검증
export const sameNodes = (nodes1: D3Data[], nodes2: D3Data[]) => {
    const map = new Map<string, D3Data>();
    const array: Array<any> = [];

    // 1번 키워드 map 저장 후, 2번 키워드로 순회하면서 같은 값이 있으면 arr 저장
    for(let i=1; i<nodes1.length; i++) {
        map.set(nodes1[i].label, nodes1[i]);
    }
    nodes2.map((d:D3Data) => d.id !== 0 && map.has(d.label) && array.push(map.get(d.label)));

    return array;
}

export const createNodes = (nodes1: D3Data[], nodes2: D3Data[]) => {
    const array: Array<D3Data> = [];

    nodes1.filter((e:D3Data) => e.label !== nodes2[0].label).map((d:D3Data) => array.push(d));
    isSameNodes(nodes1, nodes2).filter((e:D3Data) => e.label !== nodes1[0].label).map((d:D3Data) => array.push(d));
    array.map((d:D3Data, i:number) => d.nodeId = i);

    return array;
}

// 중복 키워드 제거
export const isSameNodes = (nodes1: D3Data[], nodes2: D3Data[]) => {
    const map = new Map<string, D3Data>();
    nodes1.map((d:D3Data) => map.set(d.label, d));

    return nodes2.filter((d:D3Data) => !map.has(d.label) || d.id === 0);
}

