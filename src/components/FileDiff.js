import styled from "styled-components";
import ReactDiffViewer from "react-diff-viewer-continued";
import {
  List,
  ListItemButton,
  ListItemText,
  ListItem,
  ListItemIcon,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  ExpandMore,
  UnfoldMore,
  Download,
  MoreHoriz,
  ContentCopy,
  CopyAll,
  OpenInNew,
} from "@mui/icons-material";
import { useState } from "react";
import {
  useSelectExplorer1,
  useSelectExplorer2,
  useSelectSelectedFile,
} from "../hooks";
import { shortenAddress } from "../utils/string";

const TitleWrapper = styled.div`
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  left: 80px;
  position: absolute;
  right: 30px;
`;

const AddressWrap = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgb(153, 153, 153);
  left: 5px;
  position: relative;
  height: 25px;
`;

const MoreWrap = styled.div`
  position: absolute;
  right: 0px;
  top: -4px;
`;

const AddressTitleWrap = styled.div`
  position: absolute;
  left: 0;
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
  position: relative;
  justify-content: space-between;
`;

const FileMore = styled.div`
  padding-right: 10px;
  opacity: 0.5;
`;

const Wrapper = styled.div`
  margin-bottom: 20px;
  border-radius: 6px;
  border: ${(props) =>
    props.selected ? "2px solid #2f81f7" : "1px solid #30363d"};
  overflow: hidden;
`;

const HideIfCollapsed = styled.div`
  display: ${(props) => (props.collapsed === "true" ? "none" : "")};
`;

const customStyles = {
  // diffContainer: { padding: '0px', margin: '0px' },
  diffRemoved: {
    'padding-top': '0px',
    'padding-bottom': '0px',
    'margin-top': '0px',
    'margin-bottom': '0px',
  },
  diffAdded: {
    'padding-top': '0px',
    'padding-bottom': '0px',
    'margin-top': '0px',
    'margin-bottom': '0px',
  },
  // marker: { padding: '0px', margin: '0px' },
  // emptyGutter: { padding: '0px', margin: '0px' },
  highlightedLine: { padding: '0px', margin: '0px' },
  // lineNumber: { padding: '0px', margin: '0px' },
  // highlightedGutter: { padding: '0px', margin: '0px' },
  // contentText: { padding: '0px', margin: '0px' },
  // gutter: { padding: '0px', margin: '0px' },
  // line: { padding: '0px', margin: '0px' },
  wordDiff: { padding: '0px', margin: '0px' },
  wordAdded: { padding: '0px', margin: '0px' },
  wordRemoved: { padding: '0px', margin: '0px' },
  // codeFoldGutter: { padding: '0px', margin: '0px' },
  codeFold: { padding: '0px', margin: '0px' },
  // emptyLine: { padding: '0px', margin: '0px' },
  // content: { padding: '0px', margin: '0px' },
  // titleBlock: { padding: '0px', margin: '0px' },
  // splitView: { padding: '0px', margin: '0px' },
};

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

const copy = (text) => {
  navigator.clipboard.writeText(text);
};

// Remove all comments and reduce 2+ new lines to 1 new line
const removeCommentsAndExtraLines = str => str.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//gm, '').replace(/\n{2,}/g, '\n').trim();


export default ({
  oldCode,
  newCode,
  splitView,
  fileName,
  address1,
  address2,
  similarity,
}) => {
  const [collapsed, setCollapsed] = useState("false");
  const [expandAll, setExpandAll] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(collapsed === "true" ? "false" : "true");
  };

  const explorer1 = useSelectExplorer1();
  const explorer2 = useSelectExplorer2();

  const renderAddress = (address, field, source) => (
    <AddressWrap>
      <AddressTitleWrap title={address}>
        {shortenAddress(address, 10)}
      </AddressTitleWrap>
      {address && (
        <MoreWrap>
          <Tooltip
            arrow
            PopperProps={{
              sx: {
                "& .MuiTooltip-tooltip": {
                  bgcolor: "background.paper",
                },
                "& .MuiTooltip-arrow": {
                  bgcolor: "transparent",
                  color: "black",
                },
                "& .MuiTooltip-tooltip li": {
                  padding: 0,
                },
              },
            }}
            title={
              <Box>
                <List component="nav" aria-label="secondary mailbox folder">
                  <ListItem>
                    <ListItemButton
                      autoFocus
                      sx={{
                        height: "0px",
                        width: "0px",
                        position: "absolute",
                        pointerEvents: "none",
                        opacity: "0",
                      }}
                    />
                    <ListItemButton onClick={() => copy(source)}>
                      <ListItemIcon>
                        <ContentCopy />
                      </ListItemIcon>
                      <ListItemText primary="Copy file" />
                    </ListItemButton>
                  </ListItem>

                  <ListItem>
                    <ListItemButton
                      onClick={() => {
                        window
                          .open(
                            `${
                              field === 1 ? explorer1 : explorer2
                            }/address/${address}#code`,
                            "_blank"
                          )
                          .focus();
                      }}
                    >
                      <ListItemIcon>
                        <OpenInNew />
                      </ListItemIcon>
                      <ListItemText primary="View in explorer" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            }
          >
            <FileMore>
              <IconButton size="small" edge="end">
                <MoreHoriz sx={{ fontSize: 24 }} />
              </IconButton>
            </FileMore>
          </Tooltip>
        </MoreWrap>
      )}
    </AddressWrap>
  );

  const selectedFile = useSelectSelectedFile();
  return (
    <Wrapper id={fileName} selected={fileName === selectedFile}>
      <SourceHeader>
        <div>
          <Tooltip
            title={collapsed === "true" ? "Show file" : "Hide file"}
            placement="top"
          >
            <IconButton
              sx={{
                position: "relative",
                height: 30,
                width: 30,
                left: -10,
              }}
              onClick={toggleCollapsed}
            >
              <ExpandMore
                sx={{
                  fontSize: 30,
                  opacity: 0.5,
                  transform: `${collapsed === "true" ? "rotate(180deg)" : ""}`,
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
              onClick={() => setExpandAll(true)}
            >
              <UnfoldMore
                sx={{
                  fontSize: 24,
                  opacity: 0.5,
                }}
              />
            </IconButton>
          </Tooltip>
          <TitleWrapper title={fileName}>
            {fileName} ({(similarity * 100).toFixed(0)}% match)
          </TitleWrapper>
        </div>
      </SourceHeader>

      <HideIfCollapsed collapsed={collapsed}>
        <ReactDiffViewer
          oldValue={removeCommentsAndExtraLines(oldCode)}
          newValue={removeCommentsAndExtraLines(newCode)}
          splitView={splitView}
          leftTitle={
            splitView ? renderAddress(address1, 1, oldCode) : undefined
          }
          rightTitle={
            splitView ? renderAddress(address2, 2, newCode) : undefined
          }
          showDiffOnly={!expandAll}
          useDarkTheme={true}
          renderContent={highlightSyntax}
          codeFoldMessageRenderer={codeFoldMessageRenderer}
          styles={customStyles}
        />
      </HideIfCollapsed>
    </Wrapper>
  );
};
