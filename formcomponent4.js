import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
const styles = theme => ({
});

class Men extends React.Component {

  state = {
    open: false,
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render() {

    return (
    <div>
      <button id="menu" title="Open Menu" onClick={this.handleOpen}></button>
      <SwipeableDrawer
        open={this.state.open}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
      >
      <List>
        {['Presentation', 'About', 'Sponsors'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['AWS', 'Azure', 'Ansible'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      </SwipeableDrawer>
    </div>
  );
}
}

Men.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Men);
