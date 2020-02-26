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
    const textarea = useRef()

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
    }

    const getMassage = (messages) =>{
        console.log(textarea.current.value);
        if(textarea.current.value){
            console.log(1);
            textarea.current.value = `${textarea.current.value}\n${messages}`
        }else{
            console.log(2);
            textarea.current.value = `${messages}`
        }
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
        textarea.current.value =''
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
                <textarea ref={textarea} style={{width: "450px", height: "300px"}} readOnly={true}/>
                <div>
                    <input className="nickName" type="text" onChange={nickNameChange} value={nickName} placeholder="請輸入暱稱"/>
                    <input className="textInput" type="text" onChange={inputOnChange} onKeyDown={enterSubmit} value={inputText}/>
                    {/* <input className='sendBtn' type="button" value="發送訊息給自己" onClick={()=>sendMessage('getMessage')}/> */}
                    <input className='sendBtn' type="button" value="發送訊息" onClick={()=>sendMessage('getMessageAll')}/>
                    {/* <input className='sendBtn' type="button" value="發送訊息給除了自己以外的所有人" onClick={()=>sendMessage('getMessageLess')}/> */}
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
                .nickName{
                    margin: 0 5px 0 0;
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