import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setChains } from "../store/chains";
import explorerUrls from "./ExplorerApiEndpoints.json";

export default ({ children }) => {
  const dispatch = useDispatch();

  const apiKeys = {
    1: "GEQXZDY67RZ4QHNU1A57QVPNDV3RP1RYH4", // etherscan
    250: "3FV52UFPDWJ8JC22TJ1Y45Y443EAW4NVSH", // fantom
    25: "RQMT5RSZRATKAJ5YP1MT4QH825MEKAHNIF", // cronos
    42161: "NPVW1QSPANK5TCWGD6IHX9B4NM4CIIACVN", // arbitrum
    43113: "XD73JI82I8U1FKHHCZ6R5ES291J7SBCXF9", // avalanche
    10: "85YRD6N3IRUHZEWHZF3V6W5N8VIQCP64CA", // optimism
    56: "7YDHPB7CSP9F9P3SNWDWP53ERRR2NIUT9B", // bsc
    137: "UIXVPUFBEUSPK2KUXAEMK5YFTF4FTUZCEQ", // polygon
    42220: "IF2FG9SQNJJWBQEBQJVHE1DYUZPSBQVGRS", // celo
  };

  const delay = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  useEffect(() => {
    const fetchData = async () => {
      const chainsUrl = "https://chainid.network/chains.json";
      const fetchIt = async () => {
        try {
          return await fetch(chainsUrl).then((response) => response.json());
        } catch (e) {
          await delay(1000);
          console.log("retry");
          fetchIt();
        }
      };

      let chains = await fetchIt();

      // Inject explorer APIs
      chains.map((chain) => {
        const match = explorerUrls.find(
          (explorer) => explorer.chainId === chain.chainId
        );
        if (match) {
          chain.explorerApiUrl = match.url;
        }
        return chain;
      });

      // Inject API keys
      chains.map((chain) => {
        chain.apiKey = apiKeys[chain.chainId];
        return chain;
      });

      // Only show chains with explorer APIs
      let filteredChains = chains.filter((chain) => chain.explorerApiUrl);

      // Blacklist
      const blacklistedChains = [8738, 2203, 2888, 113, 2213, 3501, 224168];
      filteredChains = filteredChains.filter(
        (chain) => !blacklistedChains.includes(chain.networkId)
      );

      // Alphabetical
      let sortedChains = filteredChains.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      // Preferred
      const preferredChainIds = [
        1, 42161, 56, 137, 10, 43114, 25, 250, 2222, 32659, 42220,
      ].reverse();
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
