import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import CardItem from "./CardItem";

const SkeletonCard = () => (
  <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
    <div className="bg-gray-300 h-28 mb-4 rounded"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
    <div className="h-6 bg-gray-300 rounded w-full"></div>
  </div>
);

const ProductList = ({ searchTerm }) => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await api.get("/products");
        const valid = res.data.filter((p) => p.name && p.category);
        setProducts(valid);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const term = searchTerm?.toLowerCase() || "";
  const filtered = products.filter((product) => {
    const nameMatch = product.name?.toLowerCase().includes(term);
    const categoryMatch = product.category?.toLowerCase().includes(term);

    if (categoryName) {
      return (
        product.category?.toLowerCase() === categoryName.toLowerCase() &&
        (!term || nameMatch) &&
        product.inStock
      );
    }

    return term ? nameMatch || categoryMatch : product.inStock;
  });

  const grouped = filtered.reduce((acc, item) => {
    const category = item.category?.toLowerCase() || "others";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  const toggleViewAll = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (loading) {
    return (
      <div className="bg-gray-100 mx-auto max-w-[73rem] mt-6 px-4 py-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Loading Products...
        </h2>
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="bg-gray-100 mx-auto max-w-[73rem] mt-6 px-4 py-10 text-center text-gray-600 text-xl">
        😕 No products found.
      </div>
    );
  }

  const renderCard = (product) => (
    <div
      key={product._id}
      className="bg-gradient-to-r from-[#d5eceb] via-[#e9f1f0] to-[#fbfbfb] w-full p-3 rounded-lg shadow-md border border-gray-300"
    >
      <CardItem
        productData={product}
        img={
          product.image?.startsWith("http")
            ? product.image
            : "https://via.placeholder.com/150"
        }
        name={product.name}
        description={product.description}
        inStock={product.inStock}
        variants={product.variants} // ✅ Send full variant list
        rating={product.rating}
        reviews={product.reviews}
      />
    </div>
  );

  if (categoryName) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-md mx-auto max-w-[73rem] mt-6 p-3">
        <h2 className="text-lg font-serif font-semibold capitalize text-gray-800 p-2 mb-3">
          {categoryName}
        </h2>
        <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {filtered.map(renderCard)}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 mx-auto max-w-[73rem] mt-6 p-3">
      {Object.entries(grouped).map(([category, items]) => {
        const isExpanded = expandedCategories[category];
        const showToggle = items.length > 6;

        // 👇 Limit count based on screen size using JS (for now)
        const isMobile = window.innerWidth < 640; // Tailwind's `sm` breakpoint
        const visibleCount = isMobile ? 4 : 6;
        const visible = isExpanded ? items : items.slice(0, visibleCount);

        return (
          <div
            key={category}
            className="bg-white rounded-lg p-3 mb-10 shadow-sm"
          >
            <div className="flex justify-between items-center p-2 mb-3">
              <h2 className="text-lg font-serif font-semibold capitalize text-gray-800">
                {category}
              </h2>

              {items.length > visibleCount && (
                <button
                  className="text-sm text-blue-900 font-bold cursor-pointer hover:underline"
                  onClick={() => toggleViewAll(category)}
                >
                  {isExpanded ? "Hide" : "View All"}
                </button>
              )}
            </div>

            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {visible.map(renderCard)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
