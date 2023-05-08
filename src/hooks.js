import { useDispatch, useSelector } from "react-redux";
import { selectTheme, selectHideFiles, selectSplitView } from "./store/options";

import { selectChains } from "./store/chains";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
export const useTheme = () => useSelector(selectTheme);
export const useSplitView = () => useSelector(selectSplitView);
export const useHideFiles = () => useSelector(selectHideFiles);
export const useSelectChains = () => useSelector(selectChains);
