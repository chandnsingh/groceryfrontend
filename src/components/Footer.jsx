import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 mt-10 text-white py-6">
      <div className="max-w-7xl px-4 mx-auto grid grid-cols-1 gap-10 sm:grid-cols-3 text-center sm:text-left items-center">
        {/* Store Info */}
        <div>
          <h2 className="text-lg font-bold mb-2">JMD Store</h2>
          <p>Your trusted local grocery partner.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li>
              <Link to="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:underline">
                Cart
              </Link>
            </li>
            <li>
              <Link to="/order" className="hover:underline">
                Order
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:underline">
                Terms and Condition
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-bold mb-2">Contact Us</h3>
          <p>📞 +91 8791021359</p>
          <p>📬 chandanpawar114@gmail.com</p>
          <p>📍 Haldwani, Uttarakhand</p>
        </div>
      </div>

      <div className="text-center text-sm mt-6 text-gray-300">
        © {new Date().getFullYear()} JMD Store. All rights reserved. CP
      </div>
    </footer>
  );
};

export default Footer;
