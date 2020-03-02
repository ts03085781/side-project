import Header from '../components/Header';
import Link from 'next/link';
import Head from 'next/head'
import Layout from '../components/MyLayout';
import LightboxAddRank from '../components/lightboxAddRank';
import React, { useState, useEffect } from 'react';
import Context from '../context/clickGameContext';
import '../scss/clickGame.scss'

const ClickGame = () => {
    const [gameState, setGameState] = useState(false) //遊戲狀態
    const [clickNumber, setClickNumber] = useState(0); //點擊次數
    const [time, setTime] = useState(3); //倒數時間毫秒
    const [scoreBoard, steScoreBoard] = useState(false); //記分板狀態 
    const [hit, setHit] = useState(false) //按鈕滑鼠下壓
    const [showLightBox, setShowLightBox] = useState(false) //按鈕滑鼠下壓
    const defaultScd = 3;

    useEffect(()=>{
        if(gameState){
            MyCounter()
        }
    },[time])
    
    const MyCounter = () => {
        if(time>0){
            setTimeout(() => {
                setTime(time-1)
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

    const hitTheButton = () =>{
        hit ? setHit(false) : setHit(true)
    }

    const reset = () =>{
        setClickNumber(0)
        setTime(defaultScd)
        steScoreBoard(false)
    }

    const handleShowLightBox = () =>{
        setShowLightBox(!showLightBox)
    }

    const contextValue = {
        clickNumber,
        handleShowLightBox
    };

    return (
        <Context.Provider value={contextValue}>
        <div>
            <Head>
                <link href="https://fonts.googleapis.com/css?family=Baloo+Bhai" rel="stylesheet" />
                <title>測試集-點擊遊戲</title>
            </Head>
            <Layout>
            <h1>this page is clickGame</h1>
            <h1 className='Countdown_time'>{time===0? 'time out' : time}</h1>
            <div>
                <div className={`countingBtn ${hit && !scoreBoard ? 'hit' : ''}`} onClick={addNumber} onMouseDown={hitTheButton} onMouseUp={hitTheButton}>
                    <span>{clickNumber===0? 'start' : clickNumber}</span>
                </div>
            </div>
            {scoreBoard ? 
                <div>
                    <p className="clickTimes">{`you click ${clickNumber} times a round`}</p> 
                    <button className="rest_btn" onClick={reset}>reset</button>
                    <button className="rest_btn" onClick={handleShowLightBox}>add to rank</button>
                </div> 
            : 
                null
            }
            </Layout>
            { showLightBox? <LightboxAddRank/> : null }
        </div>
        </Context.Provider>
    );
}
export default ClickGame