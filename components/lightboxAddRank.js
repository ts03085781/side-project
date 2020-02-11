import React, { useState, useEffect, FunctionComponent } from 'react';
import Context from '../context/clickGameContext'
const ip = '10.41.4.244' //後端伺服器的浮動ip位置 

const LightboxAddRank = () => {
    const [keyName, setKeyName] = useState()
    const [comment, keyComment] = useState()

    const handleKeyName = (event) => {
        setKeyName(event.currentTarget.value)
    }
    const handleKeyComment = (event) => {
        keyComment(event.currentTarget.value)
    }

    const addToRank = (clickNumber, handleShowLightBox) =>{
        if(keyName && comment){
            const bodyData = {
                "name":keyName,
                "frequency":clickNumber,
                "comment":comment
            }
            
            fetch(`http://${ip}:8000/api/clickGame/post`,{
                body: JSON.stringify(bodyData), // must match 'Content-Type' header
                headers: {'content-type': 'application/json'},
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
            })
            .then((res)=>{
                return res.text()
            })
            .then((resDate)=>{
                setKeyName('')
                keyComment('')
                alert(resDate)
                handleShowLightBox()
            })
            .catch(()=>{
                console.log('add to rank API過程發生錯誤')
            })
        }else{
            alert('請輸入姓名及流言')
        }
    }

    const handleCancelBox = (handleShowLightBox) => {
        handleShowLightBox()
    }
    return (
        <Context.Consumer>
        {value => (
            <div className='blackBackGround'>
                <div className="inSideBox">
                    <div>
                        <span className="cancelBtn" onClick={()=>handleCancelBox(value.handleShowLightBox)}>X</span>
                    </div>
                    <div>大俠貴名</div>
                    <input type="text" onChange={(e)=>handleKeyName(e)}/>
                    <div>嗆聲留言</div> 
                    <input type="text" onChange={(e)=>handleKeyComment(e)}/>
                    <button onClick={()=>addToRank(value.clickNumber,value.handleShowLightBox)} className='addToRankBtn'>add To Rank</button>
                </div>
                <style jsx>{`
                    *{
                        box-sizing: border-box;
                        font-family: Baloo Bhai, Microsoft JhengHei;
                    }
                    .cancelBtn{
                        font-size:40px;
                        position: absolute;
                        top: -6px;
                        right: 12px;
                        color: rgb(238, 74, 74);

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
                    .addToRankBtn{
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
export default LightboxAddRank;