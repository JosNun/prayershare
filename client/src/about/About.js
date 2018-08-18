import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => (
  <div className="AboutPage MainView">
    <h1>About</h1>
    <p>
      Prayer Share is an anonymous prayer request sharing platform. Prayer is a
      powerful thing, but too many are to afraid to share their requests because
      of what others might think. Knowing that their requests are shared
      anonymously helps supply users with the courage to share their requests,
      while also enabling their friends to pray for them.
    </p>
    <h3>What data do we collect?</h3>
    <p>Nothing more than what you supply.</p>
    <h3>How do we make money?</h3>
    <p>
      The honest answer: we don’t. We currently run on servers that are paid for
      out of our own pockets. If you would like to help cover the costs, you can{' '}
      <Link to="/contact">Contact Us.</Link>
    </p>
  </div>
);

export default AboutPage;
