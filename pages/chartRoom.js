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
    const connectWebSocket = () => {
        //開啟連線至 server 端的 WS 的監聽窗口
        setWs(webSocket(`http://${ip}:5000`))
    }
    const domInput = useRef()
    const textarea = useRef()

    useEffect(()=>{
        if(ws){
            //連線成功在 console 中打印訊息
            console.log('success connect!')
            //設定監聽
            initWebSocket()
        }
    },[ws])

    const initWebSocket = () => {
        //對 getMessage 設定監聽，如果 server 有透過 getMessage 傳送訊息，將會在此被捕捉
        ws.on('getMessage', message => {
            console.log(message)
            textarea.current.value = `${textarea.current.value}\n${message}` 
        })

        ws.on('getMessageAll', message => {
            console.log(message)
            textarea.current.value = `${textarea.current.value}\n${message}` 
        })

        ws.on('getMessageLess', message => {
            console.log(message)
            textarea.current.value = `${textarea.current.value}\n${message}` 
        })

        ws.on('addRoom', message => {
            console.log(message)
            textarea.current.value = `${textarea.current.value}\n${message}` 
        })
    }

    //發送訊息
    const sendMessage = (typeOfWs) => {
        if(ws){
            if(inputText){
                //以 emit 送訊息，並以 getMessage 為名稱送給 server 捕捉
                ws.emit(typeOfWs, inputText)
                setInputText('')
                domInput.current.value = ''
            }
        }else{
            alert('請連線聊天室')
        }
    }

    //選擇聊天室時觸發，如果有選擇那就將房間 id 送給 Server
    const changeRoom = (event) => {
        let room = event.target.value

        if(ws && room !== ''){
            ws.emit('addRoom', room)
        }else{
            alert('請連線聊天室')
        }
    }

    //input on change 時
    const inputOnChange = (event) =>{
        setInputText(event.currentTarget.value)
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
                    <input type="button" value="連線聊天室" onClick={connectWebSocket}/>
                    <select onChange={(e)=>changeRoom(e)}>
                        <option value=''>全房間廣播</option>
                        <option value='room1'>房間一</option>
                        <option value='room2'>房間二</option>
                        <option value='room3'>房間三</option>
                    </select>
                </div>
                <textarea ref={textarea} style={{width: "450px", height: "300px"}} />
                <div>
                    <input className="textInput" type="text" onChange={inputOnChange} ref={domInput}/>
                    <input className='sendBtn' type="button" value="發送訊息給自己" onClick={()=>sendMessage('getMessage')}/>
                    <input className='sendBtn' type="button" value="發送訊息給所有人" onClick={()=>sendMessage('getMessageAll')}/>
                    <input className='sendBtn' type="button" value="發送訊息給除了自己以外的所有人" onClick={()=>sendMessage('getMessageLess')}/>
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
                .textInput{
                    margin: 0 5px 0 0;
                }
                .sendBtn{
                    margin: 0 5px;
                }
                .clearBtn{
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