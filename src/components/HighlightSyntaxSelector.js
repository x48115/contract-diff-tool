import { useDispatch } from "react-redux";
import { setHighlightSyntax } from "../store/options.js";
import { useHighlightSyntax } from "../hooks";

export default () => {
  const dispatch = useDispatch();
  const highlightSyntax = useHighlightSyntax();

  const onChange = () => {
    if (highlightSyntax) {
      dispatch(setHighlightSyntax(false));
    } else {
      dispatch(setHighlightSyntax(true));
    }
  };
  return (
    <>
      <label>
        syntax highlighting
        <input type="checkbox" onChange={onChange} checked={highlightSyntax} />
      </label>
    </>
  );
};
