import Layout from '../components/MyLayout';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch'
import Head from 'next/head'
import React, { useState, useEffect, useRef } from 'react';

const ip = '10.41.4.244' //後端伺服器的浮動ip位置 

const Blog = (props) => {
    const [name, setName] = useState()
    const [weight, setWeight] = useState()
    const [deleteName, setDeleteName] = useState()
    const [updateName, setUpdateName] = useState()
    const [updateWeight, setUpdateWeight] = useState()
    const domName = useRef()
    const domWeight = useRef()
    const domDeleteName = useRef()
    const domUpdateName = useRef()
    const domUpdateWeight = useRef()

    const handleName = (event) =>{
        setName(event.currentTarget.value)
    }

    const handleWeight = (event) =>{
        if(/^\d+$/.test(event.currentTarget.value)){
            setWeight(event.currentTarget.value)
        }else{
            alert(`請輸入正確阿拉伯數字`)
        }
    }

    const handleAddNewData = () => {
        if(name && weight){
            const bodyData = {
                "name":name,
                "point":weight,
            }

            fetch(`http://${ip}:8000/api/post`, {
                body: JSON.stringify(bodyData), // must match 'Content-Type' header
                headers: {'content-type': 'application/json'},
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
            })
            .then((resDate)=>{
                setName('')
                setWeight('')
                domName.current.value='';
                domWeight.current.value='';
                alert(`已成功添加${name},${weight}公斤`)
                console.log(resDate);
            })
            .catch(()=>{
                console.log('API過程發生錯誤')
            })
        }
    }

    const handleDeleteName = (event) =>{
        setDeleteName(event.currentTarget.value)
    }

    const handleDeleteData = () => {
        const encodeName = encodeURI(deleteName)

        fetch(`http://${ip}:8000/api/delete/${encodeName}`,{
            method: 'DELETE',
        })
        .then((resDate)=>{
            setDeleteName('')
            domDeleteName.current.value='';
            alert(resDate)
            console.log(resDate);
        })
        .catch(()=>{
            console.log('API過程發生錯誤')
        })
    }

    const handleUpdateName = (event) =>{
        setUpdateName(event.currentTarget.value)
    }

    const handleUpdateWeight = (event) => {
        setUpdateWeight(event.currentTarget.value)
    }

    const handleUpdateData = () =>{
        if(updateName && updateWeight){
            console.log('ininninin');
            const bodyData = {
                "name":updateName,
                "point":updateWeight,
            }

            fetch(`http://${ip}:8000/api/update`, {
                body: JSON.stringify(bodyData), // must match 'Content-Type' header
                headers: {'content-type': 'application/json'},
                method: 'PUT', // *GET, POST, PUT, DELETE, etc.
            })
            .then((resDate)=>{
                setUpdateName('')
                setUpdateWeight('')
                domUpdateName.current.value='';
                domUpdateWeight.current.value='';
                alert(`已成功修改${updateName},${updateWeight}公斤`)
            })
            .catch(()=>{
                console.log('API過程發生錯誤')
            })
        }
    }

    return (
        <div>
            <Head>
                <link href="https://fonts.googleapis.com/css?family=Baloo+Bhai" rel="stylesheet"/>
                <title>測試集-串接API</title>
            </Head>
            <Layout>
            <h3>串接API DB資料庫提取測試</h3>
            <p>{`隨機測試人員 : ${props.show.name}`}</p>
            <p>{`隨機測試人員體重 : ${props.show.point}kg`}</p>
            <div>
                <span>新增名單</span>
                <input placeholder="新增人名" type="text" onChange={(e)=>{handleName(e)}} ref={domName}/>
                <input placeholder="新增體重" type="text" onChange={(e)=>{handleWeight(e)}} ref={domWeight}/>
                <button onClick={handleAddNewData}>確認速出</button>
            </div>
            <div>
                <span>刪除名單</span>
                <input placeholder="刪除人名" type="text" onChange={(e)=>{handleDeleteName(e)}} ref={domDeleteName}/>
                <button onClick={handleDeleteData}>確認速出</button>
            </div>
            <div>
                <span>修改名單</span>
                <input placeholder="修改人名" type="text" onChange={(e)=>{handleUpdateName(e)}} ref={domUpdateName}/>
                <input placeholder="修改體重" type="text" onChange={(e)=>{handleUpdateWeight(e)}} ref={domUpdateWeight}/>
                <button onClick={handleUpdateData}>確認修改</button>
            </div>
            <style jsx>{`
                *{
                    font-family: Baloo Bhai;
                }
            `}</style>
            </Layout>
        </div>
    );
}

Blog.getInitialProps = async () => {
    const res = await fetch(`http://${ip}:8000/api/get/all`);
    const json = await res.json();
    const randoms = Math.floor(Math.random()*json.length)
    return { show: json[randoms] };
}

export default Blog