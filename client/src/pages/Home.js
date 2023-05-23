import React from 'react';
import '../styles/Home.css';

const Home = () => {

  return (
    <div className="main">
        <h1 className="title">BarKEEP</h1>
        <h2 className="subtitle">Access your favorite cocktail recipes here!</h2>
        <div className='home_photo'>
          <img className='home_photo_image' src='https://www.tastingtable.com/img/gallery/11-cocktails-to-try-if-you-like-drinking-gin/intro-1659025591.webp'></img>
        </div>
    </div>
  );
   
};

export default Home;