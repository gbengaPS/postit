import { createStore, applyMiddleware, compose } from 'redux';

import { thunk } from 'redux-thunk';
import rootReducer from './reducers';
import InitialState from './reducers/InitialState';

const middlewares = applyMiddleware(thunk);
const composer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // eslint-disable-line no-underscore-dangle

let storeValue;
if (process.env.NODE_ENV) {
  storeValue = createStore(rootReducer, InitialState, middlewares);
} else {
  storeValue = createStore(rootReducer, InitialState, composer(middlewares));
}

// storeValue variable was created because eslint flags and error when
// a mutable value is being exported
const store = storeValue;
export default store;
