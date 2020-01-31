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

//取得本地當前ip位置的函式 
function getIPAdress() { 
    var interfaces = require('os').networkInterfaces();　　 
    for (var devName in interfaces) {　　　　 
        var iface = interfaces[devName];　　　　　　 
        for (var i = 0; i < iface.length; i++) { 
            var alias = iface[i]; 
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) { 
                return alias.address; 
            } 
        }　　 
    } 
} 

// const PostLink = ({ post }) => (
//     <li>
//         <Link href="/p/[id]" as={`/p/${post.id}`}>
//             <a>{post.title}</a>
//         </Link>
//         <style jsx>{`
//             li {
//                 list-style: none;
//                 margin: 5px 0;
//             }

//             a {
//                 text-decoration: none;
//                 color: green;
//                 font-family: Baloo Bhai;
//             }

//             a:hover {
//                 opacity: 0.3;
//             }
//         `}</style>
//     </li>
// );

const Blog = (props) => {
    return (
        <div>
            <Head>
                <link href="https://fonts.googleapis.com/css?family=Baloo+Bhai" rel="stylesheet" />
                <title>測試集-串接API</title>
            </Head>
            <Layout>
            <h3>串接API DB資料庫提取測試</h3>
            <p>{`測試人員 : ${props.show.name}`}</p>
            <p>{`測試人員體重 : ${props.show.point}kg`}</p>
            {/* <ul>
                {getPosts().map(post => (
                    <PostLink key={post.id} post={post} />
                ))}
            </ul> */}
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
    const ip = getIPAdress();
    const res = await fetch(`http://${ip}:8000/api/get/all`);
    const json = await res.json();
    const randoms = Math.floor(Math.random()*json.length)
    return { show: json[randoms] };
}

export default Blog