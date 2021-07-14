import { combineReducers } from 'redux';
import authUser from './auth/reducer';


const reducers = combineReducers({
  authUser
});

export default reducers;