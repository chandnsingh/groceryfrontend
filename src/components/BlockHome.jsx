// components/BlockOnHome.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BlockOnHome = () => {
  const location = useLocation();

  useEffect(() => {
    const blockBack = () => {
      if (location.pathname === "/") {
        window.history.pushState(null, "", window.location.href);
      }
    };

    if (location.pathname === "/") {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", blockBack);
    }

    return () => {
      window.removeEventListener("popstate", blockBack);
    };
  }, [location.pathname]);

  return null;
};

export default BlockOnHome;
