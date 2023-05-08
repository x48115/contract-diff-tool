import { useDispatch } from "react-redux";
import { setChains } from "../store/chains";
import { useEffect } from "react";

export default ({ children }) => {
  const dispatch = useDispatch();
  const loadChains = async () => {
    const listUrl = "https://chainid.network/chains.json";
    const list = await fetch(listUrl).then((response) => response.json());
    const filteredList = list.filter(
      (chain) => chain.explorers && chain.explorers.length
    );
    console.log("filt,", filteredList);
    dispatch(setChains(filteredList));
  };

  useEffect(() => loadChains, []);

  return children;
};
