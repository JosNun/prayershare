import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => (
  <div className="AboutPage MainView">
    <h1>About</h1>
    <p>
      Prayer Share is a pet project conceived by{' '}
      <a href="josnun.github.io" target="_blank">
        Josiah Nunemaker
      </a>{' '}
      after he realized that many people were too shy to share their prayer
      requests, or be honest in doing so, because of what other people might
      think. Prayer Share is a way to share those requests with people you care
      about, while also maintain some degree of anonymity.
    </p>
    <h3>How do we make money?</h3>
    <p>
      The honest answer: we don’t. We currently run on servers that are paid for
      out of our own pockets. If you would like to help cover the costs, you can{' '}
      <Link to="/contact">Contact Us</Link>
    </p>
  </div>
);

export default AboutPage;
