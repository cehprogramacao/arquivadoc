import { combineReducers, createStore } from 'redux';
import alertReducer from './alertReducer';
import arquivaDoc from './arquivaDoc';
import loginReducer from './loginReducer';

const reducer = combineReducers({
  alert: alertReducer,
  arquivaDoc: arquivaDoc,
  login: loginReducer,
});

export default reducer