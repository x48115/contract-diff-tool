import { useState, useEffect } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import prettier from "prettier";
import prettierPluginSolidity from "prettier-plugin-solidity";
import styled from "styled-components";
import { useTheme, useHighlightSyntax, useAutoExpand } from "../hooks";
import {
  ContentCopy,
  OpenInNew,
  Search,
  ExpandMore,
  ExpandLess,
  UnfoldMore,
} from "@mui/icons-material";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  SvgIcon,
  ToggleButton,
  IconButton,
  InputAdornment,
} from "@mui/material";

const prettierPlugins = [prettierPluginSolidity];

const FileList = styled.div`
  margin-top: 20px;
  display: flex;
  grid-gap: 0px;
  flex-direction: column;
`;

const File = styled.div`
  display: flex;
  justify-content: space-between;
`;

const EditedShift = styled.div`
  position: relative;
  left: 11px;
`;

const EditedIcon = (
  <EditedShift>
    <SvgIcon sx={{ color: "#c7881b", fontSize: 30 }}>
      <path d="M13.25 1c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25V2.75C1 1.784 1.784 1 2.75 1ZM2.75 2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"></path>
    </SvgIcon>
  </EditedShift>
);

const Wrapper = styled.div`
  border-radius: 6px;
  border: 1px solid #30363d;
  left: 0px;
  right: 0px;
  margin-bottom: 30px;
`;

const CollapseWrap = styled.div`
  cursor: pointer;
  display: inline-flex;
  position: relative;
  top: 13px;
  margin-right: 5px;
`;

const Collapse = (
  <CollapseWrap>
    <SvgIcon sx={{ opacity: 0.5, fontSize: 30 }}>
      <path d="m4.177 7.823 2.396-2.396A.25.25 0 0 1 7 5.604v4.792a.25.25 0 0 1-.427.177L4.177 8.177a.25.25 0 0 1 0-.354Z"></path>
      <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25H9.5v-13Zm12.5 13a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11v13Z"></path>
    </SvgIcon>
  </CollapseWrap>
);

const TitleWrapper = styled.div`
  position: relative;
  left: -15px;
  display: inline;
`;

const ShiftRight = styled.div`
  position: relative;
  left: 10px;
`;

const Summary = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
`;
const SearchField = styled.div`
  margin-bottom: 40px;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 1fr;
`;

const SearchIconWrapper = styled.div`
  position: relative;
  width: 15px;
  left: -7px;
`;

const LineChanges = styled.div`
  display: inline-flex;
  align-items: center;
`;

const Contract = styled.div`
  display: grid;
  grid-gap: 5px;
  grid-template-columns: auto 150px;
  width: 100%;
`;

const Padding = styled.div`
  margin: 0px 30px;
  padding-botom: 20px;
  position: absolute;
  left: 0px;
  right: 0px;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 300px auto;
  grid-gap: 20px;
`;

const LeftNav = styled.div``;

const SourceHeader = styled.div`
  background-color: #121519;
  width: 100%;
  line-height: 32px;
  color: white;
  padding: 10px 20px;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
    Liberation Mono, monospace;
  display: flex;
  justify-content: space-between;
`;

let oldCode = `
// SPDX-License-Identifier: GPLv3
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./LERC20Upgradable.sol";

/// @title DEI stablecoin
/// @author DEUS Finance
contract DEIStablecoin is
    Initializable,
    LERC20Upgradable,
    AccessControlUpgradeable
{
           bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    function initialize(
        uint256 totalSupply,
        address admin,
        address recoveryAdmin,
        uint256 timelockPeriod,
        address lossless
    ) public initializer {
        __LERC20_init(
            totalSupply,
            "DEI",
            "DEI",
            admin,
            recoveryAdmin,
            timelockPeriod,
            lossless
        );
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
          _mint(to, amount);
    }

              function burnFrom(address from, uint256 amount)
        public
        onlyRole(BURNER_ROLE)
    {
        _burn(from, amount);
    }
}
`;

let newCode = `
// SPDX-License-Identifier: GPLv3
pragma solidity 0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/draft-ERC20PermitUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./LERC20Upgradable.sol";

/**
 * @title DEI Stablecoin
 * @author DEUS Finance
 * @notice Multichain stablecoin
 */
contract DEIStablecoin is
    Initializable,
    LERC20Upgradable,
    AccessControlUpgradeable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    function initialize(
        uint256 totalSupply,
        address admin,
        address recoveryAdmin,
        uint256 timelockPeriod,
        address lossless
    ) public initializer {
        __LERC20_init(
            totalSupply,
            "DEI",
            "DEI",
            admin,
            recoveryAdmin,
            timelockPeriod,
            lossless
        );
        __AccessControl_init();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
    }

        function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}
`;

const customStyles = {
  codeFoldGutter: {
    // display: "none",
    // display
  },
  codeFold: {
    // backgroundColor: "#0e1623",
    padding: "0px",
    margin: "0px",
  },
};

function App() {
  return <div>sup</div>;
}

export default App;
