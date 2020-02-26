import React from 'react';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import './genre-view.scss';

export const GenreView = (props) => {

  // if (!genre) return null;
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

// GenreView.propTypes = {
// genre: PropTypes.exact({
// Name: PropTypes.string,
// Description: PropTypes.string
// }),
// movie: PropTypes.arrayOf(
// PropTypes.shape({
// Title: PropTypes.string,
// ImageUrl: PropTypes.string,
// Description: PropTypes.string,
// Genre: PropTypes.exact({
// Name: PropTypes.string,
// Description: PropTypes.string
// }),
// Director: PropTypes.shape({
// Name: PropTypes.string,
// Bio: PropTypes.string
// })
// })
// )
// };