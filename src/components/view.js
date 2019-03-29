import React from "react";
import BigCalendar from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import Modal from 'react-modal';
import './view.css';
import getDb from '../db';
import * as ProviderTypes from '../utils/constants';
import SignupSyncLink from './SignupSyncLink';

// import { ExchangeVersion, ExchangeService, DateTime, WebCredentials, Uri, WellKnownFolderName, CalendarView, SearchFilter, FolderSchema, FolderView, ExchangeCredentials } from 'ews-javascript-api';

const localizer = BigCalendar.momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

export default class View extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEvent: [{}] ,
      isShowEvent: false,
      currentEventStartDateTime: '',
      currentEventEndDateTime: '',
      exchangeEmail: '',
      exchangePwd: ''
    };
    let incrementalSync;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // For the modal third party library
    Modal.setAppElement('body');
  }

  async componentDidMount() {
    //// Code is here to test for when china team gets back!!
    // let exch = new ExchangeService();
    // exch.Credentials = new ExchangeCredentials(action.payload.email, action.payload.password);
    // exch.Url = new Uri("https://outlook.office365.com/Ews/Exchange.asmx");

    // var view = new CalendarView(DateTime.Now.Add(-23, "month"), DateTime.Now);
    // exch.FindAppointments(WellKnownFolderName.Calendar, view).then((response) => {
    //   console.log(response.Items);
    // }, function (error) {
    //   console.log(error);
    // });


    const db = await getDb();
    db.persons.find().exec().then(providerUserData => {
      providerUserData.map((singleProviderUserData) => {
        if(singleProviderUserData.providerType === ProviderTypes.EXCHANGE){ // Might wanna rethink this approach as it might be good for some clean up here. 
          this.props.onStartGetExchangeAuth(this.filterUserOnStart(singleProviderUserData,ProviderTypes.EXCHANGE));
        } else {
          var now = new Date().getTime();
          var isExpired = now > parseInt(singleProviderUserData.accessTokenExpiry);

          // console.log(singleProviderUserData,this.filterUserOnStart(singleProviderUserData,ProviderTypes.GOOGLE));
          // console.log(now,singleProviderUserData.accessTokenExpiry,isExpired,providerUserData);
          // console.log(singleProviderUserData.providerType + " is " + (isExpired ? "expired!" : "not expired!"));

          if(!isExpired){
            switch (singleProviderUserData.providerType) {
              case ProviderTypes.GOOGLE:
                this.props.onStartGetGoogleAuth(this.filterUserOnStart(singleProviderUserData,ProviderTypes.GOOGLE));
                break;
              case ProviderTypes.OUTLOOK:
                this.props.onStartGetOutlookAuth(this.filterUserOnStart(singleProviderUserData,ProviderTypes.OUTLOOK));
                break;
              default:
                break;
            }
          }else{
            switch (singleProviderUserData.providerType) {
              case ProviderTypes.GOOGLE:
                this.props.onExpiredGoogle(this.filterUserOnStart(singleProviderUserData,ProviderTypes.GOOGLE));
                break;
              case ProviderTypes.OUTLOOK:
                this.props.onExpiredOutlook(this.filterUserOnStart(singleProviderUserData,ProviderTypes.OUTLOOK));
                break;
              default:
                break;
            }
          }
        }
      });
    });
  }

  componentWillUnmount() {
    clearInterval(this.incrementalSync);
    this.incrementalSync = null;
  }

  // Outlook OAuth Functions

  authorizeOutLookCodeRequest = () => {
    this.props.beginOutlookAuth();
    //return BASE_URL + PARAMS_URL;
  }

  authorizeGoogleCodeRequest = () => {
    this.props.beginGoogleAuth();
  }

  authorizeExchangeCodeRequest = (user,pwd) => {
    this.props.beginExchangeAuth(user,pwd);
  }

  // Calendar Event Functions

  moveEventList = ({ event, start, end }) => {
    const events = this.props.events;

    const idx = events.indexOf(event);
    const updatedEvent = { ...event, start, end };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);
    this.props.updateEvents(nextEvents);
  }

  resizeEvent = (resizeType, { event, start, end }) => {
    const events = this.props.events;

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });
    this.props.updateEvents(nextEvents);
  }

  handleSelectDate = ({ start, end }) => {
    this.props.history.push(`/${start}/$${end}`);
  }

  editEvent = () => {
    this.props.history.push(`/${this.state.currentEvent.id}`);
  }

  handleEventClick = (event) => {
    this.setState({
      isShowEvent: true,
      currentEvent: event,
      currentEventStartDateTime: moment(event.start).format("D, MMMM YYYY, h:mm a"),
      currentEventEndDateTime: moment(event.end).format("D, MMMM Do YYYY, h:mm a"),
    });
  }


  // Exchange login handling here first, will move it in the future!!
  handleChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit = async (e) => {
    e.preventDefault();
    this.authorizeExchangeCodeRequest({ username: this.state.exchangeEmail, password: this.state.exchangePwd} );
  }
  // Exchange login handling here first, will move it in the future!!

  // This filter user is used when the outlook first creates the object.
  // It takes the outlook user object, and map it to the common schema defined in db/person.js
  filterUserOnStart = (rxDoc, providerType) => {
    return {
      user: {
        personId: rxDoc.personId,
        originalId: rxDoc.originalId,
        email: rxDoc.email,
        providerType: providerType,
        accessToken: rxDoc.accessToken,
        accessTokenExpiry: rxDoc.accessTokenExpiry,
        password: rxDoc.password,
      }
    };
  };

  closeModal = () => {
    this.setState({
      isShowEvent: false
    });
  }

  deleteEvent = () => {
    this.props.beginDeleteEvent(this.state.currentEvent.id);
    this.closeModal();
  }

  /* Render functions */
  renderCalendar = () => {
    return (
      <DragAndDropCalendar
        selectable
        localizer={localizer}
        events={this.props.events}
        views={{
          month: true,
          day: true,
        }}
        onEventDrop={this.moveEventList}
        onEventResize={this.resizeEvent}
        onSelectSlot={this.handleSelectDate}
        onSelectEvent={(event) => this.handleEventClick(event)}
        popup
        resizable
      />
    );
  }
  renderEventPopup = () => {
    return (
      <Modal
        isOpen={this.state.isShowEvent}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        style={customStyles}
        contentLabel="Event Modal" >
        <h2 ref={subtitle => this.subtitle = subtitle}>{this.state.currentEvent.title}</h2>
        <h4>{this.state.currentEventStartDateTime} - {this.state.currentEventEndDateTime}</h4>
        <button onClick={this.closeModal}>Close</button>
        <button onClick={this.deleteEvent}>Delete</button>
        <button onClick={this.editEvent}>Edit</button>
      </Modal>
    );
  }

  renderSignupLinks = () => {
    var providers = [];
    for (const providerType of Object.keys(this.props.expiredProviders)) {
      let providerFunc;
      switch(providerType) {
        case ProviderTypes.GOOGLE:
          providerFunc = (() => this.authorizeGoogleCodeRequest());
          break;
        case ProviderTypes.OUTLOOK:
          providerFunc = (() => this.authorizeOutLookCodeRequest());
          break;
        case ProviderTypes.EXCHANGE:
          break;
        default:
          console.log('Provider not accounted for!!');
          break;
      }

      providers.push(<SignupSyncLink key={providerType}
        providerType={providerType}
        providerInfo={this.props.expiredProviders[providerType]}
        providerFunc={() => providerFunc()}
      />);
    }

    return (
      <div>
        <form
          onSubmit={this.handleSubmit}
        >
          <input
            type="text"
            name="exchangeEmail"
            value={this.state.exchangeEmail} onChange={this.handleChange} 
            placeholder="Exchange Email"
          />
          <input
            type="text"
            name="exchangePwd"
            value={this.state.exchangePwd} onChange={this.handleChange} 
            placeholder="Exchange Password"
          />

          <input type="submit" value="Submit"></input>
        </form>

        {/* this is for out of sync tokens. */}
        {providers}
        <a className="waves-effect waves-light btn"
          onClick={() => this.authorizeGoogleCodeRequest()}>
          <i className="material-icons left">cloud</i>Sign in with Google</a>
        <a className="waves-effect waves-light btn"
          onClick={() => this.authorizeOutLookCodeRequest()}>
          <i className="material-icons left">cloud</i>Sign in with Outlook</a>
        <a className="waves-effect waves-light btn"
        // onClick={() => this.props.beginGetGoogleEvents()}>

          // This is suppose to allow us to sync multiple user per single provider in the future!!
          // Currently, due to no UI, I am hardcoding it to a single instance. But once we get the
          // UI up and running for choosing which user events you want to get, this will be amazing
          // Note: This is the same for the following button, which pulls outlook events.

          // Okay, debate later, coz idk how to deal with it when the user signs in, to update this state here.
          onClick={() => this.props.beginGetGoogleEvents(this.props.providers["GOOGLE"][0])}>
          <i className="material-icons left">cloud_download</i>Get Google Events</a>
        <a className="waves-effect waves-light btn"
          onClick={() => this.props.beginGetOutlookEvents(this.props.providers["OUTLOOK"][0])}>
          <i className="material-icons left">cloud_download</i>Get Outlook Events</a>

        <a className="waves-effect waves-light btn"
          onClick={() => this.props.beginGetExchangeEvents(this.props.providers["EXCHANGE"][0])}>
          <i className="material-icons left">cloud_download</i>Get Exchange Events</a>

        <a className="waves-effect waves-light btn"
          onClick={() => this.props.clearAllEvents()}>
          <i className="material-icons left">close</i>Clear all Events</a>      </div>
    );
  }

  render() {
    if(this.props.isAuth !== undefined) {
      return (
        <>
        {this.renderSignupLinks()}
        {this.renderEventPopup()}
        {this.renderCalendar()}
        </>
      );
    }
    else {
      return (<div>Logging in...</div>);
    }
  }
}
