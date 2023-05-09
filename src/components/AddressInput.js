import { TextField, IconButton, InputAdornment, Tooltip } from "@mui/material";
import { ContentCopy, OpenInNew } from "@mui/icons-material";
import styled from "styled-components";

const ShiftRight = styled.div`
  position: relative;
  left: 10px;
`;

export default ({ label }) => {
  return (
    <TextField
      id="outlined-basic"
      label={label}
      size="small"
      variant="outlined"
      InputLabelProps={{ shrink: true }}
      InputProps={{
        placeholder: "0x...",
        endAdornment: (
          <ShiftRight>
            <InputAdornment position="start">
              <Tooltip title="Copy">
                <IconButton aria-label="copy" size="small" edge="end">
                  <ContentCopy sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="View in explorer">
                <IconButton size="small" edge="end">
                  <OpenInNew sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          </ShiftRight>
        ),
      }}
    />
  );
};
