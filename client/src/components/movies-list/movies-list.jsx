import React from 'react';
import PropTypes from 'prop-types';

// import app components
import { MovieCard } from '../movie-card/movie-card';

// imports for files to bundle
import './movies-list.scss';

export function MoviesList(props) {

  const { movies, title, userProfile, onToggleFavourite } = props;

  return (
    movies.length === 0
      ? <React.Fragment></React.Fragment>
      : (<React.Fragment>
        {title && (<React.Fragment><h5>{title}</h5><br /></React.Fragment>)}
        <div className="movies-list card-deck">
          {movies.map(movie => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onToggleFavourite={movieId => onToggleFavourite(movieId)}
              isFavorite={userProfile && userProfile.FavoriteMovies.includes(movie._id)}
              userProfile={userProfile}
            />
          ))}
        </div>
      </React.Fragment>
      )
  );
}

MoviesGrid.propTypes = {

  movies: PropTypes.arrayOf(
    PropTypes.shape({
      Title: PropTypes.string,
      ImageUrl: PropTypes.string,
      Description: PropTypes.string,
      Genre: PropTypes.exact({
        _id: PropTypes.string,
        Name: PropTypes.string,
        Description: PropTypes.string
      }),
      Director: PropTypes.shape({
        Name: PropTypes.string
      })
    })
  ),
  onToggleFavourite: PropTypes.func.isRequired
};