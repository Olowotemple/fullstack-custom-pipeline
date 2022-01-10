import { combineReducers } from 'redux';
import blogReducer from './blogReducer';
import userReducer from './userReducer';
import notificationReducer from './notificationReducer';

const reducer = combineReducers({
  blogs: blogReducer,
  user: userReducer,
  notification: notificationReducer,
});

export default reducer;
