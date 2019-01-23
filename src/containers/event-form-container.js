import { addNewEvent } from '../redux/actions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Form from '../components/event-form';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300,
  },
  margin: {
    margin: theme.spacing.unit,
  },
  cssFocused: {},
});

const mapStateToProps = state => {
  return {
    events: state.events,
  }
}

const mapDispatchToProps = { addNewEvent }

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(Form)));
