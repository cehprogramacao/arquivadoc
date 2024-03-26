  import { SHOW_ALERT, HIDE_ALERT } from './actions';

  const initialState = {
    open: false,
    message: '',
    severity: '',
    type: ''
  };

  const alertReducer = (state = initialState, action) => {
    switch (action.type) {
      case SHOW_ALERT:
        return {
          ...state,
          open: true,
          message: action.payload.message,
          severity: action.payload.severity,
          type: action.payload.type
        };
      case HIDE_ALERT:
        return {
          ...state,
          open: false,
          message: '',
          type: ''
        };
      default:
        return state;
    }
  };

  export default alertReducer;
