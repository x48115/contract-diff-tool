import { useDispatch } from "react-redux";
import { setTheme } from "../store/options.js";
import { useTheme } from "../hooks";

export default () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const onChange = () => {
    if (theme === "dark") {
      dispatch(setTheme("light"));
    } else {
      dispatch(setTheme("dark"));
    }
  };
  return (
    <>
      <label>
        dark
        <input
          type="checkbox"
          onChange={onChange}
          checked={theme === "dark" ? true : false}
        />
      </label>
    </>
  );
};
