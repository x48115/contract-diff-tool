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
  Code,
  Download,
  MoreHoriz,
  ContentCopy,
  CopyAll,
  OpenInNew,
} from "@mui/icons-material";
import { useState } from "react";
import { shortenAddress } from "../utils/string";

const TitleWrapper = styled.div`
  position: relative;
  left: 0px;
  display: inline;
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

const FileHeader = styled.div`
  background-color: #121519;
  width: 100%;
  line-height: 32px;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
    Liberation Mono, monospace;
`;

const FileInfos = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  background-color: #222;
  display: ${(props) => (props.splitview === "true" ? "" : "none")};
`;

const FileInfo = styled.div`
  width: 100%;
  display: flex;
  height: 40px;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  color: #555;
  justify-content: space-between;
  &:first-of-type {
    border-right: 1px solid #292929;
  }
`;

const Wrapper = styled.div`
  margin-bottom: 20px;
  border-radius: 6px;
  border: 1px solid #30363d;
  overflow: hidden;
`;

const HideIfCollapsed = styled.div`
  display: ${(props) => (props.collapsed === "true" ? "none" : "")};
`;

const customStyles = {
  codeFold: {
    padding: "0px",
    margin: "0px",
  },
};

const OverflowHidden = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
`;

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

export default ({
  oldCode,
  newCode,
  splitView,
  fileName,
  address1,
  address2,
}) => {
  const [collapsed, setCollapsed] = useState("false");
  const [expandAll, setExpandAll] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(collapsed === "true" ? "false" : "true");
  };

  return (
    <Wrapper id={fileName}>
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
          <TitleWrapper>{fileName}</TitleWrapper>
        </div>
      </SourceHeader>
      <FileHeader>
        <FileInfos splitview={splitView.toString()}>
          <FileInfo>
            <OverflowHidden>{address1}</OverflowHidden>
          </FileInfo>
          <FileInfo>
            <OverflowHidden>{address2}</OverflowHidden>
            {/* <Tooltip
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
                      <ListItemButton>
                        <ListItemIcon>
                          <ContentCopy />
                        </ListItemIcon>
                        <ListItemText primary="Copy file" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <CopyAll />
                        </ListItemIcon>
                        <ListItemText primary="Copy flattened files" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <OpenInNew />
                        </ListItemIcon>
                        <ListItemText primary="View in explorer" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <Code />
                        </ListItemIcon>
                        <ListItemText primary="Open in remix" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <Download />
                        </ListItemIcon>
                        <ListItemText primary="Download all files" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem>
                      <ListItemButton>
                        <ListItemIcon>
                          <Download />
                        </ListItemIcon>
                        <ListItemText primary="Download flattened files" />
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
            </Tooltip> */}
          </FileInfo>
        </FileInfos>
      </FileHeader>
      <HideIfCollapsed collapsed={collapsed}>
        <ReactDiffViewer
          oldValue={oldCode}
          newValue={newCode}
          splitView={splitView}
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
