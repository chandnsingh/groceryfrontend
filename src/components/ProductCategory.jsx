import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ For navigation
import api from "../api";

// 🔹 Skeleton Loader Component
const CategorySkeleton = () => (
  <div>
    {/* 🔹 Mobile Skeleton (3 per row) */}
    <div className="grid grid-cols-3 gap-3 mb-6 sm:hidden">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg shadow animate-pulse"
        >
          <div className="w-14 h-14 bg-gray-300 rounded mb-2" />
          <div className="w-16 h-3 bg-gray-300 rounded" />
        </div>
      ))}
    </div>

    {/* 🔹 Desktop Skeleton */}
    <div className="hidden sm:grid sm:gap-3 sm:mb-6 sm:grid-cols-8">
      {Array.from({ length: 16 }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg shadow animate-pulse"
        >
          <div className="w-14 h-14 bg-gray-300 rounded mb-2" />
          <div className="w-16 h-3 bg-gray-300 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const ProductCategory = ({ onCategorySelect }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllMobile, setShowAllMobile] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const products = res.data;

        const categoryMap = {};
        for (const product of products) {
          const { category, image } = product;
          if (!category || !image) continue;

          const key = category.trim().toLowerCase();
          if (!categoryMap[key]) {
            categoryMap[key] = { name: category.trim(), image };
          }
        }

        setCategories(Object.values(categoryMap));
        setLoading(false);
      } catch (err) {
        setError("Failed to load categories.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const mobileVisible = showAllMobile ? categories : categories.slice(0, 8);

  const handleCategoryClick = (name) => {
    if (onCategorySelect) onCategorySelect(name); // Hide the component via parent
    navigate(`/category/${name.toLowerCase()}`); // Update route for breadcrumb
  };

  return (
    <div className="bg-gray-50 max-w-[73rem] mx-auto rounded-xl mt-4">
      <div className="bg-white mx-auto px-4">
        <h2 className="text-xl font-bold mb-6 text-center text-gray-700">
          🛒 Shop From Bestsellers
        </h2>

        {/* 🔄 Loading or Error State */}
        {loading && <CategorySkeleton />}
        {error && <p className="text-center text-red-500 py-6">{error}</p>}

        {/* ✅ Mobile View */}
        <div className="sm:hidden">
          <div className="grid grid-cols-4 gap-3">
            {mobileVisible.map((cat, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(cat.name)}
                className="cursor-pointer flex flex-col items-center py-3 bg-[#edf2f7] border border-gray-200 rounded-lg shadow hover:shadow-md hover:bg-[#e0ecf7] transition-transform"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-14 h-14 object-cover rounded mb-2"
                />
                <span className="text-xs font-semibold capitalize text-gray-700">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>

          {/* View All / Hide Toggle */}
          {categories.length > 8 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowAllMobile(!showAllMobile)}
                className="text-sm text-blue-900 font-bold mt-1"
              >
                {showAllMobile ? "Hide" : "View All"}
              </button>
            </div>
          )}
        </div>

        {/* ✅ PC/Tablet View */}
        <div className="hidden sm:grid sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {categories.map((cat, index) => (
            <div
              key={index}
              onClick={() => handleCategoryClick(cat.name)}
              className="cursor-pointer flex flex-col items-center py-3 bg-[#edf2f7] border border-gray-200 rounded-lg shadow hover:shadow-md hover:bg-[#e0ecf7] transition-transform"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-14 h-14 object-cover rounded mb-2"
              />
              <span className="text-xs font-semibold capitalize text-gray-700">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCategory;
