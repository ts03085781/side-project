import React, { useState, useEffect } from 'react';
import LightBox from '../components/lightbox';
import Context from '../context/context'
import Layout from '../components/MyLayout'
import Head from 'next/head'

const App = () => {
    const [boxItem, setBoxItem] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [player, setPlayer] = useState(1);
    const [winner, setWinner] = useState(0);
    const winnerLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    const toSymbol = (n) => {
        switch (n) {
        case 0:
            return ``;
        case 1:
            return `o`;
        case -1:
        default:
            return `x`;
        };
    };

    const doMarked = (i) => {
        if (winner !== 0) {
            return
        };
        if (boxItem[i] === 0) {
            boxItem[i] = player
            setBoxItem(boxItem);
            setPlayer(-player);
        };
        gerWinner();
    };

    const gerWinner = () => {
        for (const lineArray of winnerLines) {
        const [q, w, e] = lineArray;
        if (boxItem[q] !== 0 && boxItem[q] === boxItem[w] && boxItem[w] === boxItem[e]) {
            setWinner(boxItem[q]);
        } else if (boxItem.indexOf(0) === -1) {
            setWinner(2);
        }
        };
    };

    const doReset = () => {
        setBoxItem([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        setPlayer(1);
        setWinner(0);
    };

    const contextValue = {
        doReset: doReset,
        toSymbol: toSymbol,
        winner: winner,
    };

    return (
        <Context.Provider value={contextValue}>
            <Head>
                <link href="https://fonts.googleapis.com/css?family=Baloo+Bhai" rel="stylesheet" />
                <title>測試集-圈圈叉叉作品</title>
            </Head>
            <Layout>
                <div className="App">
                    {boxItem.map((n, i) => (
                    <div className='box' onClick={() => doMarked(i)} style={{ color: n === 1 ? '#4caf50' : '#ff584b' }} key={i}>{toSymbol(n)}</div>
                    ))}
                </div>
                {winner === 0 && <div className='player'>{`turn Player ${toSymbol(player)}`}</div>}
                <button className='ResetButton' onClick={doReset}>Reset</button>
                {winner !== 0 && <LightBox/>}
                <style jsx>{`
                    *{
                        box-sizing: border-box;
                        font-family: Baloo Bhai;
                    }
                    .App{
                        width: 270px;
                        height: 270px;
                        margin: 40px auto;
                        display: flex;
                        flex-wrap: wrap;
                    }
                    .box{
                        width: 33.3333%;
                        height: 33.3333%;
                        border: 2px solid rgb(100, 100, 100);
                        text-align: center;
                        line-height:100px;
                        font-size: 100px;
                    }
                    .player{
                        color: rgb(100, 100, 100);
                        text-align: center;
                        font-size: 36px;
                        font-weight: 100;
                        padding: 10px;
                    }
                    .ResetButton{
                        border: 1px solid rgb(255, 255, 255);
                        background-color: cornflowerblue;
                        color: #fff;
                        width: 150px;
                        height: 40px;
                        border-radius: 20px;
                        margin: 20px calc(50% - 75px);
                        font-size: 24px;
                        letter-spacing: 2px;
                    }
                `}</style>
            </Layout>
        </Context.Provider>
    );
};

export default App;