import Layout from '../components/MyLayout';
import Link from 'next/link';
import fetch from 'isomorphic-unfetch'
import Head from 'next/head'

function getPosts() {
    return [
        { id: 'hello-nextjs', title: 'Hello Next.js' },
        { id: 'learn-nextjs', title: 'Learn Next.js is awesome' },
        { id: 'deploy-nextjs', title: 'Deploy apps with ZEIT' }
    ];
}

const PostLink = ({ post }) => (
    <li>
        <Link href="/p/[id]" as={`/p/${post.id}`}>
            <a>{post.title}</a>
        </Link>
        <style jsx>{`
            li {
                list-style: none;
                margin: 5px 0;
            }

            a {
                text-decoration: none;
                color: green;
                font-family: Baloo Bhai;
            }

            a:hover {
                opacity: 0.3;
            }
        `}</style>
    </li>
);

const alerts = () => {
    alert('安安請輸入文字')
}

const Blog = (props) => {
    return (
        <div>
            <Head>
                <link href="https://fonts.googleapis.com/css?family=Baloo+Bhai" rel="stylesheet" />
                <title>測試集-串接API</title>
            </Head>
            <Layout>
            <h1>My Blog</h1>
                <p>{`the DB point is : ${props.show[0].point}`}</p>
                <p>{`the DB name is : ${props.show[0].name}`}</p>
                <p>{`the DB _id is : ${props.show[0]._id}`}</p>
                <p>{`the DB __v is : ${props.show[0].__v}`}</p>
                <button onClick={alerts} >click me</button>
            <ul>
                {getPosts().map(post => (
                    <PostLink key={post.id} post={post} />
                ))}
            </ul>
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
    const res = await fetch('http://localhost:8000/api/get/riden');
    const json = await res.json();
    return { show: json };
}

export default Blog