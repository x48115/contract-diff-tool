import { styled } from "styled-components";
import Logo from "../components/Logo";

const Wrapper = styled.div`
  margin-top: 60px;
  > div {
    font-size: 12px;
  }
`;

const Description = styled.div`
  color: #888;
  font-size: 18px !important;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
    Liberation Mono, monospace;
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const Links = styled.div`
  > a {
    color: white;
    font-size: 18px !important;
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
      Liberation Mono, monospace;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 120px;
  }
`;

function App() {
  return (
    <Wrapper>
      <Logo />
      <Description>Building a collection of EVM tools</Description>
      <Links>
        <a href="diff">Contract Diff tool</a>
      </Links>
    </Wrapper>
  );
}

export default App;
