import { useDispatch, useSelector } from "react-redux";
import {
  selectTheme,
  selectHideFiles,
  selectSplitView,
  selectNetwork1,
  selectNetwork2,
  selectExplorer1,
  selectExplorer2,
  selectChain1,
  selectChain2,
  selectSelectedFile,
} from "./store/options";

import { selectChains } from "./store/chains";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
export const useTheme = () => useSelector(selectTheme);
export const useSplitView = () => useSelector(selectSplitView);
export const useHideFiles = () => useSelector(selectHideFiles);
export const useSelectChains = () => useSelector(selectChains);
export const useSelectNetwork1 = () => useSelector(selectNetwork1);
export const useSelectNetwork2 = () => useSelector(selectNetwork2);
export const useSelectExplorer1 = () => useSelector(selectExplorer1);
export const useSelectExplorer2 = () => useSelector(selectExplorer2);
export const useSelectChain1 = () => useSelector(selectChain1);
export const useSelectChain2 = () => useSelector(selectChain2);
export const useSelectSelectedFile = () => useSelector(selectSelectedFile);
