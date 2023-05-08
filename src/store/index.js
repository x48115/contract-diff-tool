import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import storage from "redux-persist/lib/storage";
import reduxWebsocket from "@giantmachines/redux-websocket";

import rootReducer from "./reducers";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the middleware instance.
const websocketMiddlewareOptions = {
  dateSerializer: (date) => date.getTime(),
  prefix: "websocket/REDUX_WEBSOCKET",
  serializer: (data) => {
    return JSON.stringify(data);
  },
  reconnectOnClose: true,
  onOpen: (ws) => {
    // console.log("brogg", ws);
    // ws.send(0x09);
    // setInterval(() => {
    //   console.log("ping");
    //   //   ws.send(0x09);
    // }, 5000);
  },
};
const reduxWebsocketMiddleware = reduxWebsocket(websocketMiddlewareOptions);

const websocketOnOpenMiddleware = (store) => (next) => (action) => {
  if (action.type === "REDUX_WEBSOCKET::OPEN") {
    // store.dispatch({ type: "REDUX_WEBSOCKET/OPEN" });
  }
  let result = next(action);
  return result;
};

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredActionPaths: ["payload", "payload.event"],
      },
    }).concat(reduxWebsocketMiddleware, websocketOnOpenMiddleware),
});

export const persistor = persistStore(store);
