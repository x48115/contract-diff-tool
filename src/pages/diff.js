import { useState, useEffect } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import prettier from "prettier";
import prettierPluginSolidity from "prettier-plugin-solidity";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useSplitView, useHideFiles, useTheme } from "../hooks";
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
  Tooltip,
} from "@mui/material";

import { setSplitView, setHideFiles } from "../store/options";
import ChainSelector from "../components/ChainSelector";

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
  overflow: hidden;
  border: 1px solid #30363d;
  left: 0px;
  right: 0px;
  margin-bottom: 30px;
`;

const Source = styled.div``;

const CollapseAndText = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
`;
const CollapseWrap = styled.div`
  cursor: pointer;
  display: inline-flex;
  position: relative;
  top: -2px;
  margin-right: 15px;
  opacity: 0.5;
  &:hover {
    opacity: 1;
  }
  transform: ${(props) => (props.hidefiles === "true" ? "rotate(180deg)" : "")};
`;

const TitleWrapper = styled.div`
  position: relative;
  left: 0px;
  display: inline;
`;

const ShiftRight = styled.div`
  position: relative;
  left: 10px;
`;

const Summary = styled.div`
  padding-bottom: 20px;
  padding-top: 20px;
  height: 79px;
  z-index: 1;
  width: 100%;
  padding-left: 30px;
  padding-right: 30px;
  background-color: rgb(13, 17, 23);
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0px;
`;

const SearchField = styled.div`
  padding: 0px 30px;
  margin-top: 30px;
  margin-bottom: 20px;
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
  margin: 0px 0px;
  padding-botom: 20px;
  position: absolute;
  left: 0px;
  right: 0px;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.hidefiles === "true" ? "auto" : "300px auto"};
  grid-gap: 20px;
  margin: 0px 30px;
`;

const LeftNav = styled.div`
  width: 290px;
  height: 79px;
  position: sticky;
  top: 79px;
  display: ${(props) => (props.hidefiles === "true" ? "none" : "auto")};
`;

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
  const hidefiles = useHideFiles();
  const splitView = useSplitView();
  const dispatch = useDispatch();

  const [addedText, setAddedText] = useState("");
  const [removedText, setRemovedText] = useState("");
  const [changedText, setChangedText] = useState("2 changed files");

  useEffect(() => {
    const added = document.querySelectorAll(
      "[class*='gutter'][class*='diff-added']"
    ).length;
    const removed = document.querySelectorAll(
      "[class*='gutter'][class*='diff-removed']"
    ).length;
    const addedSuffix = added === 0 || added > 1 ? "s" : "";
    const removedSuffix = removed === 0 || removed > 1 ? "s" : "";
    setChangedText(<b>2 changed files</b>);
    setAddedText(<b>{`${added} addition${addedSuffix}`}</b>);
    setRemovedText(<b>{`${removed} deletion${removedSuffix}`}</b>);
  }, []);

  const toggleHideFiles = () => {
    dispatch(setHideFiles(hidefiles === "true" ? "fasle" : "true"));
  };

  const Collapse = (
    <Tooltip
      title={hidefiles === "true" ? " Show files" : " Hide files"}
      placement="top"
    >
      <CollapseWrap onClick={toggleHideFiles} hidefiles={hidefiles}>
        <SvgIcon
          sx={{ fontSize: 30, width: "23px", height: "23px" }}
          viewBox="0 0 16 16"
        >
          <path d="m4.177 7.823 2.396-2.396A.25.25 0 0 1 7 5.604v4.792a.25.25 0 0 1-.427.177L4.177 8.177a.25.25 0 0 1 0-.354Z"></path>
          <path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v12.5A1.75 1.75 0 0 1 14.25 16H1.75A1.75 1.75 0 0 1 0 14.25Zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25H9.5v-13Zm12.5 13a.25.25 0 0 0 .25-.25V1.75a.25.25 0 0 0-.25-.25H11v13Z"></path>
        </SvgIcon>
      </CollapseWrap>
    </Tooltip>
  );

  const codeFoldMessageRenderer = (str) => {
    return (
      <Tooltip title="Expand" placement="top">
        <IconButton size="small" edge="end">
          <UnfoldMore sx={{ fontSize: 24 }} />
        </IconButton>
      </Tooltip>
    );
  };
  // eslint-disable-next-line
  const highlightSyntax = (str) => (
    <pre
      style={{ display: "inline" }}
      dangerouslySetInnerHTML={{
        // eslint-disable-next-line
        __html: Prism.highlight(str || "", Prism.languages.solidity),
      }}
    />
  );

  const onViewChange = (evt) => {
    dispatch(setSplitView(evt.target.value === "split" ? true : false));
  };

  // eslint-disable-next-line
  oldCode = prettier.format(oldCode, {
    parser: "solidity-parse",
    // eslint-disable-next-line
    plugins: prettierPlugins,
  });
  // eslint-disable-next-line
  newCode = prettier.format(newCode, {
    parser: "solidity-parse",
    // eslint-disable-next-line
    plugins: prettierPlugins,
  });
  return (
    <Padding>
      <SearchField>
        <Contract>
          <TextField
            id="outlined-basic"
            label="Address 1"
            size="small"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              placeholder: "0x...",
              endAdornment: (
                <ShiftRight>
                  <InputAdornment position="start">
                    <Tooltip title="Copy">
                      <IconButton
                        aria-label="copy"
                        size="small"
                        edge="end"
                        tooltip={
                          <div>
                            First Line
                            <br />
                            Second Line
                          </div>
                        }
                        tooltipPosition="top-center"
                      >
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
          <ChainSelector />
        </Contract>
        <Contract>
          <TextField
            id="outlined-basic"
            label="Address 2"
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
                    <Tooltip title="View in explorer" placement="top">
                      <IconButton aria-label="open" size="small" edge="end">
                        <OpenInNew sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                </ShiftRight>
              ),
            }}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Network</InputLabel>
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Network"
              value={1}
            >
              <MenuItem value={1}>Ethereum</MenuItem>
              <MenuItem value={20}>Fantom</MenuItem>
            </Select>
          </FormControl>
        </Contract>
      </SearchField>
      <Summary>
        <CollapseAndText>
          {Collapse}

          <LineChanges>
            <div>
              Showing {changedText} with {addedText} and {removedText}.
            </div>
          </LineChanges>
        </CollapseAndText>
        <ToggleButtonGroup
          size="small"
          value={splitView ? "split" : "unified"}
          exclusive
          aria-label="Platform"
          onChange={onViewChange}
        >
          <ToggleButton sx={{ paddingLeft: 2, paddingRight: 2 }} value="split">
            Split
          </ToggleButton>
          <ToggleButton
            sx={{ paddingRight: 2, paddingLeft: 2 }}
            value="unified"
          >
            Unified
          </ToggleButton>
        </ToggleButtonGroup>
      </Summary>
      <Layout hidefiles={hidefiles}>
        <LeftNav hidefiles={hidefiles}>
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
          <FileList>
            <File>
              <div>LDEI.sol</div>
              {EditedIcon}
            </File>
            <File>
              <div>LERC20Upgradable.sol</div>
              {EditedIcon}
            </File>
          </FileList>
        </LeftNav>
        <Source>
          <Wrapper>
            <SourceHeader>
              <div>
                <Tooltip title="Close" placement="top">
                  <IconButton
                    sx={{
                      position: "relative",
                      height: 30,
                      width: 30,
                      left: -10,
                    }}
                  >
                    <ExpandMore
                      sx={{
                        fontSize: 30,
                        opacity: 0.5,
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Expand all" placement="top">
                  <IconButton
                    sx={{
                      position: "relative",
                      left: -10,
                      height: 30,
                      width: 30,
                    }}
                  >
                    <UnfoldMore
                      sx={{
                        fontSize: 24,
                        opacity: 0.5,
                      }}
                    />
                  </IconButton>
                </Tooltip>
                <TitleWrapper>LDEI.sol</TitleWrapper>
              </div>
              <Tooltip title="Copy" placement="top">
                <IconButton
                  aria-label="copy"
                  sx={{ position: "relative", left: 12, height: 35, width: 35 }}
                >
                  <ContentCopy sx={{ opacity: 0.5, fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </SourceHeader>
            <ReactDiffViewer
              oldValue={oldCode}
              newValue={newCode}
              splitView={splitView}
              showDiffOnly={true}
              useDarkTheme={true}
              renderContent={highlightSyntax}
              codeFoldMessageRenderer={codeFoldMessageRenderer}
              styles={customStyles}
            />
          </Wrapper>
          <Wrapper>
            <SourceHeader>
              <div>LDEI.sol</div>
              <Tooltip title="Copy">
                <IconButton size="small">
                  <ContentCopy fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </SourceHeader>
            <ReactDiffViewer
              oldValue={oldCode}
              newValue={newCode}
              splitView={splitView}
              showDiffOnly={true}
              useDarkTheme={true}
              renderContent={highlightSyntax}
              codeFoldMessageRenderer={codeFoldMessageRenderer}
              styles={customStyles}
            />
          </Wrapper>
        </Source>
      </Layout>
    </Padding>
  );
}

export default App;
