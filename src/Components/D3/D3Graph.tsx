import React from 'react';
import SearchList from '../SearchList/SearchList';
import './D3Graph.css';
import {D3Data} from '../../Models/D3Data';
import * as ObjArray from '../../FunctionFiles/ApiToD3Data';
import * as d3 from 'd3';


const D3Graph:React.FC<any> = ({data1, data2}) => {
    /*
    * input: API를 통해 전달받은 출력 변수 
    * Logic : [D3 데이터로 가공] 객체 배열 저장, (객체 : id, label, frequency) ==> Array 저장
    * Output : Array
    */
    const d3Obj1: D3Data[] = ObjArray.createD3Obj(data1);
    const d3Obj2: D3Data[] = ObjArray.createD3Obj(data2);

    const sameKeyword = ObjArray.sameNodes(d3Obj1, d3Obj2); // 중복 키워드 초기화

    const nodes = ObjArray.createNodes(d3Obj1, d3Obj2); // 중복 키워드 제거 후, 배열에 전체 저장
    const links = createLinks(nodes); //nodes의 source, target 지정 (좌표)
    
    function createLinks(nodes: D3Data[]) {
        const links: Array<object> = [];
        let nodesHalfLength = 0;
        
        // 첫 번째 노드 그룹 링크 지정
        for(let i=1; i<nodes.length; i++) {
                // nodesHalfLength === 두 번째 키워드의 nodeId 값
                if(nodes[i].id === 0) {
                    nodesHalfLength = i;
                    break;
                } 
                let obj = {
                    source : nodes[i].nodeId,
                    target : nodes[0].nodeId
                }
                links.push(obj);
        }

        // 두 번째 노드 그룹 링크 지정
        for(let j=nodesHalfLength+1; j<nodes.length; j++) {
            let obj = {
                source : nodes[j].nodeId,
                target : nodes[nodesHalfLength].nodeId
            }
            links.push(obj);
        }

        // 중복 노드 그룹
        // 각 키워드에 대한 링크 연결
        for(let k=0; k<sameKeyword.length; k++) {
            let obj = {
                source : sameKeyword[k].nodeId,
                target : nodes[nodesHalfLength].nodeId
            }
            links.push(obj);
        }
        
        return links;
    }

    //랜덤 색상 (카테고리별 분류)
    const colorMap = new Map<string, string>();
    // 카테고리별 색상 지정
    function setColor(d: string) {
        if(colorMap.has(d)) return colorMap.get(d);
        else {
            const rColor = Math.floor(Math.random() * 128 + 80);
            const gColor = Math.floor(Math.random() * 128 + 80);
            const bColor = Math.floor(Math.random() * 128 + 80);
            colorMap.set(d, `rgb(${rColor},${gColor},${bColor})`);
        }

        return colorMap.get(d);
    }

    //svg 변수 할당 및 zoom 함수 적용
    const svg = d3.select('#d3Graph');
    const zoom = d3.zoom().scaleExtent([0.8, 2]).on('zoom', (e:any) => svg.attr('transform', e.transform));
    d3.select('svg').call(zoom);
    
    const createForceGraph = (nodes: D3Data[], links: Array<{}>) => {
            svg.select(`#nodes_`).remove();
            
            const keyword = 'nodes_';
            let centerX: any = 0;
            let centerY = 330;

            // center 값 초기화
            const d3Size = document.querySelector<Element>(`.graph`)?.getBoundingClientRect();
            centerX = d3Size?.width
            centerX = centerX/2 - 30;

             // svg 초기 scale 지정
            const g = svg.append('g').attr('id', `${keyword}`).attr('transform', `translate(${centerX/3}, ${centerY/3}) scale(${0.7})`);
            const simulation = d3.forceSimulation(nodes)
                .force('link', d3.forceLink(links).id((d: D3Data) => d.nodeId))
                .force('charge', d3.forceManyBody().strength(-700)) // 모든 노드 간에 힘, 양이면 당기고 음수면 반발
                .force("x", d3.forceX(function(d: D3Data){
                    if(d.group === 0){
                        return sameKeyword.length>5 ? centerX/3 : centerX-120;
                    } else if (d.group === 1){
                        return sameKeyword.length>5 ? 3*centerX : centerX+50;
                    } else {
                        return centerX;
                    }
                }))
                .force("y", d3.forceY(function(d: D3Data){
                    if(d.group === 0){
                        return sameKeyword.length>5 ? centerY/3 : centerY-120;
                    } else if (d.group === 1){
                        return sameKeyword.length>5 ? 3*centerY : centerY-50;
                    } else {
                        return centerY;
                    }
                }))
                .force('center', d3.forceCenter(centerX, centerY)) // 중력의 중심점
                .force('collide', d3.forceCollide().radius(function(d: D3Data) {
                    return d.id === 0 ? d.distance * 5 : d.distance * 3.4;
                })); // 노드의 겹침 정도

            const link = g.append('g')
                .attr('stroke', 'black')
                .attr('stroke-opacity', '0.3') // 라인의 투명도, 선이 겹치는 경우가 많아 보통 투명하게 설정
                .selectAll('line')
                .data(links)
                .join('line')
                .attr('stroke-width', 1); // 거리에 비례하여 두깨 설정

            const node = g.append('g')
                .selectAll('g')
                .data(nodes)
                .enter()
                .append('g')
                .attr('id', function(d: D3Data) {return `${keyword}${d.nodeId}`})
                .each(function (d: D3Data) {
                    const thisNode = d3.select(`#${keyword}${d.nodeId}`);

                    thisNode
                        .append('rect') 
                        .attr('height', 30)
                        .attr('rx', 10)
                        .attr('fill', setColor(d.category))
                        .attr('class', (d: D3Data) => {
                            return d.id === 0 ? 'd3KeywordNode' : 'd3Node' 
                        });

                    thisNode
                        .append('text')
                        .text(d.label)
                        .style('text-anchor', 'middle')
                        .attr('dy', () => d.id === 0 ? 25 : 21)
                        .attr('class', (d: D3Data) => d.id === 0 ? 'd3Keyword' : 'd3Text');
                    
                    // 글자 영역에 따라 노드 크기 동적 할당
                    let textWidth = thisNode.select('text').node().getBBox().width + 20;
                    if(d.id === 0) {
                        textWidth = textWidth < 100 ? 100 : textWidth;
                    } else textWidth = textWidth < 60 ? 60 : textWidth;

                    thisNode.select('rect')
                        .attr('width', textWidth)
                        .attr('x', -textWidth/2);

                    thisNode.select('text')
                        .attr('dx', 0)
                    
                    // 마우스 hover
                    thisNode
                    .on('mouseover', mouseOver)
                    .on('mouseout', mouseOut);

                }).call(
                    d3.drag() //리스너를 통해 드래그 동작 반환
                    .on("start", dragstarted) //마우스 포인터 활성화 이후
                    .on("drag", dragged) //활성 포인트 이동
                    .on("end", dragended) //활성 포인트 비활성화 이후
                );

                simulation.on('tick', function () {
                    link.attr('id', (d:D3Data) => d.source)
                        .attr("x1", function(d: D3Data) {return d.source.x})
                        .attr("y1", function(d: D3Data) {return d.source.y})
                        .attr("x2", function(d: D3Data) {return d.target.x})
                        .attr("y2", function(d: D3Data) {return d.target.y});

                    node.attr("transform", function(d: D3Data) {
                        return `translate(${d.x},${d.y-15})`;
                    });
                });

                function dragstarted(event:any, d:D3Data) {
                    if (!event.active) simulation.alphaTarget(0.3).restart();
                    d.fy = d.y;
                    d.fx = d.x;
                }
            
                function dragged(event:any, d:D3Data) {
                    d.fx = event.x;
                    d.fy = event.y;
                }
            
                function dragended(event:any, d:D3Data) {
                    if (!event.active) simulation.alphaTarget(0);
                    d.fx = null;
                    d.fy = null;
                }

                function mouseOver(event:any, d:D3Data) {
                    d3.select(`#${keyword}${d.nodeId}`).select('rect')
                    .attr('opacity', '.7')
                    .attr('cursor', 'pointer');

                    d3.select(`#${keyword}${d.nodeId}`).select('text')
                    .attr('color', 'black')
                    .attr('cursor', 'pointer');
                }

                function mouseOut(event:any, d:D3Data) {
                    d3.select(`#${keyword}${d.nodeId}`).select('rect')
                    .attr('opacity', '1');

                    d3.select(`#${keyword}${d.nodeId}`).select('text')
                    .attr('color', 'white');
                }
            return svg.node();
        }

        createForceGraph(nodes, links);

    return (
        <div className='d3'>
            <div className='graph'>
                <svg><g id='d3Graph'></g></svg>
            </div>
            <div className='list'>
                {<SearchList d3Obj1 = {d3Obj1} d3Obj2 = {d3Obj2} colorMap = {colorMap}/>}
            </div>
        </div>
    )
}

/* 부모 컴포넌트의 Form 요소가 onChange 될 때, 리렌더링되는 것을 방지
*  submit 될 때만 렌더링
*/
export default React.memo(D3Graph);