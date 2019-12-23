import Header from '../components/Header';
import Link from 'next/link';
import Head from 'next/head'
import Layout from '../components/MyLayout';

function About() {
    return (
        <div>
            <Head>
                <link href="https://fonts.googleapis.com/css?family=Baloo+Bhai" rel="stylesheet" />
                <title>測試集-關於頁面</title>
            </Head>
            <Layout>
                <p>About page</p>
            </Layout>
            <style jsx>{`
                *{
                    font-family: Baloo Bhai;
                }
            `}</style>
        </div>
    );
}

export default About