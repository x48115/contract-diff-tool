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
`;

const FileInfo = styled.div`
  width: 100%;
  display: flex;
  height: 40px;
  align-items: center;
  padding-left: 20px;
  color: #555;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  margin-bottom: 20px;
  border-radius: 6px;
  border: 1px solid #30363d;
  overflow: hidden;
`;

const HideIfCollapsed = styled.div`
  display: ${(props) => (props.collapsed ? "none" : "")};
`;

const customStyles = {
  codeFold: {
    padding: "0px",
    margin: "0px",
  },
};

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const ExpandMoreWrap = styled.div`
  display: inline-block;
  transform: ${(props) => (props.collapsed ? "rotate(180deg)" : "")};
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

export default ({ oldCode, newCode, splitView, fileName }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandAll, setExpandAll] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Wrapper>
      <SourceHeader>
        <div>
          <Tooltip
            title={collapsed ? "Show file" : "Hide file"}
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
                  transform: `${collapsed ? "rotate(180deg)" : ""}`,
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
        <FileInfos>
          <FileInfo>
            <div>
              {shortenAddress("0xde1e704dae0b4051e80dabb26ab6ad6c12262da0", 10)}
            </div>
            <Tooltip title="File Menu" placement="top">
              <FileMore>
                <IconButton size="small" edge="end">
                  <MoreHoriz sx={{ fontSize: 24 }} />
                </IconButton>
              </FileMore>
            </Tooltip>
          </FileInfo>{" "}
          <FileInfo>
            <div>
              {shortenAddress("0xde1e704dae0b4051e80dabb26ab6ad6c12262da0", 10)}
            </div>
            <Tooltip title="File Menu" placement="top">
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
              </Tooltip>
            </Tooltip>
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
