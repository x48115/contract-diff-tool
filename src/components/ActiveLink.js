import { useRouter } from "next/router";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const ActiveLink = ({ children, activeClassName, className, ...props }) => {
  const { asPath, isReady } = useRouter();
  const [computedClassName, setComputedClassName] = useState(className);

  useEffect(() => {
    if (isReady) {
      const linkPathname = new URL(props.as || props.href, location.href)
        .pathname;
      const activePathname = new URL(asPath, location.href).pathname;
      const newClassName =
        linkPathname === activePathname
          ? `${className || ""} ${activeClassName}`.trim()
          : className;

      if (newClassName !== computedClassName) {
        setComputedClassName(newClassName);
      }
    }
  }, [
    asPath,
    isReady,
    props.as,
    props.href,
    activeClassName,
    className,
    computedClassName,
  ]);

  return (
    <Link className={computedClassName} {...props}>
      {children}
    </Link>
  );
};

export default ActiveLink;
