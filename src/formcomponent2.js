import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import servername from './const'
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

class CallerFields extends React.Component {
  state = {
    name: '',
    rf1: '',
    rf2: '',
    rt1: 0,
    rt2:0,
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
      mmsi_id: this.state.name,
      rf1: this.state.rf1,
      rf2: this.state.rf2,
      rt1: this.state.rt1,
      rt2: this.state.rt2,
    }
    console.log(data)
    console.log(JSON.stringify(data, null, 2))
    fetch(`${servername}/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data, null, 2)
    }).then(res => console.log(res))
  }
  addcaller = () => {
    this.handlePostRequest();
    this.props.calleradd(this.state.rf1, this.state.rf2, this.state.rt1, this.state.rt2, this.state.mmsi_id);
    this.setState({open: false});
  }
  render() {
    const { classes } = this.props;

    return (
      <div>
      <button id="caller" onClick={this.handleOpen} title="add Caller"></button>
      <Dialog open={this.state.open} onClose={this.handleClose}>
      <DialogTitle id="form-dialog-title">Add Caller</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter Corresponding data for Caller and it will be displayed. Make sure the information is correct before pressing submit.
        </DialogContentText>
        <TextField
          id="mmsi_id"
          label="mmsi_id"
          className={classes.textField}
          value={this.state.mmsi_id}
          onChange={this.handleChange('mmsi_id')}
          margin="normal"
          fullWidth
        />
        <TextField
          id="rff_1"
          label="rf1"
          className={classes.textField}
          value={this.state.rf1}
          onChange={this.handleChange('rf1')}
          margin="normal"
          fullWidth
        />
        <TextField
          id="rff_2"
          label="rf2"
          className={classes.textField}
          value={this.state.rf2}
          onChange={this.handleChange('rf2')}
          margin="normal"
          fullWidth
        />

        <TextField
        id="standard-df"
        label="rt_1"
        value={this.state.rf1}
        onChange={this.handleChange('rt1')}
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
          label="rt_2"
          value={this.state.rf2}
          onChange={this.handleChange('rt2')}
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
        <Button variant="contained" color="primary" className={classes.button} onClick={this.addcaller}>
          Add
        </Button>
      </DialogActions>
      </Dialog>
      </div>
    );
  }
}

CallerFields.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CallerFields);