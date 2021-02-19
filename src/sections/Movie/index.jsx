/* eslint-disable */
import React from 'react';
import { Route, useLocation } from 'react-router-dom';
import SearchUI from '../../components/SearchUI';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import MovieCard from '../../components/MovieCard';
import Pagination from '../../components/Pagination';
import MovieDetail from '../MovieDetail';
import { reactUtils, jsUtils } from '../../utils';

import useSearchController from '../../hooks';

import './css.scss';

const { useBodyClass } = reactUtils;
const placeHolderImage = '/images/300x450-coming-soon.png';

const Movie = (props) => {
  useBodyClass('page-movie');
  return <>
    <Header />
    <main className="main-content main-movie">
      <section className="main-content-wrap movie">
        {<MovieRouter {...{ ...props }} />}
      </section>
    </main>
    <Footer />
  </>;
};

const MovieList = (props) => {
  const location = useLocation();
  const fetchAction = newQueryContext => Promise.resolve({});
  const socialservices = useSearchController({ ...props, pageLabel: 'Search', defaultPageSize: SEARCH_PER_PAGE, /*relativePagination: true,*/ fetchAction });
  const {
    renderContext,
    renderContext: { keyword, renderList },
    queryContext,
    queryContext: { query },
    onPaginationUpdate,
    onGenerateTo,
    paginationProps,
    onSearchUpdate
  } = socialservices;

  return <>
    <SearchUI { ...props } query={query} onSearchUpdate={onSearchUpdate} />
    <h1 className="heading heading-content">{(keyword && `Searching: '${keyword}' `) || 'Socials'}</h1>
    { renderList.length > 0
    && <Pagination { ...paginationProps } location={location} onGenerateTo={onGenerateTo} onPaginationUpdate={onPaginationUpdate}>
      <div className="movie-listing">
        {
          renderList.map((movie) => {
            const {
              Poster: image,
              imdbID
            } = movie;

            return <MovieCard movie={movie} toHref={`${location.pathname}/movie-${imdbID}`} key={`movie-listing-item-${imdbID}`}>
              <img src={image || placeHolderImage} alt={`Movie Poster for '${movie.Title}'`} />
            </MovieCard>;
          })
        }
      </div>
    </Pagination>
    }
  </>;
};

export const MovieRouter = (props) => <>
  <Route exact path={`${props.match.path}/movie-:movieId`}><MovieDetail /></Route>
  <Route exact path={`${props.match.path}`}><MovieList /></Route>
</>;
export default Movie;
