import React, { useState, useEffect, FunctionComponent } from 'react';
import Context from '../context/context'
import '../context/context'

const LightBox = () => {

    return (
        <Context.Consumer>
        {value => (
            <div className='blackBackGround'>
                <div className="inSideBox">
                    {value.winner === 2 ?
                        <div className='player'>{`This game is draw`}</div>
                        :
                        <div className='player'>{`The winner is ${value.toSymbol(value.winner)}`}</div>
                    }
                    <button onClick={value.doReset} className='aganaBtn'>play agana</button>
                </div>
                <style jsx>{`
                    *{
                        box-sizing: border-box;
                        font-family: Baloo Bhai;
                    }
                    .blackBackGround{
                        position: fixed;
                        width: 100%;
                        height: 100%;
                        top: 0px;
                        left: 0px;
                        background-color: rgba(00,00,00,0.75);
                    }
                    .inSideBox{
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        background-color: #fff;
                        width: 360px;
                        height: 220px;
                        margin-top: -110px;
                        margin-left: -180px;
                        padding-top: 30px;
                        border-radius: 20px;
                        font-size: 24px;
                        text-align: center;
                        color: rgb(100, 100, 100);
                    }
                    .aganaBtn{
                        border: 1px solid rgb(255, 255, 255);
                        background-color: cornflowerblue;
                        color: #fff;
                        width: 200px;
                        height: 40px;
                        border-radius: 20px;
                        margin: 20px calc(50% - 100px);
                        font-size: 24px;
                        letter-spacing: 2px;
                    }
                    .player{
                        color: rgb(100, 100, 100);
                        text-align: center;
                        font-size: 36px;
                        font-weight: 100;
                        padding: 10px;
                    }
                `}</style>
            </div>
        )}
        </Context.Consumer>
    );
}
export default LightBox;