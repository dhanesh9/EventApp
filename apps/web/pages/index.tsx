import Head from 'next/head';

const HomePage = () => {
  return (
    <div className="container">
      <Head>
        <title>PIN-Kings EventApp</title>
        <meta name="description" content="Discover elite organizers and events with PIN-Kings." />
      </Head>
      <main className="hero">
        <h1>PIN-Kings EventApp running</h1>
        <p>
          Build communities, discover elite organizers, and explore curated events with electric energy. Stay tuned as we craft
          the next-generation platform for leaders and sponsors.
        </p>
      </main>
      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #060b2b, #321049 50%, #4b0d3a);
          color: #f8fbff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 1.5rem;
          text-align: center;
        }

        .hero h1 {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 700;
          margin-bottom: 1.5rem;
          background: linear-gradient(90deg, #ff2bd0, #00f5ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero p {
          max-width: 640px;
          font-size: 1.125rem;
          line-height: 1.8;
          color: #b9f3ff;
        }
      `}</style>
    </div>
  );
};

export default HomePage;
