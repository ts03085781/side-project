
import Link from 'next/link';
import Head from 'next/head'
import Layout from '../components/MyLayout';
import fetch from 'isomorphic-unfetch'
import React, { useState, useEffect, useRef } from 'react';

const ip = '10.41.4.244' //後端伺服器的浮動ip位置 

const Rank = (props) => {
    return (
        <div>
            <Head>
                <link href="https://fonts.googleapis.com/css?family=Baloo+Bhai" rel="stylesheet" />
                <title>測試集-排行榜</title>
            </Head>
            <Layout>
                <h2>Rank page</h2>
                {props.show.map((item, index)=>(
                    <div className="rankBar" key={item.name}>
                        <span>{`rank ${index+1} : `}</span>
                        <span>{`${item.name}`}</span>
                        <span>{`  成績: ${item.frequency}`}</span>
                        <span>{`  留言: ${item.comment}`}</span>
                    </div>
                ))}
            </Layout>
            <style jsx>{`
                *{
                    font-family: Baloo Bhai, Microsoft JhengHei;
                    -webkit-user-select: none;
                    -moz-user-select:none;
                    -o-user-select:none;
                    -ms-user-select:none;
                }
                .rankBar{
                    background-color: #6495ed;
                    color: white;
                    padding: 5px 27px;
                    border-radius: 22px;
                    margin-bottom: 20px;
                }
            `}</style>
        </div>
    );
}

Rank.getInitialProps = async () => {
    const res = await fetch(`http://${ip}:8000/api/clickGame/get/all`);
    const jsonData = await res.json();
    return { show: jsonData};
}

export default Rank