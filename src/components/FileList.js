import { SvgIcon } from "@mui/material";
import styled from "styled-components";
import Filter from "./Filter";
import { getEndOfPath, highlight } from "../utils/string";
import { useState } from "react";
import { setSelectedFile } from "../store/options";
import { useDispatch } from "react-redux";

const LeftNav = styled.div`
  width: 290px;
  height: 79px;
  position: sticky;
  top: 79px;
  display: ${(props) => (props.hidefiles === "true" ? "none" : "grid")};

  @media (max-width: 990px) {
    display: none;
  }
  grid-template-rows: 60px auto;
`;

const FileList = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
`;

const FileHeader = styled.div`
  height: 35px;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
  user-select: none;
  align-items: center;
  padding: 0px 10px;
`;

const FileName = styled.div`
  > div {
    max-width: 220px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const EditedShift = styled.div`
  position: relative;
  left: 11px;
  top: 7px;
`;

const EditedIcon = (
  <EditedShift>
    <SvgIcon sx={{ color: "#c7881b", fontSize: 30 }}>
      <path d="M13.25 1c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25V2.75C1 1.784 1.784 1 2.75 1ZM2.75 2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"></path>
    </SvgIcon>
  </EditedShift>
);

const AddedIcon = (
  <EditedShift>
    <SvgIcon sx={{ color: "#64b75d", fontSize: 30 }}>
      <path d="M2.75 1h10.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25V2.75C1 1.784 1.784 1 2.75 1Zm10.5 1.5H2.75a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25ZM8 4a.75.75 0 0 1 .75.75v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5A.75.75 0 0 1 8 4Z"></path>
    </SvgIcon>
  </EditedShift>
);

const RemovedIcon = (
  <EditedShift>
    <SvgIcon sx={{ color: "#e55e51", fontSize: 30 }}>
      <path d="M13.25 1c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 15H2.75A1.75 1.75 0 0 1 1 13.25V2.75C1 1.784 1.784 1 2.75 1ZM2.75 2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V2.75a.25.25 0 0 0-.25-.25Zm8.5 6.25h-6.5a.75.75 0 0 1 0-1.5h6.5a.75.75 0 0 1 0 1.5Z"></path>
    </SvgIcon>
  </EditedShift>
);

export default ({
  hidefiles,
  contracts,
  filteredContracts,
  setFilteredContracts,
  fileDiffCounts,
}) => {
  const [filter, setFilter] = useState("");
  const dispatch = useDispatch();
  const scrollTo = (id) => {
    const target = document.getElementById(id).getBoundingClientRect();
    dispatch(setSelectedFile(id));
    window.scroll(0, window.scrollY + target.top - 79 - 2);
  };

  const files = (
    <FileList id="filelist">
      {filteredContracts.map((contract) => {
        const fileName = getEndOfPath(contract.name);
        const diffs = fileDiffCounts[contract.name] || {};
        const { added, removed, modificationType } = diffs;
        return (
          <FileHeader
            title={contract.name}
            key={contract.name}
            onClick={() => scrollTo(contract.name)}
          >
            <FileName>{highlight(filter, fileName)}</FileName>
            {modificationType === "added"
              ? AddedIcon
              : modificationType === "removed"
              ? RemovedIcon
              : EditedIcon}
          </FileHeader>
        );
      })}
    </FileList>
  );

  return (
    <LeftNav hidefiles={hidefiles}>
      <Filter
        contracts={contracts}
        setFilteredContracts={setFilteredContracts}
        filter={filter}
        setFilter={setFilter}
      />
      {files}
    </LeftNav>
  );
};
