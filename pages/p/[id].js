import { useRouter } from 'next/router';
import Markdown from 'react-markdown';
import Layout from '../../components/MyLayout';
import Head from 'next/head';

export default () => {
    const router = useRouter();
    return (
        <div>
            <Head>
                <link href="https://fonts.googleapis.com/css?family=Baloo+Bhai" rel="stylesheet" />
                <title>測試集-串接API</title>
            </Head>
            <Layout>
            <h1>{router.query.id}</h1>
            <div className="markdown">
                <Markdown
                    source={`
This is our blog post.
Yes. We can have a [link](/link).
And we can have a title as well.

## This is a title

And here's the content.
                    `}
                />
            </div>
            <style jsx global>{`
                *{
                    font-family: Baloo Bhai;
                }

                .markdown {
                    font-family: Baloo Bhai;
                }

                .markdown a {
                    text-decoration: none;
                    color: blue;
                }

                .markdown a:hover {
                    opacity: 0.6;
                }

                .markdown h3 {
                    margin: 0;
                    padding: 0;
                    text-transform: uppercase;
                }
            `}</style>
            </Layout>
        </div>
    );
};