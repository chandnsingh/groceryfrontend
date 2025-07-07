import ProductList from "../components/Productlist";
import ProductCategory from "../components/ProductCategory";

const Home = ({ searchTerm }) => {
  const hasSearch = searchTerm && searchTerm.trim() !== "";

  return (
    <div>
      {/* ✅ Show ProductCategory only if there's no search input */}
      {!hasSearch && <ProductCategory />}

      <ProductList searchTerm={searchTerm} />
    </div>
  );
};

export default Home;
