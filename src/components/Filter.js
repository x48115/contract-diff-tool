import { TextField, IconButton, InputAdornment, Tooltip } from "@mui/material";
import styled from "styled-components";
import { Search } from "@mui/icons-material";

const SearchIconWrapper = styled.div`
  position: relative;
  width: 15px;
  left: -7px;
`;

export default ({ label }) => {
  return (
    <TextField
      id="outlined-basic"
      label=""
      size="small"
      variant="outlined"
      fullWidth
      InputProps={{
        placeholder: "Filter changed files",
        startAdornment: (
          <InputAdornment position="start" disablePointerEvents={true}>
            <SearchIconWrapper>
              <IconButton aria-label="open" size="small" edge="start">
                <Search sx={{ fontSize: 22, opacity: 0.5 }} />
              </IconButton>
            </SearchIconWrapper>
          </InputAdornment>
        ),
      }}
    />
  );
};
