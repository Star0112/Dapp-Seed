import {
  SET_ADDRESS,
  SET_NETWORKID,
  SET_CONNECT_TYPE,
  SET_ERROR,
} from '../actions';

export const setAddress = (address) => ({
  type: SET_ADDRESS,
  payload: { address }
});

export const setNetworkId = (networkId) => ({
  type: SET_NETWORKID,
  payload: { networkId }
});

export const setConnectType = (connectType) => ({
  type: SET_CONNECT_TYPE,
  payload: { connectType }
});

export const setError = (error) => ({
  type: SET_ERROR,
  payload: { error }
});
