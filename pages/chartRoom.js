import Link from 'next/link';
import Head from 'next/head'
import Layout from '../components/MyLayout';
import fetch from 'isomorphic-unfetch'
import React, { useState, useEffect, useRef } from 'react';
import webSocket from 'socket.io-client';

const ip = '10.41.4.244' //後端伺服器的浮動ip位置 

const ChartRoom = (props) => {
    const [inputText, setInputText] = useState('')
    const [ws,setWs] = useState(null)
    const [nowRoom,setNowRoom] = useState('total')
    const [nickName, setNickName]= useState('')
    const [allMassage, setAllMassage] = useState('歡迎進入聊天室')
    const prevAllMassageRef = useRef('')

    useEffect(() => {
        //開啟連線至 server 端的 WS 的監聽窗口
        setWs(webSocket(`http://${ip}:5000`))
    }, [])

    useEffect(()=>{
        if(ws){
            //連線成功在 console 中打印訊息
            console.log('success connect!')
            //設定監聽
            initWebSocket()
        }
    },[ws])

    useEffect(()=>{
        prevAllMassageRef.current = allMassage
    },[allMassage])

    const initWebSocket = () => {
        //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
        ws.on('getMessage', message => {
            getMassage(message)
        })

        ws.on('getMessageAll', message => {
            getMassage(message)
        })

        ws.on('getMessageLess', message => {
            getMassage(message)
        })

        ws.on('addRoom', message => {
            getMassage(message)
        })

        ws.on('roomTalk', message => {
            getMassage(message)
        })

        ws.on('leaveRoom', message => {
            getMassage(message)
        })

        // Server 通知完後再傳送 disConnection 通知關閉連線
        ws.on('disConnection', () => {
            ws.close()
        })
    }

    const getMassage = (messages) =>{
            const msg = `${prevAllMassageRef.current}\n${messages}`
            setAllMassage(msg)
    }

    //發送訊息
    const sendMessage = (typeOfWs) => {
        //判斷是否屬於任一房間內的發送訊息
        if(nickName !== ''){
            if(inputText && nowRoom === 'total'){
                //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
                const massages = `${nickName} :  ${inputText}`
                ws.emit(typeOfWs, massages)
                setInputText('')
            }else if(inputText && nowRoom !== 'total'){
                const massages = `${nickName} :  ${inputText}`
                ws.emit('roomTalk', massages)
                setInputText('')
            }
        }else{
            alert('請輸入暱稱')
        }
    }

    //選擇聊天室時觸發，如果有選擇那就將房間 id 送給 Server
    const changeRoom = (event) => {
        let room = event.target.value
        setNowRoom(room)
        ws.emit('addRoom', room)

    }

    //input on change 時
    const inputOnChange = (event) =>{
        setInputText(event.currentTarget.value)
    }

    //當按下 Enter 時
    const enterSubmit = (e) => {
        if (e.keyCode === 13) {
            sendMessage('getMessageAll')
        }
    }

    //暱稱欄位
    const nickNameChange = (event) => {
        setNickName(event.currentTarget.value) 
    }

    const disConnectWebSocket = () =>{
        //向 Server 送出申請中斷的訊息，讓它通知其他 Client
        ws.emit('disConnection', nickName )
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
                        <option value='total'>全房間廣播</option>
                        <option value='room1'>房間一</option>
                        <option value='room2'>房間二</option>
                        <option value='room3'>房間三</option>
                    </select>
                </div>
                <textarea className="textarea" readOnly={true} value={allMassage}/>
                <div>
                    <input className="nickName" type="text" onChange={nickNameChange} value={nickName} placeholder="請輸入暱稱"/>
                    <input className="textInput" type="text" onChange={inputOnChange} onKeyDown={enterSubmit} value={inputText}/>
                    {/* <input className='sendBtn' type="button" value="發送訊息給自己" onClick={()=>sendMessage('getMessage')}/> */}
                    <input className='sendBtn' type="button" value="發送訊息" onClick={()=>sendMessage('getMessageAll')}/>
                    {/* <input className='sendBtn' type="button" value="發送訊息給除了自己以外的所有人" onClick={()=>sendMessage('getMessageLess')}/> */}
                    <input type="button" value="斷開蓮線" onClick={disConnectWebSocket}/>
                </div>
            </Layout>

            <style jsx>{`
                *{
                    font-family: Baloo Bhai, Microsoft JhengHei;
                    -webkit-user-select: none;
                    -moz-user-select:none;
                    -o-user-select:none;
                    -ms-user-select:none;
                }
                .textarea{
                    width: 95%;
                    height: 300px;
                    margin: 10px 0 0 0;
                }
                .nickName{
                    margin: 0 5px;
                }
                .textInput{
                    margin: 0 5px;
                }
                .sendBtn{
                    margin: 0 5px;
                }
            `}</style>
        </div>
    );
}

// ChartRoom.getInitialProps = async () => {
    // const res = await fetch(`http://${ip}:8000/api/clickGame/get/all`);
    // const jsonData = await res.json();
    // return { show: jsonData};
// }

export default ChartRoom