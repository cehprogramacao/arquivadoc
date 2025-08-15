import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './loginReducer';
import alertReducer from './alertReducer';


const store = configureStore({
    reducer: {
        login: loginReducer,
        alert: alertReducer
    },
});

export default store;
