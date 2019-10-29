import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    margin: theme.spacing.unit,
  },
});

class Snack extends React.Component {

  state = {
    open: false,

  };
  handleOpen = () => {
    this.setState({open: !this.state.open});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });

  };
  render() {
    return (
      <div style={{maxWidth: 500}}>
      <button id="LoB" title="Show info" onClick={this.handleOpen}></button>
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={this.state.open}


        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<p>{ this.props.info[0] } <br/> { this.props.info[1] } <br/> { this.props.info[2] } <br/> { this.props.info[3] }</p>}
      />
    </div>
    );
  }
}

Snack.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Snack);
