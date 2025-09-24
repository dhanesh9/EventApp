import Head from 'next/head';
import { FormEvent, useMemo, useState } from 'react';

type Event = {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  description: string;
};

type Leader = {
  id: number;
  name: string;
  community: string;
  points: number;
};

const events: Event[] = [
  {
    id: 1,
    title: 'Sunrise Sweat Club: Rooftop HIIT',
    date: 'Sat, Apr 20 · 7:00 AM',
    location: 'Midtown Athletic Rooftop · Austin, TX',
    category: 'Fitness',
    description: 'Start your weekend with a high-energy interval workout alongside Austin’s most dedicated training crew.',
  },
  {
    id: 2,
    title: 'Community Builders Summit',
    date: 'Sat, Apr 27 · 9:30 AM',
    location: 'The Social Lab · Austin, TX',
    category: 'Leadership',
    description: 'Interactive sessions with neighborhood organizers sharing their playbooks for thriving, inclusive communities.',
  },
  {
    id: 3,
    title: 'Creators & Coffee: Storytelling Live',
    date: 'Wed, May 1 · 6:00 PM',
    location: 'Eastside Creative Hub · Austin, TX',
    category: 'Creative',
    description: 'An intimate evening featuring live storytelling, collaborative prompts, and feedback from veteran creators.',
  },
  {
    id: 4,
    title: 'Trailblazers MTB Rally',
    date: 'Sun, May 5 · 8:00 AM',
    location: 'Barton Creek Greenbelt · Austin, TX',
    category: 'Outdoors',
    description: 'Join the fastest-growing mountain biking club for an intermediate-friendly ride followed by a community brunch.',
  },
  {
    id: 5,
    title: 'Women in Tech Mentorship Night',
    date: 'Thu, May 9 · 5:30 PM',
    location: 'Capital Factory · Austin, TX',
    category: 'Technology',
    description: 'Speed mentoring with top founders, engineers, and investors championing inclusive innovation.',
  },
];

const leaders: Leader[] = [
  { id: 1, name: 'Jordan Reyes', community: 'ATX Run Collective', points: 1285 },
  { id: 2, name: 'Priya Desai', community: 'Creators & Coffee', points: 1190 },
  { id: 3, name: 'Marcus Lee', community: 'Eastside Fit League', points: 1045 },
  { id: 4, name: 'Kendall Ortiz', community: 'Greenbelt Guardians', points: 980 },
  { id: 5, name: 'Sasha Iverson', community: 'Tech Builders Guild', points: 915 },
];

const HomeLanding = () => {
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');

  const filteredEvents = useMemo(() => {
    if (!activeQuery) {
      return events;
    }

    const normalizedQuery = activeQuery.toLowerCase();
    return events.filter((event) => {
      return [event.title, event.location, event.category, event.description].some((field) =>
        field.toLowerCase().includes(normalizedQuery),
      );
    });
  }, [activeQuery]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActiveQuery(searchInput.trim());
  };

  return (
    <div className="page">
      <Head>
        <title>Discover events | PIN-Kings EventApp</title>
        <meta name="description" content="Search curated events and view top community leaders on PIN-Kings." />
      </Head>

      <header className="hero">
        <div>
          <p className="eyebrow">Happening around you</p>
          <h1>Find your next event, from sunup workouts to after-hours mixers</h1>
          <p className="lead">
            Search by vibe, category, or crew to uncover curated gatherings hosted by leaders elevating their communities.
          </p>
        </div>

        <form className="search" onSubmit={handleSubmit} role="search" aria-label="Search events">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for events, hosts, or neighborhoods"
            aria-label="Search events"
          />
          <button type="submit">Search</button>
        </form>
      </header>

      <div className="layout">
        <section className="events" aria-live="polite">
          <div className="section-header">
            <h2>Events near Austin, TX</h2>
            {activeQuery ? <span className="filter">Filtered by “{activeQuery}”</span> : null}
          </div>
          <ul>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <li key={event.id}>
                  <article>
                    <h3>{event.title}</h3>
                    <p className="meta">
                      <span>{event.date}</span>
                      <span>•</span>
                      <span>{event.location}</span>
                    </p>
                    <p className="description">{event.description}</p>
                    <span className="tag">{event.category}</span>
                  </article>
                </li>
              ))
            ) : (
              <li className="empty-state">
                <p>No events match that search yet. Try another keyword or explore trending gatherings below.</p>
              </li>
            )}
          </ul>
        </section>

        <aside className="leaderboard">
          <h2>Community leaderboard</h2>
          <p className="leaderboard-subhead">Top hosts building momentum this month</p>
          <ol>
            {leaders.map((leader) => (
              <li key={leader.id}>
                <div className="rank">#{leader.id}</div>
                <div>
                  <p className="name">{leader.name}</p>
                  <p className="community">{leader.community}</p>
                </div>
                <div className="points">{leader.points.toLocaleString()} pts</div>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: radial-gradient(circle at top left, #1a103d, #050714 60%);
          color: #f5f7ff;
          padding: 3.5rem 1.5rem 4rem;
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .hero {
          display: grid;
          gap: 2rem;
          align-items: end;
        }

        .eyebrow {
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 0.18rem;
          margin: 0 0 0.5rem;
          color: rgba(245, 247, 255, 0.65);
        }

        h1 {
          margin: 0 0 1rem;
          font-size: clamp(2.25rem, 4vw, 3.5rem);
          line-height: 1.1;
        }

        .lead {
          margin: 0;
          font-size: 1.15rem;
          color: rgba(245, 247, 255, 0.75);
          max-width: 620px;
        }

        .search {
          display: flex;
          gap: 0.75rem;
          background: rgba(9, 16, 52, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          padding: 0.5rem 0.5rem 0.5rem 1.25rem;
          backdrop-filter: blur(12px);
        }

        .search input {
          flex: 1;
          background: transparent;
          border: none;
          color: inherit;
          font-size: 1rem;
          min-width: 0;
        }

        .search input:focus {
          outline: none;
        }

        .search button {
          border: none;
          border-radius: 999px;
          padding: 0.85rem 1.75rem;
          background: linear-gradient(120deg, #ff2bd0, #ff8a65);
          color: #fff;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .search button:hover {
          transform: translateY(-1px);
          box-shadow: 0 14px 35px rgba(255, 43, 208, 0.35);
        }

        .layout {
          display: grid;
          gap: 2.5rem;
        }

        @media (min-width: 960px) {
          .hero {
            grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
          }

          .layout {
            grid-template-columns: minmax(0, 2.4fr) minmax(0, 1fr);
            align-items: start;
          }
        }

        .events {
          background: rgba(12, 16, 49, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 32px 70px rgba(5, 7, 20, 0.35);
        }

        .section-header {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          margin-bottom: 1.5rem;
        }

        .section-header h2 {
          margin: 0;
          font-size: 1.75rem;
        }

        .filter {
          color: rgba(245, 247, 255, 0.65);
          font-size: 0.95rem;
        }

        .events ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1.5rem;
        }

        .events li article {
          background: rgba(21, 28, 71, 0.75);
          border-radius: 20px;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.05);
          display: grid;
          gap: 0.75rem;
        }

        .events li article h3 {
          margin: 0;
          font-size: 1.35rem;
        }

        .meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 0;
          color: rgba(245, 247, 255, 0.7);
        }

        .description {
          margin: 0;
          color: rgba(245, 247, 255, 0.8);
          line-height: 1.6;
        }

        .tag {
          align-self: start;
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          background: rgba(255, 43, 208, 0.2);
          color: #ff9be4;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .empty-state {
          background: rgba(21, 28, 71, 0.65);
          border-radius: 18px;
          padding: 2rem;
          text-align: center;
          color: rgba(245, 247, 255, 0.75);
        }

        .leaderboard {
          background: rgba(12, 16, 49, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 1.75rem;
          box-shadow: 0 28px 60px rgba(5, 7, 20, 0.3);
          display: grid;
          gap: 1.25rem;
        }

        .leaderboard h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .leaderboard-subhead {
          margin: 0;
          color: rgba(245, 247, 255, 0.7);
        }

        .leaderboard ol {
          list-style: none;
          margin: 0;
          padding: 0;
          display: grid;
          gap: 1rem;
        }

        .leaderboard li {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 0.75rem;
          align-items: center;
          background: rgba(21, 28, 71, 0.55);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 18px;
          padding: 0.85rem 1rem;
        }

        .rank {
          font-size: 1.1rem;
          font-weight: 700;
          color: #ff9be4;
        }

        .name {
          margin: 0;
          font-weight: 600;
        }

        .community {
          margin: 0;
          color: rgba(245, 247, 255, 0.65);
          font-size: 0.9rem;
        }

        .points {
          font-weight: 600;
          color: rgba(255, 255, 255, 0.85);
          font-feature-settings: 'tnum';
        }

        @media (max-width: 768px) {
          .search {
            flex-direction: column;
            border-radius: 20px;
            padding: 1rem;
          }

          .search button {
            width: 100%;
          }

          .leaderboard li {
            grid-template-columns: auto 1fr;
            grid-template-areas: 'rank name' 'rank points';
          }

          .rank {
            grid-area: rank;
          }

          .points {
            grid-area: points;
          }
        }
      `}</style>
    </div>
  );
};

export default HomeLanding;
