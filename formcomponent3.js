import React from 'react';
import servername from './const'
import Snackbar from '@material-ui/core/Snackbar';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

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
    callerid: 0,

  };
  handleDeleteRequest() {
    const data = {
      call_id : this.state.callerid,
    }
    console.log(data)
    console.log(JSON.stringify(data, null, 2))
    fetch(`${servername}/deletecaller`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data, null, 2)
    }).then(res => console.log(res))
  }
  handleOpen = () => {
    this.setState({open: !this.state.open});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });

  };
  handleDelete = () => {
    this.setState({callerid: this.props.info[4]}, () => {
      this.props.callerDelete(this.state.callerid);
      this.handleDeleteRequest()
      this.setState({open: false});})

  };
  handleColor = () => {
    this.props.rffchange(this.props.info[0])
    this.setState({open: false})
  };
  render() {
    let button;
    let bubble;
    if( this.props.info.length > 2)
    {
      button = <Button onClick={this.handleDelete} variant="contained" color="secondary" >Delete</Button>
      bubble=<p>MMSI: { this.props.info[0] } <br/>Number of People: { this.props.info[1] } <br/>Status: { this.props.info[2] } <br/>Timestamp: { this.props.info[3] }<br/> CallerID: { this.props.info[4] }</p>
    }
    else if (this.props.info.length > 0)
    {
      button = <Button onClick={this.handleColor} variant="contained" color="secondary" >Delete</Button>
      bubble=<p>{ this.props.info[0] }</p>
    }
    else
    {
      bubble=<p>{ this.props.info[0] }</p>
    }
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
        message={bubble}
        action={button}
      />
    </div>
    );
  }
}

Snack.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Snack);
