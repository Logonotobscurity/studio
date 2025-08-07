import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Initial check
    checkDevice();

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", checkDevice);

    return () => {
      mql.removeEventListener("change", checkDevice);
    };
  }, []);

  return isMobile;
}
