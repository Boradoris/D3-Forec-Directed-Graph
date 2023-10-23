import React, {useState} from 'react';
import './Search.css';
import D3Graph from '../D3/D3Graph';
import * as DateFormat from '../../FunctionFiles/DateFormat';
import {SearchForm} from '../../Models/SearchForm';

const Search:React.FC = () => {

    //Form State
    const [form, setForm] = useState<SearchForm>({
        input1 : "",
        input2 : "",
        startDate : DateFormat.getFormatDate(), //DateFormat.tsx => 외부 함수 호출
        endDate : new Date().toISOString().substring(0, 10),
        source : "twitter"
    });
    const {input1, input2, startDate, endDate, source} = form;
    /*
    *
        !=== Form Handler ===!
    *
    */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); //창 새로고침 방지
        console.log("데이터 호출");
        console.log({form});

        if(!!input1 && !!input2) {
            checkSubmit();
        } else alert("값을 입력해주세요.");
    }   

    //Promise 통해 동기 처리
    function checkSubmit() {
        //병렬 처리
        Promise.all([getInputJsonData(input1), getInputJsonData(input2)])
            .then((data) => {
                setInput1Data(data[0]);
                setInput2Data(data[1]);
                console.log(data[0])
                console.log(data[1])
            });
        // getInputJsonData(input1, setInput1Data)
        //     .then((data1) => { 
        //         getInputJsonData(input2, setInput2Data)
        //             .then((data2) => {
        //                 setInput1Data(data1);
        //                 setInput2Data(data2);
        //              });
        //      });
        }
        

    /*
    *
        !=== API 관련 로직 ===!
    *
    */
    const apiUrl = (input: String) => {
        if(input.indexOf("||") !== -1) {
            input = input.slice(0, input.indexOf("||")) + "%7C%7C" + input.slice(input.indexOf("||")+2, input.length);
        }

        const url = (
        `https://tm2api.some.co.kr/TrendMap/JSON/ServiceHandler`+
        `?lang=ko&source=${source}`+
        `&startDate=${DateFormat.changeDateForApi(startDate)}`+
        `&endDate=${DateFormat.changeDateForApi(endDate)}`+
        `&keyword=${input}`+
        `&topN=50&outputOption=score&categorySetName=SM&command=GetKeywordAssociation`
        );

        return url;
    }
    //API 호출 후, 받을 데이터 state
    const [input1Data, setInput1Data] = useState({});
    const [input2Data, setInput2Data] = useState({});

    //API 호출, 데이터 setState - 동기 처리
    function getInputJsonData (input:string) {
        console.log(`${input} / api 호출`);
        return fetch(apiUrl(input))
            .then((response) => response.json())
            .then((data) => data);
    }

    return (
        <div className='search'>
            <form className='form' onSubmit={handleSubmit}>
                <div className='input'>
                    <input type='text' name='input1' value={input1} onChange={handleChange} placeholder='첫 번째 값'/>
                    <input type='text' name='input2' value={input2} onChange={handleChange} placeholder='두 번째 값'/>
                </div>
                <div className='date'>
                    <input type="date" name='startDate' 
                        defaultValue={startDate} 
                        onChange={handleChange} 
                        max={new Date().toISOString().slice(0, 10)}>
                    </input>               
                    <input type="date" name='endDate' 
                        defaultValue={endDate} 
                        onChange={handleChange} 
                        min={startDate}
                        max={new Date().toISOString().slice(0, 10)}>
                    </input>
                </div>
                <div className='radio'>
                    <input type='radio' name='source' value={"twitter"} onChange={handleChange} defaultChecked/> 트위터
                    <input type='radio' name='source' value={"blog"} onChange={handleChange}/> 블로그
                    <input type='radio' name='source' value={"community"} onChange={handleChange}/> 커뮤니티
                    <input type='radio' name='source' value={"insta"} onChange={handleChange}/> 인스타그램
                    <input type='radio' name='source' value={"news"} onChange={handleChange}/> 뉴스
                </div>
                <button className='submit' type='submit'>확인</button>
            </form>
    
            <div>
                {<D3Graph data1 = {input1Data} data2 = {input2Data}/>}
            </div>
        </div>
    );
}

export default React.memo(Search);