import Header from '../components/Header';
import Link from 'next/link';
import Head from 'next/head'
import Layout from '../components/MyLayout';
import React, { useState, useEffect } from 'react';

function ClickGame() {
    const[gameState, setGameState] = useState(false) //遊戲狀態
    const [clickNumber, setClickNumber] = useState(0); //點擊次數
    const [time, setTime] = useState(3); //倒數時間毫秒
    const [scoreBoard, steScoreBoard] = useState(false); //記分板狀態 
    const defaultScd = 3;
    let scd = defaultScd
    
    const MyCounter = () => {
        if(scd>0){
            setTimeout(() => {
                setTime(scd-=1)
                MyCounter()
            }, 1000);
        }else{
            setGameState(false)
            steScoreBoard(true)
        }
    };


    const addNumber = () => {
        if(!gameState && !scoreBoard){
            setGameState(true)
            setClickNumber(clickNumber+1)
            MyCounter()
        }

        if(gameState && !scoreBoard){
            setClickNumber(clickNumber+1)
        }
    }

    const reset = () =>{
        setClickNumber(0)
        setTime(defaultScd)
        steScoreBoard(false)
    }

    return (
        <div>
            <Head>
                <link href="https://fonts.googleapis.com/css?family=Baloo+Bhai" rel="stylesheet" />
                <title>測試集-關於頁面</title>
            </Head>
            <Layout>
            <h1>this page is clickGame</h1>
            <h1 className='Countdown_time'>{time===0? 'time out' : time}</h1>
            <div>
                <button className="countingBtn" onClick={addNumber}>
                    <span>{clickNumber===0? 'start' : clickNumber}</span>
                </button>
            </div>
            {scoreBoard ? 
                <div>
                    <p className="clickTimes">{`you click ${clickNumber} times a round`}</p> 
                    <button className="rest_btn" onClick={reset}>reset</button> 
                </div> 
            : 
                null
            }
            </Layout>
            <style jsx>{`
                *{
                    font-family: Baloo Bhai;
                }
                .Countdown_time{
                    text-align: center;
                    font-size: 60px;
                    color: rgb(76, 175, 80);
                    margin:0;
                    line-height: 100px;
                }
                .clickTimes{
                    text-align: center;
                }
                .countingBtn{
                    margin: auto;
                    font-size: 32px;
                    display:block;
                    text-align: center;
                    line-height: 100px;
                    color: #fff;
                    border: none;
                    width: 100px;
                    height: 100px;
                    background-color: rgb(238, 74, 74);
                    border-radius: 50%;
                    cursor: pointer;
                }
                .rest_btn{
                    border: 1px solid rgb(255,255,255);
                    background-color: cornflowerblue;
                    color: #fff;
                    width: 150px;
                    height: 40px;
                    border-radius: 20px;
                    margin: 20px calc(50% - 75px);
                    font-size: 24px;
                }
            `}</style>
        </div>
    );
}
export default ClickGame