import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  button: {
    margin: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

class TextFields extends React.Component {
  state = {
    longitude: 0,
    latitude: 0,
    name: '',
    open: false,
  };
  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });

  };

  handlePostRequest() {
    const data = {
      rff_name: this.state.name,
      lat: this.state.latitude,
      lon: this.state.longitude,
    }
    console.log(data)
    console.log(JSON.stringify(data, null, 2))
    /*fetch(`${servername}/addrff`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data, null, 2)
    }).then(res => console.log(res))*/
  }
  addrff = () => {
    this.handlePostRequest();
    this.props.rffadd(this.state.latitude, this.state.longitude, this.state.name);
    this.setState({open: false});
  }
  render() {
    const { classes } = this.props;

    return (
      <div>
      <button id="rff" onClick={this.handleOpen} title="Add RFF"></button>
      <Dialog open={this.state.open} onClose={this.handleClose}>
      <DialogTitle id="form-dialog-title">Add Request for Forces</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter Corresponding data for RFF it will be displayed. Make sure the information is correct before pressing submit.
        </DialogContentText>
        <TextField
          id="rff name"
          label="rff-name"
          className={classes.textField}
          value={this.state.name}
          onChange={this.handleChange('name')}
          margin="normal"
          fullWidth
        />

        <TextField
        id="standard-df"
        label="latitude"
        value={this.state.latitude}
        onChange={this.handleChange('latitude')}
        type="number"
        className={classes.textField}
        InputLabelProps={{
            shrink: true,
        }}
        margin="normal"
        fullWidth
        />

        <TextField
          id="standard-df"
          label="longitude"
          value={this.state.longitude}
          onChange={this.handleChange('longitude')}
          type="number"
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          margin="normal"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={this.handleClose} color="primary">
          Cancel
        </Button>
        <Button variant="contained" color="primary" className={classes.button} onClick={this.addrff}>
          Add
        </Button>
      </DialogActions>
      </Dialog>
      </div>
    );
  }
}

TextFields.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TextFields);
