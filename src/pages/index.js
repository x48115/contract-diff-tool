import { styled } from "styled-components";
import Logo from "../components/Logo";
import { GitHub, Twitter } from "@mui/icons-material";
import Image from "next/image";

const Wrapper = styled.div`
  margin-top: 60px;
  > div {
    font-size: 12px;
  }
  min-height: 400px;
`;

const Description = styled.div`
  color: #888;
  font-size: 14px !important;
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
    font-size: 28px !important;
    font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
      Liberation Mono, monospace;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  margin-top: 80px;
  display: flex;
  grid-gap: 20px;
  flex-direction: column;
`;
const Icons = styled.div`
  display: flex;
  grid-gap: 30px;
  justify-content: center;
  width: 100%;
  margin-top: 120px;
  svg,
  img {
    cursor: pointer;
  }
`;

const openAddress = (url) => {
  window.open(url, "_blank").focus();
};

function App() {
  return (
    <Wrapper>
      <Logo />
      <Description>Building a collection of EVM tools</Description>
      <Links>
        <a href="diff" target="_blank">
          Contract Diff tool
        </a>
        <a
          href="https://github.com/x48115/blockchain-university"
          target="_blank"
        >
          Blockchain University
        </a>
      </Links>
      <Icons>
        <GitHub
          sx={{ fontSize: 44 }}
          onClick={() =>
            openAddress("https://github.com/x48115/contract-diff-tool")
          }
        />
        <Image
          src="/discord_logo.svg"
          width="44"
          height="44"
          onClick={() => openAddress("https://discord.gg/KPhtdR7m2m")}
        />
        <Twitter
          sx={{ fontSize: 44 }}
          onClick={() => openAddress("https://twitter.com/x48_crypto")}
        />
      </Icons>
    </Wrapper>
  );
}

export default App;
