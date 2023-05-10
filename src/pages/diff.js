import { useState, useEffect } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";
import prettier from "prettier";
import prettierPluginSolidity from "prettier-plugin-solidity";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import {
  useSplitView,
  useHideFiles,
  useSelectNetwork1,
  useSelectNetwork2,
  useSelectChains,
} from "../hooks";

import {
  ToggleButtonGroup,
  SvgIcon,
  ToggleButton,
  Tooltip,
} from "@mui/material";

import { setSplitView, setHideFiles } from "../store/options";
import ChainSelector from "../components/ChainSelector";
import AddressInput from "../components/AddressInput";
import FileList from "../components/FileList";
import FileDiff from "../components/FileDiff";

const prettierPlugins = [prettierPluginSolidity];

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

const Wrapper = styled.div`
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

const Results = styled.div`
  display: ${(props) => (props.hide === "true" ? "none" : "")};
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

const HaventStarted = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  top: 200px;
  position: relative;
  display: ${(props) => (props.hide === "true" ? "none" : "")};
`;

const HaventStartedText = styled.div`
  font-size: 40px;
`;

function App() {
  const hidefiles = useHideFiles();
  const splitView = useSplitView();
  const dispatch = useDispatch();

  const [addedText, setAddedText] = useState("");
  const [removedText, setRemovedText] = useState("");
  const [changedText, setChangedText] = useState("2 changed files");
  const [contracts, setContracts] = useState({});

  const [address1State, setAddress1State] = useState({
    valid: false,
    address: "",
  });
  const [address2State, setAddress2State] = useState({
    valid: false,
    address: "2",
  });

  const network1 = useSelectNetwork1();
  const network2 = useSelectNetwork2();
  const chains = useSelectChains();

  const chainsLength = Object.keys(chains).length;
  useEffect(() => {
    if (address1State.value && address2State.value && chainsLength) {
      console.log("trite dog", network2);
      window.history.replaceState(
        {},
        "",
        `/diff?address1=${address1State.value}&chain1=${network1}&address2=${address2State.value}&chain2=${network2}`
      );
    }
  }, [
    address1State.value,
    address2State.value,
    network1,
    network2,
    chainsLength,
  ]);

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

  const hasResults = !(address1State.valid && address2State.valid);

  return (
    <Wrapper>
      <SearchField>
        <Contract>
          <AddressInput
            label="Address 1"
            addressState={address1State}
            setAddressState={setAddress1State}
            field={1}
          />
          <ChainSelector field={1} />
        </Contract>
        <Contract>
          <AddressInput
            label="Address 2"
            addressState={address2State}
            setAddressState={setAddress2State}
            field={2}
          />
          <ChainSelector field={2} />
        </Contract>
      </SearchField>
      <HaventStarted hide={hasResults ? "true" : "false"}>
        <HaventStartedText>Enter contract addresses above</HaventStartedText>
      </HaventStarted>
      <Results hide={!hasResults ? "true" : "false"}>
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
            <ToggleButton
              sx={{ paddingLeft: 2, paddingRight: 2 }}
              value="split"
            >
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
          <FileList hidefiles={hidefiles} setHideFiles={setHideFiles} />
          <div>
            <FileDiff
              fileName="LDEI.sol"
              oldCode={oldCode}
              newCode={newCode}
              splitView={splitView}
            />
            <FileDiff
              fileName="LDEIUpgradeable.sol"
              oldCode={oldCode}
              newCode={newCode}
              splitView={splitView}
            />
          </div>
        </Layout>
      </Results>
    </Wrapper>
  );
}

export default App;
