import { SvgIcon } from "@mui/material";
import styled from "styled-components";
import Filter from "./Filter";

const LeftNav = styled.div`
  width: 290px;
  height: 79px;
  position: sticky;
  top: 79px;
  display: ${(props) => (props.hidefiles === "true" ? "none" : "auto")};
`;

const FileList = styled.div`
  margin-top: 20px;
  display: flex;
  grid-gap: 0px;
  flex-direction: column;
`;

const FileHeader = styled.div`
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

export default ({ hidefiles, setHideFiles }) => {
  return (
    <LeftNav hidefiles={hidefiles}>
      <Filter />
      <FileList>
        <FileHeader>
          <div>LDEI.sol</div>
          {EditedIcon}
        </FileHeader>
        <FileHeader>
          <div>LERC20Upgradable.sol</div>
          {EditedIcon}
        </FileHeader>
      </FileList>
    </LeftNav>
  );
};
