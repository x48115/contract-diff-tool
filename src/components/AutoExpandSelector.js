import { useDispatch } from "react-redux";
import { setAutoExpand } from "../store/options.js";
import { useAutoExpand } from "../hooks";

export default () => {
  const dispatch = useDispatch();
  const autoExpand = useAutoExpand();

  const onChange = () => {
    if (autoExpand) {
      dispatch(setAutoExpand(false));
    } else {
      dispatch(setAutoExpand(true));
    }
  };
  return (
    <>
      <label>
        expand
        <input type="checkbox" onChange={onChange} checked={autoExpand} />
      </label>
    </>
  );
};
