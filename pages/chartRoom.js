import Link from 'next/link';
import Head from 'next/head'
import Layout from '../components/MyLayout';
import fetch from 'isomorphic-unfetch'
import React, { useState, useEffect, useRef } from 'react';
import ChartRoomNameCheck from '../components/chartRoomNameCheck';
import webSocket from 'socket.io-client';
import '../scss/chartRoom.scss';

const ip = '10.41.4.244' //後端伺服器的浮動ip位置 

const ChartRoom = (props) => {
    const [inputText, setInputText] = useState('')
    const [nowRoom,setNowRoom] = useState('世界頻')
    const [nickName, setNickName]= useState('')
    const [allMassage, setAllMassage] = useState('歡迎進入 真難聊 聊天室')
    const [showLightBox,setShowLightBox] = useState(true)
    const prevAllMassageRef = useRef('')
    const Ws = useRef(null)

    useEffect(() => {
        //從localStorage比對是否有登入過暱稱(niceName)
        const HasLocalName = JSON.parse(localStorage.getItem('chartRoom'))
        if(HasLocalName){
            setNickName(HasLocalName.name)
            setShowLightBox(false)
            //開啟連線至 server 端的 WS 的監聽窗口
            linkToWebSocket(HasLocalName.name)
        }
        //模擬 componentWillUnMount , return 後的 function 將會在組件卸載時被自動呼叫
        return disConnectWebSocket;
    }, [])

    //利用Ref紀錄上一次的 allMassage 狀態
    useEffect(()=>{
        prevAllMassageRef.current = allMassage
    },[allMassage])

    const linkToWebSocket = async (name) => {
        Ws.current = await webSocket(`http://${ip}:5000`); 
        if(Ws.current){
            //連線成功在 console 中打印訊息
            console.log('success connect!')
            //設定監聽
            initWebSocket()
            Ws.current.emit('addRoom', '世界頻', name)
        }
    }

    const initWebSocket = () => {
        //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
        Ws.current.on('getMessage', message => {
            getMassage(message)
        })

        Ws.current.on('getMessageAll', message => {
            getMassage(message)
        })

        Ws.current.on('getMessageLess', message => {
            getMassage(message)
        })

        Ws.current.on('addRoom', message => {
            getMassage(message)
        })

        Ws.current.on('roomTalk', message => {
            getMassage(message)
        })

        Ws.current.on('leaveRoom', message => {
            getMassage(message)
        })

        // Server 通知完後再傳送 disConnection 通知關閉連線
        Ws.current.on('disConnection', () => {
            console.log('斷開Ws連線');
            Ws.current.close()
        })
    }

    const getMassage = (messages) =>{
        const msg = `${prevAllMassageRef.current}\n${messages}`
        setAllMassage(msg)
    }

    //發送訊息
    const sendMessage = (typeOfWs) => {
        //判斷是否屬於任一房間內的發送訊息
        if(inputText && nowRoom === '世界頻'){
            //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
            const massages = `${nickName} :  ${inputText}`
            Ws.current.emit(typeOfWs, massages)
            setInputText('')
        }else if(inputText && nowRoom !== '世界頻'){
            const massages = `${nickName} :  ${inputText}`
            Ws.current.emit('roomTalk', massages)
            setInputText('')
        }
    }

    //選擇聊天室時觸發，如果有選擇那就將房間 id 送給 Server
    const changeRoom = (event) => {
        let room = event.target.value
        setNowRoom(room)
        Ws.current.emit('addRoom', room, nickName)
    }

    //input on change 時
    const inputOnChange = (event) =>{
        setInputText(event.currentTarget.value)
    }

    //當按下 Enter 時
    const enterSubmit = (e) => {
        if (e.keyCode === 13 && inputText) {
            sendMessage('getMessageAll')
        }
    }

    //暱稱欄位
    // const nickNameChange = (event) => {
    //     setNickName(event.currentTarget.value) 
    // }

    const disConnectWebSocket = () =>{
        //向 Server 送出申請中斷的訊息，讓它通知其他 Client
        Ws.current.emit('disConnection', nickName )
    }

    return (
        <div>
            <Head>
                <link href="https://fonts.googleapis.com/css?family=Baloo+Bhai" rel="stylesheet" />
                <title>測試集-聊天室</title>
            </Head>
            <Layout>
                <h2>ChartRoom</h2>
                <div>
                    <select onChange={changeRoom}>
                        <option value='世界頻'>世界頻</option>
                        <option value='遊戲討論區'>遊戲討論區</option>
                        <option value='閒聊區'>閒聊區</option>
                        <option value='幹焦區'>幹焦區</option>
                    </select>
                </div>
                <textarea className="textarea" readOnly={true} value={allMassage}/>
                <div className="outSideInput">
                    {/* <input className="nickName" type="text" onChange={nickNameChange} value={nickName} placeholder="請輸入暱稱"/> */}
                    <textarea className="textInput"  onChange={inputOnChange} onKeyDown={enterSubmit} value={inputText}/>
                    <input className='sendBtn' type="button" value="←" onClick={()=>sendMessage('getMessageAll')}/>
                    {/* <input type="button" value="斷開蓮線" onClick={disConnectWebSocket}/> */}
                    {/* <input className='sendBtn' type="button" value="發送訊息給自己" onClick={()=>sendMessage('getMessage')}/> */}
                    {/* <input className='sendBtn' type="button" value="發送訊息給除了自己以外的所有人" onClick={()=>sendMessage('getMessageLess')}/> */}
                </div>
                {showLightBox && <ChartRoomNameCheck setShowLightBox={setShowLightBox} setNickName={setNickName} linkToWebSocket={linkToWebSocket}/>}
            </Layout>
        </div>
    );
}

export default ChartRoom