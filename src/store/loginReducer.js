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
        data: {},
        auth: false,
      };
    case SET_LOGIN_DATA:
      const data = extractDataFromSession();
      const newState = { ...state, data, auth: isLoggedIn() };
      console.log(3039, newState);
      return newState;
    default:
      return state;
  }
};

export default loginReducer;
