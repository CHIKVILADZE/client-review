import React, { useEffect, useState } from 'react';
import Posts from '../components/Posts';
import PopularTags from '../components/PopularTags';
import axios from 'axios';

function Home() {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-10">
          <Posts />
        </div>
        <div className="col-md-2">
          <PopularTags />
        </div>
      </div>
    </div>
  );
}

export default Home;
