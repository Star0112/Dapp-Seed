import {
    SET_ADDRESS,
    SET_NETWORKID,
    SET_CONNECT_TYPE,
    SET_ERROR,
} from '../actions';

const INIT_STATE = {
    error: '',
    address: null,
    networkId: null,
    connectType: ''
};

const authReducer = (state = INIT_STATE, action) => {
    switch (action.type) {
        case SET_ADDRESS:
            return { ...state, address: action.payload.address };
        case SET_NETWORKID:
            return { ...state, networkId: action.payload.networkId };
        case SET_CONNECT_TYPE:
            return { ...state, connectType: action.payload.connectType };
        case SET_ERROR:
            return { ...state, error: action.payload.error };
        default: return { ...state };
    }
}

export default authReducer;