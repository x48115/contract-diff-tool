import { TextField, IconButton, InputAdornment } from "@mui/material";
import styled from "styled-components";
import { Search } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getEndOfPath } from "../utils/string";

const SearchIconWrapper = styled.div`
  position: relative;
  width: 15px;
  left: -7px;
`;

export default ({ contracts, setFilteredContracts, filter, setFilter }) => {
  useEffect(() => {
    if (filter === "") {
      setFilteredContracts(contracts);
      return;
    }
    const filtered = [];
    contracts.forEach((contract) => {
      const fileName = getEndOfPath(contract.name);
      if (fileName.toLowerCase().indexOf(filter.toLowerCase()) !== -1) {
        filtered.push(contract);
      }
      setFilteredContracts(filtered);
    });
  }, [filter, contracts]);
  return (
    <TextField
      id="outlined-basic"
      label=""
      size="small"
      variant="outlined"
      fullWidth
      value={filter || ""}
      onChange={(evt) => setFilter(evt.target.value)}
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
