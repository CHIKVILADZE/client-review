import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Fuse from 'fuse.js';
import axios from 'axios';

function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const { postId } = useParams();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fuse = new Fuse([...posts, ...comments], {
    keys: ['author.firstName', 'title', 'desc', 'text'],
    includeScore: true,
  });

  useEffect(() => {
    axios
      .get('https://review-platform-ql9e.onrender.com/api/posts')
      .then((res) => {
        setPosts(
          res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        );
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get('https://review-platform-ql9e.onrender.com/api/comments')
      .then((res) => {
        setComments(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setQuery(searchTerm);

    const searchResults = fuse.search(searchTerm);

    const formattedResults = searchResults.map((result) => {
      const { item } = result;
      if (item.type === 'post') {
        console.log('item typee', item.type);

        return {
          id: item.id,
          title: item.title,
          desc: item.desc,
          reviewName: item.reviewName,
          link: `/post/${item.id}`,
        };
      } else if (item.type === 'comment') {
        console.log('item typee', item.type);

        return {
          id: item.id,
          title: item.text,
          postId: item.postId,
          link: `/post/${item.postId}`,
        };
      }
      return item;
    });

    setResults(formattedResults);
    setShowSuggestions(searchTerm !== '');
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={query}
              onChange={handleSearch}
              onFocus={() => setShowSuggestions(true)}
            />
          </div>
          {showSuggestions && query.length > 0 && (
            <div
              className="mt-2 position-absolute bg-light border rounded"
              style={{
                width: '42%',
                maxHeight: '250px',
                overflowY: 'auto',
                zIndex: 1,
              }}
            >
              {results.map((result) => (
                <Link
                  key={result.id}
                  to={`/post/${result.text ? result.postId : result.id}`}
                  className="p-2 border-bottom d-block text-decoration-none"
                >
                  {result.text ? (
                    <h5>{result.text}</h5>
                  ) : (
                    <>
                      <h6>
                        {result.author.firstName}&nbsp;{result.author.lastName}
                      </h6>
                      <p className="text-black">{result.title}</p>
                      <span className="text-grey">{result.desc}</span>
                      <br />
                      <span className="text-grey">{result.reviewName}</span>
                    </>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GlobalSearch;
