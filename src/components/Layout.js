import styled from "styled-components";
import { useTheme } from "../hooks";
import Navigation from "./Navigation";
import ChainLoader from "./ChainLoader";

const Wrapper = styled.div``;

const Content = styled.div`
  display: flex;
  justify-content: center;
`;

export default ({ children }) => {
  const theme = useTheme();
  return (
    <Wrapper className={`main-wrapper ${theme}`} id="layout">
      <ChainLoader>
        {/* <Navigation /> */}
        <Content>{children}</Content>
      </ChainLoader>
    </Wrapper>
  );
};
