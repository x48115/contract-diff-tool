const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
};

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export const getRelativeTime = (d1, d2 = new Date()) => {
  const elapsed = d1 - d2;

  // "Math.abs" accounts for both "past" & "future" scenarios
  for (const u in units)
    if (Math.abs(elapsed) > units[u] || u == "second")
      return rtf.format(Math.round(elapsed / units[u]), u);
};

export function shortenAddress(address, chars = 4) {
  if (address === "") {
    return "";
  }
  if (address.endsWith(".eth")) {
    return address;
  }
  return `${address.substring(0, chars + 2)}...${address.substring(
    42 - chars
  )}`;
}

export const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (target instanceof Object && source instanceof Object) {
    for (const key in source) {
      if (source[key] instanceof Object) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  return mergeDeep(target, ...sources);
};

export const getEndOfPath = (path) => {
  const parts = path.split("/");
  const name = parts[parts.length - 1];
  return name;
};

export const highlight = (needle, haystack) => {
  const reg = new RegExp(needle, "gi");
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: haystack.replace(reg, (str) => "<u>" + str + "</u>"),
      }}
    />
  );
};
