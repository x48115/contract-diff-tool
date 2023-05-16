import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import {
  useSelectChains,
  useSelectNetwork1,
  useSelectNetwork2,
} from "../hooks";
import { setNetwork1, setNetwork2 } from "../store/options";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default ({ field }) => {
  const network1 = useSelectNetwork1();
  const network2 = useSelectNetwork2();
  const chains = useSelectChains();
  const network = field === 1 ? network1 : network2;
  const setNetwork = field === 1 ? setNetwork1 : setNetwork2;
  const dispatch = useDispatch();
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  useEffect(() => {
    let networkParam = params[`chain${field}`];
    if (!networkParam) {
      networkParam = 1;
    }
    dispatch(setNetwork(networkParam));
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel>{`Network ${field}`}</InputLabel>
      <Select
        size="small"
        label="Network"
        value={network}
        onChange={(evt) => dispatch(setNetwork(evt.target.value))}
      >
        {chains.map((chain) => (
          <MenuItem
            value={chain.chainId}
            key={`${chain.name} ${chain.chainId}`}
          >
            {chain.name} ({chain.chainId})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
