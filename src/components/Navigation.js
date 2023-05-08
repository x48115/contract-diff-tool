import styled from "styled-components";
import ThemeSelector from "./ThemeSelector";
import HighlightSyntaxSelector from "./HighlightSyntaxSelector";
import ActiveLink from "./ActiveLink";
import AutoExpandSelector from "./AutoExpandSelector";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const NavItems = styled.div`
  display: flex;
  grid-gap: 10px;
`;

const NavItem = styled.div``;

const routes = ["swaps", "stats"];
const rootRoute = "swaps";

const Right = styled.div`
  display: flex;
  grid-gap: 5px;
  position: absolute;
  right: 5px;
`;

const Options = styled.div`
  display: flex;
  grid-gap: 10px;
  flex-direction: row;
`;
export default () => {
  const navItems = routes.map((route) => {
    let routePath = `/${route}`;
    if (route === rootRoute) {
      routePath = "/";
    }
    return (
      <NavItem key={route}>
        <ActiveLink activeClassName="active" href={routePath}>
          {route}
        </ActiveLink>
      </NavItem>
    );
  });
  return (
    <Wrapper>
      <div></div>
      {/* <NavItems>{navItems}</NavItems> */}
      <Right>
        {" "}
        <Options>
          <HighlightSyntaxSelector />
          <ThemeSelector />
          <AutoExpandSelector />
        </Options>
      </Right>
    </Wrapper>
  );
};
