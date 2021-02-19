import React from 'react';
import { Link } from 'react-router-dom';
import './css.scss';

const MovieCard = (props) => {
  const { toHref, movie: { Title, description } } = props;
  return <article className="movie-card">
    <div className="movie-card-container">
      <h5 className="heading heading-sub-content movie-card-title-text">{ Title }</h5>
      { props.children || null }
      <p className="body-text movie-card-description-text">{ description }</p>
      <Link className="body-text form-button form-button-alt movie-card-button" to={toHref}>More</Link>
    </div>
  </article>;
};

export default MovieCard;
