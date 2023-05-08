import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setChains } from "../store/chains";

export default ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const chainsUrl = "https://chainid.network/chains.json";
      const chains = await fetch(chainsUrl).then((response) => response.json());

      const filteredChains = chains.filter(
        (chain) =>
          chain.explorers &&
          chain.explorers.length &&
          !chain.name.match(/test/i)
      );

      // Alphabetical
      let sortedChains = filteredChains.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      // Preferred
      const preferredChainIds = [1, 250].reverse();
      sortedChains = filteredChains.sort(
        (a, b) =>
          preferredChainIds.indexOf(b.chainId) -
          preferredChainIds.indexOf(a.chainId)
      );
      dispatch(setChains(sortedChains));
    };

    fetchData();
  }, []);
  return children;
};
