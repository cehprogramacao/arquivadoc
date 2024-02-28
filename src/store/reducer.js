'use client';
import { combineReducers } from 'redux';

import arquivaDoc from './arquivaDoc';
import loginReducer from './loginReducer';

const reducer = combineReducers({
  arquivaDoc: arquivaDoc,
  login: loginReducer,
});

export default reducer;
