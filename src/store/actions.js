export const SET_QUEUESIZE = '@arquivadoc/SET_QUEUESIZE';
export const SET_LOGIN_DATA = '@login/SET_LOGIN_DATA';
export const SET_LOGOUT = '@login/SET_LOGOUT';
export const SET_ALERT = '@alert/SET_ALERT';
export const CLOSE_ALERT = '@alert/CLOSE_ALERT';

export const SHOW_ALERT = 'SHOW_ALERT';
export const HIDE_ALERT = 'HIDE_ALERT';

export const showAlert = (message, severity, type) => ({
  type: SHOW_ALERT,
  payload: { message, severity, type,open: true },
});

export const hideAlert = () => ({
  type: HIDE_ALERT,
});
