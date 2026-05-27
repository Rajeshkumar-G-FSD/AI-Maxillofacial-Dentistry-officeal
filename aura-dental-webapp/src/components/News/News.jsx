import React from 'react';
import './News.css';

const News = () => {
  const newsList = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=400',
      title: 'Foods For Healthy Teeth',
      date: '24 May 2026',
      excerpt: 'Discover which foods can help naturally whiten your teeth and improve your overall oral health.',
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1598256989800-fea5f61706bd?auto=format&fit=crop&q=80&w=400',
      title: 'The New Dental Technique',
      date: '20 May 2026',
      excerpt: 'Learn about the latest advancements in painless dentistry that are changing how we treat patients.',
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400',
      title: 'Prevent Cavities in Kids',
      date: '15 May 2026',
      excerpt: 'Essential tips for parents to ensure their children develop strong, healthy teeth without cavities.',
    }
  ];

  return (
    <section id="news" className="section news-section">
      <div className="container">
        <h2 className="section-title">LATEST <span>NEWS</span></h2>
        <p className="section-subtitle">Stay updated with our latest news, dental tips, and insights from our professional team.</p>
        
        <div className="news-grid">
          {newsList.map(news => (
            <div className="news-card" key={news.id}>
              <div className="news-image">
                <img src={news.image} alt={news.title} />
                <div className="news-date">{news.date}</div>
              </div>
              <div className="news-content">
                <h3>{news.title}</h3>
                <p>{news.excerpt}</p>
                <a href="#" className="read-more">READ MORE</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
