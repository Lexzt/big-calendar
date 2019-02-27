import View from '../components/view';
import { withRouter } from 'react-router-dom';
import {
  beginGoogleAuth,
} from '../actions/auth';
import {
  retrieveStoreEvents
} from '../actions/db/events';
import {
  beginGetGoogleEvents
} from '../actions/events';
import { connect } from 'react-redux';
import { getFilteredEvents } from '../selectors/ui-selector';

const mapStateToProps = state => {
  return {
    events: getFilteredEvents(state),
    initialSync: state.events.initialSync,
    isAuth: state.auth.currentUser
  };
};

const mapDispatchToProps = dispatch => ({
  beginGetGoogleEvents: () => dispatch(beginGetGoogleEvents()),
  beginGoogleAuth: () => dispatch(beginGoogleAuth()),
  retrieveStoreEvents: () => dispatch(retrieveStoreEvents())

});



export default connect(mapStateToProps, mapDispatchToProps)(withRouter(View));
