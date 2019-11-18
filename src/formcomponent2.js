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
    num_people:0,
    timestamp:'',
    vessel_info:'',
    callerid: 0,
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
      rff_1: this.state.rf1,
      rff_2: this.state.rf2,
      rff_theta_1: this.state.rt1,
      rff_theta_2: this.state.rt2,
      num_people: this.state.num_people,
      vessel_info: this.state.vessel_info,
      time_stamp: this.state.timestamp,
    }
    console.log(data)
    console.log(JSON.stringify(data))
    return fetch(`${servername}/newcaller`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => console.log(res))
  }
  addcaller = () => {
    this.handlePostRequest();
    this.props.calleradd(this.state.rf1, this.state.rf2, this.state.rt1, this.state.rt2, this.state.mmsi_id, this.state.num_people, this.state.vessel_info, this.state.timestamp, this.state.callerid);
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
          onChange={this.handleChange('name')}
          margin="normal"
          fullWidth
        />
        <TextField
          id="rff_1"
          label="rff_1"
          className={classes.textField}
          value={this.state.rf1}
          onChange={this.handleChange('rf1')}
          margin="normal"
          fullWidth
        />
        <TextField
          id="rff_2"
          label="rff_2"
          className={classes.textField}
          value={this.state.rf2}
          onChange={this.handleChange('rf2')}
          margin="normal"
          fullWidth
        />

        <TextField
        id="standard-df"
        label="rff_theta_1"
        value={this.state.rt1}
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
          label="rff_theta_2"
          value={this.state.rt2}
          onChange={this.handleChange('rt2')}
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
        label="num People"
        value={this.state.num_people}
        onChange={this.handleChange('num_people')}
        type="number"
        className={classes.textField}
        InputLabelProps={{
            shrink: true,
        }}
        margin="normal"
        fullWidth
        />
        <TextField
          id="vessel_info"
          label="vessel_info"
          className={classes.textField}
          value={this.state.vessel_info}
          onChange={this.handleChange('vessel_info')}
          margin="normal"
          fullWidth
        />
        <TextField
          id="timestamp"
          label="timestamp"
          className={classes.textField}
          value={this.state.timestamp}
          onChange={this.handleChange('timestamp')}
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
