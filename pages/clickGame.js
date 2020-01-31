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
    const interval = null;
    
    // React.useEffect(() => {
    //     if(!gameState) return;
    //     // const interval = 
        
    //     // return ()  => {
    //     //     clearInterval(interval)
    //     // }
    // }, [time])

    // const MyCounter = () => {
    //     if (time===0) clearInterval(interval);
    //     interval = setInterval(() => {
    //         console.log('12');
    //         let count = time - 1 ;
    //         console.log(count);
    //         setTime(count)
    //     }, 1000);
    // };

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
            <h1>{`倒數時間${time}`}</h1>
            <div>
                <div className="countingBtn" onClick={addNumber}>
                    <span>{clickNumber}</span>
                </div>
            </div>
            {scoreBoard ? <> <p>{`本場點擊次數${clickNumber}`}</p> <button onClick={reset}>確認</button> </> : null}
            </Layout>
            <style jsx>{`
                *{
                    font-family: Baloo Bhai;
                }
                .countingBtn{
                    font-size: 50px;
                    display: inline-block;
                    text-align: center;
                    line-height: 100px;
                    color: #fff;
                    width: 100px;
                    height: 100px;
                    background-color: rgb(238, 74, 74);
                    border-radius: 50px;
                    cursor: pointer;

                }
            `}</style>
        </div>
    );
}
export default ClickGame