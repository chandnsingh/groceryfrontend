import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProductList from "../components/Productlist";
import ProductCategory from "../components/ProductCategory";

const Home = ({ searchTerm, setSearchTerm }) => {
  const location = useLocation();
  const hasSearch = searchTerm && searchTerm.trim() !== "";

  useEffect(() => {
    // Clear searchTerm only when on `/` path
    if (location.pathname === "/" && hasSearch) {
      setSearchTerm("");
    }
  }, [location.pathname]);

  return (
    <div>
      {!hasSearch && <ProductCategory />}
      <ProductList searchTerm={searchTerm} />
    </div>
  );
};

export default Home;
