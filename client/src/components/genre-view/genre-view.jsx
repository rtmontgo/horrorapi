import React from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import './genre-view.scss';



export const GenreView = (props) => {


  const { genre } = props;

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
