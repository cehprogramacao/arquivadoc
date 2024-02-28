import { decodeToken } from '@/utils/auth';
import * as actionTypes from './actions';

export const initialState = {
  queueSize: 0,
};

const arquivaDoc = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_QUEUESIZE:
      return { ...state, queueSize: action.queueSize };
    //case actionTypes.SET_LOGIN:
    //  return { ...state, loginData: decodeToken(action.accessToken) };
    //case actionTypes.SET_LOGOUT:
    //  return { ...state, loginData: {} };
    default:
      return state;
  }
};

export default arquivaDoc;
