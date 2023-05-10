import { useState, useEffect } from "react";
import prettier from "prettier";
import prettierPluginSolidity from "prettier-plugin-solidity";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { mergeDeep } from "../utils/string";
import {
  useSplitView,
  useHideFiles,
  useSelectNetwork1,
  useSelectNetwork2,
  useSelectChains,
  useSelectExplorer1,
  useSelectExplorer2,
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

  const [contracts, setContracts] = useState([]);
  const [filteredContracts, setFilteredContracts] = useState(contracts);
  const [code1, setCode1] = useState([]);
  const [code2, setCode2] = useState([]);

  const [address1State, setAddress1State] = useState({
    valid: false,
    address: "",
  });
  const [address2State, setAddress2State] = useState({
    valid: false,
    address: "",
  });
  const [hasResults, setHasResults] = useState(false);
  const [previousAddress1, setPreviousAddress1] = useState("");
  const [previousAddress2, setPreviousAddress2] = useState("");
  const [previousNetwork1, setPreviousNetwork1] = useState(network1);
  const [previousNetwork2, setPreviousNetwork2] = useState(network2);

  const network1 = useSelectNetwork1();
  const network2 = useSelectNetwork2();
  const chains = useSelectChains();
  const explorer1 = useSelectExplorer1();
  const explorer2 = useSelectExplorer2();

  const hasAddresses = address1State.value !== "" && address2State.value !== "";
  const hasChains = Object.keys(chains).length;
  const addressesValid = address1State.valid && address2State.valid;
  const address1Changed = address1State.value !== previousAddress1;
  const address2Changed = address2State.value !== previousAddress2;

  // Merge sources
  useEffect(() => {
    const code1Mapped = code1.map((code) => ({
      name: code.name,
      source1: code.source,
      address1: code.address,
    }));
    const code2Mapped = code2.map((code) => ({
      name: code.name,
      source2: code.source,
      address2: code.address,
    }));
    const aKeyed = code1Mapped.reduce(
      (acc, cur) => ({ ...acc, [cur.name]: cur }),
      {}
    );
    const bKeyed = code2Mapped.reduce(
      (acc, cur) => ({ ...acc, [cur.name]: cur }),
      {}
    );
    const merged = Object.values(mergeDeep(aKeyed, bKeyed));

    const mergedAndUnique = merged.filter(
      (contracts) =>
        contracts.source1 !== contracts.source2 &&
        contracts.source1 &&
        contracts.source2
    );

    setContracts(mergedAndUnique);
  }, [code1, code2]);

  const delay = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  const getSourceCode = async (field, address) => {
    let explorer;
    if (field === 1) {
      explorer = explorer1;
    } else {
      explorer = explorer2;
    }
    const url = `https://api.${
      new URL(explorer).hostname
    }/api?module=contract&action=getsourcecode&address=${address}`;
    console.log("get", field, address, url);
    let data = await fetch(url).then((res) => res.json());
    console.log("raw resp", data);
    const notOk = data.status === "0";
    if (notOk) {
      await delay(1000);
      console.log("retry");
      getSourceCode(field, address);
      return;
    }
    if (data.result[0].SourceCode === "") {
      console.log("not verified");
      return;
    }
    const dataz = JSON.parse(data.result[0].SourceCode.slice(1, -1)).sources;

    const sources = [];
    for (const [name, sourceObj] of Object.entries(dataz)) {
      const source = sourceObj.content;
      sources.push({ name, source, address });
    }
    if (field === 1) {
      setCode1(sources);
    } else {
      setCode2(sources);
    }
  };

  useEffect(() => {
    if (hasAddresses && hasChains) {
      const addressesChanged = address1Changed || address2Changed;

      if (addressesValid && addressesChanged) {
        setHasResults(true);
      }
      if (address1Changed && address1State.valid) {
        getSourceCode(1, address1State.value);
        setPreviousAddress1(address1State.value);
      }
      if (address2Changed && address2State.valid) {
        getSourceCode(2, address2State.value);
        setPreviousAddress2(address2State.value);
      }
      if (!(address1Changed || address2Changed)) {
        if (network1 !== previousNetwork1) {
          getSourceCode(1, address1State.value);
          setPreviousNetwork1(network1);
        }
        if (network2 !== previousNetwork2) {
          getSourceCode(2, address1State.value);
          setPreviousNetwork1(network1);
        }
      }
      if (address1State.value && address2State.value)
        window.history.replaceState(
          {},
          "",
          `/diff?address1=${address1State.value}&chain1=${network1}&address2=${address2State.value}&chain2=${network2}`
        );
    } else {
      if (hasAddresses) {
        setHasResults(false);
      }
    }
  }, [address1State.value, address2State.value, network1, network2, hasChains]);

  useEffect(() => {
    const added = document.querySelectorAll(
      "[class*='gutter'][class*='diff-added']"
    ).length;
    const removed = document.querySelectorAll(
      "[class*='gutter'][class*='diff-removed']"
    ).length;
    const changed = filteredContracts.length;
    const addedSuffix = added === 0 || added > 1 ? "s" : "";
    const removedSuffix = removed === 0 || removed > 1 ? "s" : "";
    const changedSuffix = changed === 0 || changed > 1 ? "s" : "";
    setChangedText(
      <b>
        {changed} changed file{changedSuffix}
      </b>
    );
    setAddedText(
      <b>
        {added} addition{addedSuffix}
      </b>
    );
    setRemovedText(
      <b>
        {removed} deletion{removedSuffix}
      </b>
    );
  }, [filteredContracts]);

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
  const formatCode = (code) =>
    prettier.format(code, {
      parser: "solidity-parse",
      // eslint-disable-next-line
      plugins: prettierPlugins,
    });

  const diffs =
    filteredContracts &&
    filteredContracts.map((item) => (
      <FileDiff
        key={item.name}
        address1={item.address1 || ""}
        address2={item.address2 || ""}
        fileName={item.name}
        oldCode={item.source1 ? formatCode(item.source1) : ""}
        newCode={item.source2 ? formatCode(item.source2) : ""}
        splitView={splitView}
      />
    ));

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
          <FileList
            hidefiles={hidefiles}
            contracts={contracts}
            filteredContracts={filteredContracts}
            setFilteredContracts={setFilteredContracts}
            setHideFiles={setHideFiles}
          />
          <div>{diffs}</div>
        </Layout>
      </Results>
    </Wrapper>
  );
}

export default App;
