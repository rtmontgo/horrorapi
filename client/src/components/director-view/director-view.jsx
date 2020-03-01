import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './director-view.scss';

function DirectorView(props) {
  const { movies, directorName } = props;

  if (!movies || !movies.length) return null;

  const director = movies.find(movie => movie.Director.Name === directorName)
    .Director;

  // if (!director) return 'no director found';
  // if (!director.DeathYear) return "present";

  return (
    <Card className="director-card" style={{ width: '16rem' }}>
      <Card.Body>
        <Card.Title className="director-name">{director.Name}</Card.Title>
        <Card.Text>
          Biography: <br />
          {director.Bio} <br />
          Birth Year: {director.BirthYear} <br />
          <br />
          Death Year: {director.DeathYear}
        </Card.Text>
        <div className="return">
          <Link to={`/`}>
            <Button className="return-btn" variant="info">Return</Button>
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
}


export default connect(({ movies }) => ({ movies }))(DirectorView);

DirectorView.propTypes = {
  Director: PropTypes.shape({
    Name: PropTypes.string,
    Bio: PropTypes.string,
    Death: PropTypes.string
  }).isRequired
};