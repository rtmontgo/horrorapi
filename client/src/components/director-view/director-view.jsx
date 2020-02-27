import React from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './director-view.scss';

export class DirectorView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }

  render() {
    const { director } = this.props;

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
}

DirectorView.propTypes = {
  director: PropTypes.exact({
    _id: PropTypes.string,
    Name: PropTypes.string.isRequired,
    Bio: PropTypes.string.isRequired,
    Birthyear: PropTypes.string,
    Deathyear: PropTypes.string
  }).isRequired,
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