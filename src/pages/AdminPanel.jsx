import { useEffect, useState } from "react";
import api from "../api";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    category: "",
    inStock: true,
    variants: [{ unit: "", price: "", discount: "" }],
    rating: "",
    reviews: "",
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...form.variants];
    updatedVariants[index][field] = value;
    setForm({ ...form, variants: updatedVariants });
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { unit: "", price: "", discount: "" }],
    }));
  };

  const removeVariant = (index) => {
    const updated = form.variants.filter((_, i) => i !== index);
    setForm({ ...form, variants: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        await api.put(`/products/${editingProductId}`, form);
      } else {
        await api.post("/products", form);
      }
      fetchProducts();
      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((prev) => ({ ...prev, image: res.data.imageUrl }));
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      image: "",
      category: "",
      inStock: true,
      variants: [{ unit: "", price: "", discount: "" }],
      rating: "",
      reviews: "",
    });
    setEditingProductId(null);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  const filteredProducts = products.filter((p) =>
    (p.name + p.category).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Panel</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-6 rounded-lg mb-10 shadow"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingProductId ? "Update Product" : "Add Product"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="md:col-span-2 p-2 border rounded"
          />
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Variants</h3>
          {form.variants.map((variant, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Unit (e.g. 500g)"
                value={variant.unit}
                onChange={(e) =>
                  handleVariantChange(index, "unit", e.target.value)
                }
                className="p-2 border rounded w-1/3"
              />
              <input
                type="number"
                placeholder="Price"
                value={variant.price}
                onChange={(e) =>
                  handleVariantChange(index, "price", e.target.value)
                }
                className="p-2 border rounded w-1/3"
              />
              <input
                type="text"
                placeholder="Discount (%)"
                value={variant.discount}
                onChange={(e) =>
                  handleVariantChange(index, "discount", e.target.value)
                }
                className="p-2 border rounded w-1/3"
              />
              {form.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-red-500 text-sm"
                >
                  ❌
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="text-blue-600 text-sm mt-2"
          >
            ➕ Add Variant
          </button>
        </div>

        <div className="mt-4">
          <label className="font-medium">Rating and Reviews</label>
          <div className="flex gap-3 mt-2">
            <input
              type="number"
              name="rating"
              placeholder="Rating (0-5)"
              value={form.rating}
              onChange={handleChange}
              step="0.1"
              min="0"
              max="5"
              className="px-2 border rounded"
            />
            <input
              type="number"
              name="reviews"
              placeholder="No. of Reviews"
              value={form.reviews}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="font-medium">Image Upload</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block mt-1"
          />
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Or paste image URL"
            className="mt-2 p-2 border rounded w-full"
          />
          {uploading && <p className="text-blue-600 text-sm">Uploading...</p>}
          {form.image && (
            <img
              src={
                form.image.startsWith("http")
                  ? form.image
                  : `http://localhost:5000${form.image}`
              }
              alt="preview"
              className="h-24 object-contain mt-2 border"
            />
          )}
        </div>

        <label className="inline-flex items-center mt-4">
          <input
            type="checkbox"
            name="inStock"
            checked={form.inStock}
            onChange={handleChange}
            className="mr-2"
          />
          In Stock
        </label>

        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded mr-3"
          >
            {editingProductId ? "Update Product" : "Add Product"}
          </button>
          {editingProductId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded shadow-sm mb-4"
      />

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="w-full table-auto border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Variants</th>
              <th className="border p-2">In Stock</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id}>
                <td className="border p-2">{p.name}</td>
                <td className="border p-2 capitalize">{p.category}</td>
                <td className="border p-2 text-sm">
                  {p.variants
                    ?.map(
                      (v) =>
                        `${v.unit} @ ₹${v.price}${
                          v.discount ? ` (-${v.discount})` : ""
                        }`
                    )
                    .join(", ") || "N/A"}
                </td>
                <td className="border p-2">{p.inStock ? "Yes" : "No"}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => {
                      setForm(p);
                      setEditingProductId(p._id);
                    }}
                    className="text-blue-600 hover:underline mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-6">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
