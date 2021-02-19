import React, { useState, useEffect } from 'react';
import { siteUtils, reactUtils } from '../../utils';

import './css.scss';

const { useBodyClass } = reactUtils;

const MovieDetail = (props) => {
  const { placeHolderImage, match: { params: { movieId = null } } } = props;
  const [contextualMovie, setContextual] = useState(null);

  useBodyClass('page-movie');
  useEffect(() => {
    Promise.resolve({})
      .then((response) => {
        setContextual(response);

        return response;
      })
      .catch((error) => {
        console.log('Failed to fetch ', error.message);
        console.error(error);
        return null;
      });
  }, [movieId]);

  if (!contextualMovie || !movieId) {
    return null;
  }

  const combinedRatings = [...(contextualMovie.Ratings || [])];
  if (contextualMovie.Ratings.length === 0 && contextualMovie.imdbRating) {
    combinedRatings.push({ Source: 'IMDB', Value: contextualMovie.imdbRating });
  }
  if (contextualMovie.Ratings.length === 0 && contextualMovie.Metascore) {
    combinedRatings.push({ Source: 'Metascore', Value: contextualMovie.Metascore });
  }
  document.title = `${contextualMovie.Title} - ${siteUtils.websiteTitle()}`;
  return <>
    <h1 className="heading heading-content">{contextualMovie.Title}{ contextualMovie.Year ? ` (${contextualMovie.Year})` : null}</h1>
    <h5 className="heading heading-minor">{contextualMovie.Actors}</h5>
    <h5 className="heading heading-minor">{contextualMovie.Writer}</h5>
    <div className="movie-detail">
      <aside>
        <img src={contextualMovie.Poster || placeHolderImage} alt={`Movie Poster for the Film '${contextualMovie.Title}'`} />
        {combinedRatings.length > 0
            && <ul className="ratings">
              {combinedRatings.map(({ Source: label, Value: rating }, i) => (<li key={`color-${i}`}><span>{label}: </span>{rating}</li>))}
            </ul>
        }
      </aside>
      <article>
        <p className="body-text">{contextualMovie.Plot}</p>
        <h6 className="heading heading-sub-minor">Runtime: {contextualMovie.Runtime}</h6>
        <h6 className="heading heading-sub-minor">Rated: {contextualMovie.Rated}</h6>
        <h6 className="heading heading-sub-minor">
          <a href={`https://www.imdb.com/title/${contextualMovie.imdbID}/`} rel="noopener noreferrer" target="_blank">IMDB <svg width="12" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" role="presentation"><path d="M21.6 21.6H2.4V2.4h7.2V0H0v24h24v-9.6h-2.4v7.2zM14.4 0v2.4h4.8L7.195 14.49l2.4 2.4L21.6 4.8v4.8H24V0h-9.6z"></path></svg></a>
        </h6>
      </article>
    </div>
  </>;
};

export default MovieDetail;
