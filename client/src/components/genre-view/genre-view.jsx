import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import './genre-view.scss';

function GenreView(props) {
  const { movies, genreName } = props;

  if (!movies || !movies.length) return null;

  const genre = movies.find(movie => movie.Genre.Name === genreName);

  return (
    <div className="genre-view">
      <h1>{genre.Name}</h1>
      <div>
        <h3>Description</h3>
        <p>{genre.Description}
        </p>
      </div>
      <br />
      <Link to={`/`} >
        <Button className="button-card" variant="info">Back</Button>
      </Link>
    </div>
  );
}

export default connect(({ movies }) => ({ movies }))(GenreView);