import * as actionTypes from './actions';

const initialState = {
  open: false,
  message: '',
  severity: '',
  alertType: ''
};

const alertReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ALERT:
      return {
        ...state,
        open: true,
        message: action.message,
        severity: action.severity,
        alertType: action.alertType
      };
    case actionTypes.CLOSE_ALERT:
      return {
        ...state,
        open: false,
        message: '',
        alertType: ''
      };
    default:
      return state;
  }
};

export default alertReducer;
