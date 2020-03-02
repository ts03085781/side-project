import Link from 'next/link';
import Head from 'next/head'
import Layout from '../components/MyLayout';
import fetch from 'isomorphic-unfetch'
import React, { useState, useEffect, useRef } from 'react';
import '../scss/rank.scss'

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
                        <p className="cardText">{`Rank ${index+1} : ${item.name} `}</p>
                        <p className="cardText">{`成績: ${item.frequency}`}</p>
                        <p className="cardText">{`留言: ${item.comment}`}</p>
                    </div>
                ))}
            </Layout>
        </div>
    );
}

Rank.getInitialProps = async () => {
    const res = await fetch(`http://${ip}:8000/api/clickGame/get/all`);
    const jsonData = await res.json();
    return { show: jsonData};
}

export default Rank