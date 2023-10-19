import React from 'react';
import './SearchList.css';
import {D3Data} from '../../Models/D3Data';

const SearchList:React.FC<any> = ({d3Obj1, d3Obj2, colorMap}) => {
    const list1 = d3Obj1.filter((it: D3Data) => it.id !== 0);
    const list2 = d3Obj2.filter((it: D3Data) => it.id !== 0);

    if(d3Obj1.length>1 && d3Obj2.length>1) {
        const div: any =  document.querySelector<HTMLElement>('.SearchList');
        div.style.display = 'block'
    }

    return (
        <div className='SearchList'> 
            <div className='data1'>
                <table>
                    <thead>
                        <tr>        
                            <th className='number'>No.</th>
                            <th className='searchKeyword_th'>연관어 - {d3Obj1[0].label}</th>
                            <th className='frequency'>건수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list1.map((it: D3Data) => (
                        <tr key={it.id}>
                            <td className='number'>{it.id}</td>
                            <td className='searchKeyword'>
                                <div id='colorBox' style={{backgroundColor: colorMap.get(it.category)}}>ㅤ</div>
                                {it.label}
                            </td>
                            <td className='frequency'>{it.frequency}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <div className='data2'>
                <table>
                    <thead>
                        <tr>
                            <th className='number'>No.</th>
                            <th className='searchKeyword_th'>연관어 - {d3Obj2[0].label}</th>
                            <th className='frequency'>건수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list2.map((it: D3Data) => (
                        <tr key={it.id}>
                            <td className='number'>{it.id}</td>
                            <td className='searchKeyword'>
                                <div id='colorBox' style={{backgroundColor: colorMap.get(it.category)}}>ㅤ</div>
                                {it.label}
                            </td>
                            <td className='frequency'>{it.frequency}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>           
        </div>
    )
}

export default React.memo(SearchList);