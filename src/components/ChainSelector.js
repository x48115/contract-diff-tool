import { FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { useSelectChains } from "../hooks";

export default ({ className }) => {
  const chains = useSelectChains();
  return (
    <FormControl fullWidth>
      <InputLabel>Network</InputLabel>
      <Select size="small" label="Network" value={1}>
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
