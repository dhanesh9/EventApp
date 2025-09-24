import Head from 'next/head';
import { useRouter } from 'next/router';

const HomePage = () => {
  const router = useRouter();

  const handleSearchClick = () => {
    void router.push('/home');
  };

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
        <div className="actions">
          <button type="button" className="primary" onClick={handleSearchClick}>
            Search events
          </button>
        </div>
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

        .hero {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          max-width: 720px;
        }

        .hero h1 {
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 700;
          margin: 0;
          background: linear-gradient(90deg, #ff2bd0, #00f5ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero p {
          font-size: 1.125rem;
          line-height: 1.8;
          color: #b9f3ff;
          margin: 0;
        }

        .actions {
          display: flex;
          justify-content: center;
        }

        button {
          cursor: pointer;
          border: none;
          border-radius: 999px;
          font-size: 1rem;
          font-weight: 600;
          padding: 0.85rem 1.75rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .primary {
          background: linear-gradient(120deg, #ff2bd0, #ff8a65);
          color: #fff;
          box-shadow: 0 12px 32px rgba(255, 43, 208, 0.35);
        }

        button:focus-visible {
          outline: 3px solid rgba(0, 245, 255, 0.6);
          outline-offset: 3px;
        }

        button:hover {
          transform: translateY(-2px);
        }

        .primary:hover {
          box-shadow: 0 16px 40px rgba(255, 43, 208, 0.4);
        }
      `}</style>
    </div>
  );
};

export default HomePage;
