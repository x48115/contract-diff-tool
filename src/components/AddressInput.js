import { TextField, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { ContentCopy, OpenInNew } from "@mui/icons-material";
import styled from "styled-components";
import { toChecksumAddress } from "ethereum-checksum-address";
import {
  useSelectChains,
  useSelectExplorer1,
  useSelectExplorer2,
  useSelectNetwork1,
  useSelectNetwork2,
} from "../hooks";
import { useEffect } from "react";

const ShiftRight = styled.div`
  position: relative;
  left: 10px;
`;

export default ({ label, addressState, setAddressState, field }) => {
  const network1 = useSelectNetwork1();
  const network2 = useSelectNetwork2();
  const chains = useSelectChains();
  const explorer1 = useSelectExplorer1();
  const explorer2 = useSelectExplorer2();
  const networkId = field === 1 ? network1 : network2;
  const explorer = field === 1 ? explorer1 : explorer2;

  const explorerAddress = explorer
    ? `${explorer}/address/${addressState.value}`
    : "";

  const copy = () => {
    navigator.clipboard.writeText(addressState.value);
  };

  const openAddress = () => {
    window.open(explorerAddress, "_blank").focus();
  };

  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  useEffect(() => {
    if (params.address1) {
      setAddress(params[`address${field}`]);
    }
  }, []);

  const setAddress = (newValue) => {
    let isValid = false;
    let checksum;
    try {
      checksum = toChecksumAddress(newValue);
      isValid = true;
    } catch (e) {
      checksum = newValue;
    }
    const error = !isValid && newValue !== "";
    setAddressState({ valid: isValid, value: checksum, error });
  };
  return (
    <TextField
      id="outlined-basic"
      label={label}
      size="small"
      variant="outlined"
      error={addressState.error}
      helperText={addressState.error ? "Invalid address" : " "}
      InputLabelProps={{ shrink: true }}
      sx={{
        "& .MuiInputBase-input": {
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
      }}
      InputProps={{
        placeholder: "0x...",
        value: addressState.value || "",
        onChange: (evt) => setAddress(evt.target.value),
        endAdornment: (
          <ShiftRight>
            <InputAdornment position="start">
              <Tooltip title="Copy">
                <div>
                  <IconButton
                    disabled={!addressState.valid}
                    tabIndex={-1}
                    onClick={copy}
                    size="small"
                    edge="end"
                  >
                    <ContentCopy sx={{ fontSize: 16 }} />
                  </IconButton>
                </div>
              </Tooltip>
              <Tooltip title="View in explorer">
                <div>
                  <IconButton
                    size="small"
                    tabIndex={-1}
                    edge="end"
                    onClick={openAddress}
                    disabled={!addressState.valid}
                  >
                    <OpenInNew sx={{ fontSize: 16 }} />
                  </IconButton>
                </div>
              </Tooltip>
            </InputAdornment>
          </ShiftRight>
        ),
      }}
    />
  );
};
