import React, { useState, useEffect, useContext } from 'react';
const ip = '10.41.4.244' //後端伺服器的浮動ip位置 

const ChartRoomNameCheck = (props) => {
    const [Name,setName] = useState('')
    const {setNickName, setShowLightBox} = props

    const handleNickName = (event) =>{
        setName(event.currentTarget.value)
    }

    const backToHistoryPage = () => {
        window.history.back()
    }

    const addToLocalStorage = () => {
        if(Name===''){
            alert('請輸入暱稱')
        }else{
            const data = JSON.stringify({name:Name})
            localStorage.setItem('chartRoom',data)
            //判斷是否關掉光相
            setShowLightBox(false)
            //改變父層nickName的狀態
            setNickName(Name)
        }
    }

    return (
        <div className='blackBackGround'>
            <div className="inSideBox">
                <div>
                    <span className="cancelBtn" onClick={backToHistoryPage}>X</span>
                </div>
                <div>大俠暱稱</div>
                <input type="text" onChange={handleNickName} value={Name} placeholder="請輸入暱稱"/>
                <button onClick={addToLocalStorage} className='addToRankBtn'>Enter Room</button>
            </div>
            <style jsx>{`
                *{
                    box-sizing: border-box;
                    font-family: Baloo Bhai, Microsoft JhengHei;
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
                    height: 260px;
                    margin-top: -110px;
                    margin-left: -180px;
                    padding-top: 18px;
                    border-radius: 20px;
                    font-size: 24px;
                    text-align: center;
                    color: rgb(100, 100, 100);
                }
                .cancelBtn{
                    font-size:40px;
                    position: absolute;
                    top: -6px;
                    right: 12px;
                    color: rgb(238, 74, 74);
                }
            `}</style>
        </div>
    );
}
export default ChartRoomNameCheck;