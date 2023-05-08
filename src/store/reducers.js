import { combineReducers } from "redux";
import options from "./options";
import swap from "./swap";
import chains from "./chains";

const rootReducer = combineReducers({
  options,
  swap,
  chains,
});

export default rootReducer;
