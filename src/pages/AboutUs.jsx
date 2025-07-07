import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-6">
      <h1 className="text-4xl font-extrabold text-green-700 mb-8">About Us</h1>

      <div className="max-w-4xl bg-white rounded-lg shadow-md p-8 space-y-8">
        {/* Our Story */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Story
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Founded in 2020, FreshMart started with a simple mission: to provide
            fresh, quality groceries delivered right to your doorstep. We
            believe in supporting local farmers and suppliers to ensure you get
            the best products at affordable prices.
          </p>
        </section>

        {/* What We Offer */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            What We Offer
          </h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Fresh fruits and vegetables sourced locally</li>
            <li>Organic and natural food products</li>
            <li>Daily essentials like dairy, grains, and pulses</li>
            <li>Exclusive deals and discounts for our loyal customers</li>
          </ul>
        </section>

        {/* Our Commitment */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Our Commitment
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Customer satisfaction is our top priority. We strive to maintain
            transparency, quality, and timely delivery. Our dedicated support
            team is always here to help you with any queries or concerns.
          </p>
        </section>

        {/* Contact Info */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Contact Us
          </h2>
          <p>
            Email:{" "}
            <a
              href="mailto:support@freshmart.com"
              className="text-green-600 underline"
            >
              pawarchandan301@gmail.com
            </a>
            <br />
            Phone:{" "}
            <a
              href="https://wa.me/918791021359"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 underline"
            >
              +91 8791021359
            </a>
            <br />
            <p>
              Address:{" "}
              <span className="text-gray-500">
                Kamulwaganja, Haldwani Uttrakhand, India
              </span>
            </p>
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
