import { extractDataFromSession, isLoggedIn } from '@/utils/auth';
import { SET_LOGIN_DATA, SET_LOGOUT } from './actions';

export const initialState = {
  opened: false,
  func: null,
  mode: 'login',
  data: {},
  auth: false,
};

const loginReducer = (state = initialState, action) => {

  switch (action.type) {
    case SET_LOGOUT:
      return {
        opened: false,
        func: null,
        data: null,
        auth: false
      };
    case SET_LOGIN_DATA:
      const data = extractDataFromSession();
      const newState = { ...state, data, auth: true };
      process.env.NODE_ENV !== 'production' && console.log(3039, newState);
      return newState;
    default:
      return state;
  }
};

export default loginReducer;
