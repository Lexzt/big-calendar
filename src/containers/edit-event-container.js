import { editEventBegin } from '../actions/events';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import EditEvent from '../components/editEvent';

const mapDispatchToProps = dispatch => ({
  editEventBegin: (id, eventObject) => dispatch(editEventBegin(id, eventObject))
});

export default connect(mapDispatchToProps)(withRouter(EditEvent));
