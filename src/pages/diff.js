import stringSimilarity from "string-similarity";
import { uuid as uuidV4 } from "uuidv4";
import { useState, useEffect } from "react";
import prettier from "prettier";
import prettierPluginSolidity from "prettier-plugin-solidity";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { mergeDeep } from "../utils/string";
import Image from "next/image";
import {
  useSplitView,
  useHideFiles,
  useSelectNetwork1,
  useSelectNetwork2,
  useSelectChains,
  useSelectChain1,
  useSelectChain2,
} from "../hooks";

import {
  ToggleButtonGroup,
  SvgIcon,
  ToggleButton,
  Tooltip,
} from "@mui/material";

import { GitHub, Twitter } from "@mui/icons-material";

import { setSplitView, setHideFiles } from "../store/options";
import ChainSelector from "../components/ChainSelector";
import AddressInput from "../components/AddressInput";
import FileList from "../components/FileList";
import FileDiff from "../components/FileDiff";

const prettierPlugins = [prettierPluginSolidity];

const Flag = styled.img`
  height: 24px;
`;

const HeaderLeft = styled.div`
  display: flex;
  grid-gap: 5px;
  align-items: center;
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 30px;
  margin-bottom: 20px;
  @media (max-width: 990px) {
    padding: 10px 10px;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  grid-gap: 10px;
  cursor: pointer;
`;

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
  height: 65px;
  padding-top: 15px;
  padding-bottom: 10px;
  z-index: 1;
  width: 100%;
  padding-left: 30px;
  padding-right: 30px;
  background-color: rgb(13, 17, 23);
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0px;
  @media (max-width: 990px) {
    display: none;
  }
`;

const SearchField = styled.div`
  padding: 0px 30px;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 990px) {
    grid-template-rows: 1fr 1fr;
    grid-template-columns: unset;
    padding: 0px 10px;
  }
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
  @media (max-width: 990px) {
    margin-bottom: 20px;
  }
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
  margin: 0px 30px;
  @media (max-width: 990px) {
    grid-template-columns: auto;
    margin: 0px 10px;
  }
  grid-gap: 20px;
`;

const Results = styled.div`
  display: ${(props) => (props.hide === "true" ? "none" : "")};
  @media (max-width: 990px) {
    margin-top: 20px;
    overflow: auto;
    margin-right: 10px;
  }
`;

const HaventStarted = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  top: 200px;
  @media (max-width: 990px) {
    top: 100px;
  }
  position: relative;
  display: ${(props) => (props.hide === "true" ? "none" : "")};
`;

const HaventStartedText = styled.div`
  font-size: 40px;
  @media (max-width: 990px) {
    font-size: 20px;
  }
`;

const openAddress = (url) => {
  window.open(url, "_blank").focus();
};

function App() {
  const hidefiles = useHideFiles();
  const splitView = useSplitView();
  const dispatch = useDispatch();

  const [addedText, setAddedText] = useState("");
  const [removedText, setRemovedText] = useState("");
  const [changedText, setChangedText] = useState("2 changed files");

  const [fileDiffCounts, setFileDiffCounts] = useState({});
  const [perfectMatch, setPerfectMatch] = useState(false);

  const [helperTextOverride1, setHelperTextOverride1] = useState(null);
  const [helperTextOverride2, setHelperTextOverride2] = useState(null);
  const [errorOverride1, setErrorOverride1] = useState(null);
  const [errorOverride2, setErrorOverride2] = useState(null);

  const [contracts, setContracts] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [filteredContracts, setFilteredContracts] = useState(contracts);
  const [code1, setCode1] = useState([]);
  const [code2, setCode2] = useState([]);
  const width =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  const [mobileMode, setMobileMode] = useState(width <= 990);

  const [timeoutLeft, setTimeoutLeft] = useState();
  const [timeoutRight, setTimeoutRight] = useState();

  const [address1State, setAddress1State] = useState({
    valid: false,
    value: "",
    address: "",
  });
  const [address2State, setAddress2State] = useState({
    valid: false,
    value: "",
    address: "",
  });

  const network1 = useSelectNetwork1();
  const network2 = useSelectNetwork2();

  const [hasResults, setHasResults] = useState(false);
  const [previousAddress1, setPreviousAddress1] = useState("");
  const [previousAddress2, setPreviousAddress2] = useState("");
  const [previousNetwork1, setPreviousNetwork1] = useState(network1);
  const [previousNetwork2, setPreviousNetwork2] = useState(network2);

  const chains = useSelectChains();
  const chain1 = useSelectChain1();
  const chain2 = useSelectChain2();

  const hasChains = Object.keys(chains).length;
  const addressesValid = address1State.valid && address2State.valid;

  const handleScroll = () => {
    if (filteredContracts && !filteredContracts.length) {
      return;
    }
    const summaryBar = document.getElementById("summary-bar");
    const filelist = document.getElementById("filelist");
    const summaryBarRect = summaryBar.getBoundingClientRect();
    filelist.setAttribute(
      "style",
      `height: calc(100vh - 79px - 61px - ${summaryBarRect.top}px`
    );
  };

  const handleResize = () => {
    const width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    if (width <= 990) {
      setMobileMode(true);
    } else {
      setMobileMode(false);
    }
  };

  useEffect(() => {
    setInitialLoad(true);
    setTimeout(() => {
      setInitialLoad(false);
    }, 300);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    handleScroll();
  });

  // Initial network state
  useEffect(() => {
    if (!previousNetwork1 && network1) {
      setPreviousNetwork1(network1);
    }
    if (!previousNetwork2 && network2) {
      setPreviousNetwork2(network2);
    }
  }, [network1, network2]);

  // Merge sources
  useEffect(() => {
    if (!(code1 && code1.length && code2 && code2.length)) {
      return;
    }

    const diffTree = {};

    for (const _code1 of code1) {
      let highestSimilarity = 0;
      let matchingFile;
      for (const _code2 of code2) {
        const similarity = stringSimilarity.compareTwoStrings(
          formatCode(_code1.source),
          formatCode(_code2.source)
        );

        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
          matchingFile = { ..._code2 };
        }
      }
      const uuid = uuidV4();
      if (highestSimilarity < 0.5) {
        matchingFile = null;
      }
      const obj = {
        name: _code1.name,
        address1: _code1.address,
        address2: matchingFile && matchingFile.address,
        source1: _code1.source,
        source2: matchingFile && matchingFile.source,
        similarity: highestSimilarity,
      };
      diffTree[uuid] = obj;
    }

    for (const _code2 of code2) {
      let highestSimilarity = 0;
      for (const _code1 of code1) {
        const similarity = stringSimilarity.compareTwoStrings(
          formatCode(_code1.source),
          formatCode(_code2.source)
        );

        if (similarity > highestSimilarity) {
          highestSimilarity = similarity;
        }
      }
      const uuid = uuidV4();
      if (highestSimilarity < 0.5) {
        const obj = {
          name: _code2.name,
          address2: _code2.address,
          source2: _code2.source,
          similarity: 0,
        };
        diffTree[uuid] = obj;
      }
    }

    const merged = Object.values(diffTree);

    let mergedAndUnique = merged.filter((contracts) =>
      contracts.source1 && contracts.source2
        ? formatCode(contracts.source1) !== formatCode(contracts.source2)
        : contracts
    );

    setContracts(mergedAndUnique);
    if (Object.keys(mergedAndUnique).length === 0) {
      setPerfectMatch(true);
    } else {
      setPerfectMatch(false);
    }
  }, [code1, code2]);

  const delay = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  const clearAddressHelper1 = () => {
    setHelperTextOverride1("");
    setErrorOverride1(false);
  };

  const clearAddressHelper2 = () => {
    setHelperTextOverride2("");
    setErrorOverride2(false);
  };

  const setHelperTextOverride1Fn = (msg) => {
    setHelperTextOverride1(msg);
    clearTimeout(timeoutLeft);
  };

  const setHelperTextOverride2Fn = (msg) => {
    setHelperTextOverride2(msg);
    clearTimeout(timeoutRight);
  };

  const getSourceCode = async (field, address) => {
    let explorerApi;

    let apiKey;
    if (field === 1) {
      apiKey = chain1.apiKey;
      setErrorOverride1(false);
      setHelperTextOverride1Fn("Loading...");
      explorerApi = chain1.explorerApiUrl;
    } else {
      apiKey = chain2.apiKey;
      setErrorOverride2(false);
      setHelperTextOverride2Fn("Loading...");
      explorerApi = chain2.explorerApiUrl;
    }
    const api = apiKey ? `&apiKey=${apiKey}` : "";

    const url = `${explorerApi}/api?module=contract&action=getsourcecode&address=${address}${api}`;

    let data = await fetch(url).then((res) => res.json());
    // console.log("raw resp", data);
    const notOk = data.status === "0";
    if (notOk) {
      await delay(1000);
      console.log("retry");
      getSourceCode(field, address);
      return;
    }
    const notVerified = "Source not verified";
    if (data.result[0].SourceCode === "") {
      if (field === 1) {
        setErrorOverride1(true);
        setHelperTextOverride1Fn(notVerified);
      } else {
        setErrorOverride2(true);
        setHelperTextOverride2Fn(notVerified);
      }
      return;
    }
    if (!(data.result && data.result[0] && data.result[0].SourceCode)) {
      if (field === 1) {
        setErrorOverride1(true);
        setHelperTextOverride1Fn(notVerified);
      } else {
        setErrorOverride2(true);
        setHelperTextOverride2Fn(notVerified);
      }
      return;
    }

    if (field === 1) {
      setErrorOverride1(false);
      setHelperTextOverride1("Successfully loaded contract");
      setTimeoutLeft(
        setTimeout(() => {
          setHelperTextOverride1(null);
        }, 3000)
      );
    } else {
      setErrorOverride2(false);
      setHelperTextOverride2("Successfully loaded contract");
      setTimeoutRight(
        setTimeout(() => {
          setHelperTextOverride2(null);
        }, 3000)
      );
    }

    let contractData = {};
    try {
      contractData = JSON.parse(data.result[0].SourceCode.slice(1, -1)).sources;
    } catch (e) {
      const firstResult = data.result[0];
      if (typeof firstResult.SourceCode === "string") {
        contractData[firstResult.ContractName] = {
          content: firstResult.SourceCode,
        };
      } else {
        contractData = JSON.parse(data.result[0].SourceCode);
      }
    }

    const sources = [];
    for (const [name, sourceObj] of Object.entries(contractData)) {
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
    const address1Changed = address1State.value !== previousAddress1;
    const address2Changed = address2State.value !== previousAddress2;
    const network1Changed = network1 !== previousNetwork1;
    const network2Changed = network2 !== previousNetwork2;

    if (address1Changed && address1State.valid && hasChains) {
      getSourceCode(1, address1State.value);
      setPreviousAddress1(address1State.value);
    } else if (network1Changed) {
      setPreviousNetwork1(network1);
      if (address1State.valid) {
        getSourceCode(1, address1State.value);
      }
    }
    if (address2Changed && address2State.valid && hasChains) {
      getSourceCode(2, address2State.value);
      setPreviousAddress2(address2State.value);
    } else if (network2Changed) {
      setPreviousNetwork2(network2);
      if (address2State.valid) {
        getSourceCode(2, address2State.value);
      }
    }

    if (address1State.value && address2State.value)
      window.history.replaceState(
        {},
        "",
        `/diff?address1=${address1State.value}&chain1=${network1}&address2=${address2State.value}&chain2=${network2}`
      );
    const hasAddresses =
      address1State.value !== "" && address2State.value !== "";
    if (hasAddresses && hasChains) {
      const address1Changed = address1State.value !== previousAddress1;
      const address2Changed = address2State.value !== previousAddress2;
      const addressesChanged = address1Changed || address2Changed;

      if (addressesValid && addressesChanged) {
        setHasResults(true);
      }
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

    let addedRemoved = {};
    filteredContracts.forEach(({ name, source1, source2 }) => {
      const removedForFile = document
        .getElementById(name)
        .querySelectorAll("[class*='gutter'][class*='diff-removed']").length;
      const addedForFile = document
        .getElementById(name)
        .querySelectorAll("[class*='gutter'][class*='diff-added']").length;
      let modificationType;
      if (source1 && !source2) {
        modificationType = "removed";
      } else if (!source1 && source2) {
        modificationType = "added";
      } else if (source1 !== source2) {
        modificationType = "modified";
      }
      addedRemoved[name] = {
        added: addedForFile,
        removed: removedForFile,
        modificationType,
      };
    });
    setFileDiffCounts(addedRemoved);

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
        similarity={item.similarity}
        oldCode={item.source1 ? formatCode(item.source1) : ""}
        newCode={item.source2 ? formatCode(item.source2) : ""}
        splitView={mobileMode ? false : splitView}
      />
    ));

  return (
    <Wrapper>
      <Header>
        <HeaderLeft onClick={() => openAddress("/")}>
          <Flag src="inverted_flag.png" alt="logo" />
          <div>x48.tools</div>
        </HeaderLeft>
        <HeaderRight>
          <GitHub
            sx={{ fontSize: 24 }}
            onClick={() =>
              openAddress("https://github.com/x48115/contract-diff-tool")
            }
          />
          <Image
            src="/discord_logo.svg"
            width="24"
            height="24"
            alt="Discord"
            onClick={() => openAddress("https://discord.gg/KPhtdR7m2m")}
          />
          <Twitter
            sx={{ fontSize: 24 }}
            onClick={() => openAddress("https://twitter.com/x48_crypto")}
          />
        </HeaderRight>
      </Header>
      <SearchField>
        <Contract>
          <AddressInput
            label="Address 1"
            addressState={address1State}
            setAddressState={setAddress1State}
            field={1}
            helperTextOverride={helperTextOverride1}
            errorOverride={errorOverride1}
            clearAddressHelper={clearAddressHelper1}
          />
          <ChainSelector field={1} />
        </Contract>
        <Contract>
          <AddressInput
            label="Address 2"
            addressState={address2State}
            setAddressState={setAddress2State}
            field={2}
            helperTextOverride={helperTextOverride2}
            errorOverride={errorOverride2}
            clearAddressHelper={clearAddressHelper2}
          />
          <ChainSelector field={2} />
        </Contract>
      </SearchField>
      <HaventStarted
        hide={
          initialLoad ||
          (hasResults && !errorOverride1 && !errorOverride2) ||
          helperTextOverride1 == "Loading..." ||
          helperTextOverride2 === "Loading..."
            ? "true"
            : "false"
        }
      >
        <HaventStartedText>
          {(errorOverride1 && helperTextOverride1) ||
            (errorOverride2 && helperTextOverride2) ||
            "Enter contract addresses above"}
        </HaventStartedText>
      </HaventStarted>
      <HaventStarted
        hide={
          initialLoad ||
          errorOverride1 ||
          errorOverride2 ||
          helperTextOverride1 === "Loading..." ||
          helperTextOverride2 === "Loading..." ||
          !perfectMatch
            ? "true"
            : "false"
        }
      >
        <HaventStartedText>Contracts are identical</HaventStartedText>
      </HaventStarted>
      <HaventStarted
        hide={
          (initialLoad ||
            helperTextOverride1 === "Loading..." ||
            helperTextOverride2 === "Loading...") &&
          !perfectMatch
            ? "false"
            : "true"
        }
      >
        <HaventStartedText>
          <span className="loader"></span>
        </HaventStartedText>
      </HaventStarted>
      <Results
        hide={
          perfectMatch ||
          initialLoad ||
          !hasResults ||
          errorOverride1 ||
          errorOverride2 ||
          helperTextOverride1 === "Loading..." ||
          helperTextOverride2 === "Loading..."
            ? "true"
            : "false"
        }
      >
        <Summary id="summary-bar">
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
            fileDiffCounts={fileDiffCounts}
          />
          <div>{diffs}</div>
        </Layout>
      </Results>
    </Wrapper>
  );
}

export default App;
