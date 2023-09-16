import React, { useEffect, useState } from 'react';
import Posts from '../components/Posts';
import PopularTags from '../components/PopularTags';
import axios from 'axios';

function Home({ t, handleChangeLanguage }) {
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-10">
          <Posts t={t} />
        </div>
        <div className="col-md-2">
          <PopularTags t={t} />
        </div>
      </div>
    </div>
  );
}

export default Home;
