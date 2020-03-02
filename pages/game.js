import React, { useState, useEffect } from 'react';
import LightBox from '../components/lightbox';
import Context from '../context/context'
import Layout from '../components/MyLayout'
import Head from 'next/head'
import '../scss/game.scss'

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
            </Layout>
        </Context.Provider>
    );
};

export default App;