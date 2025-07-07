import React from "react";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-6">
      <div className="max-w-3xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-4xl font-extrabold text-green-700 mb-8">
          Terms & Conditions
        </h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to FreshMart! By accessing or using our services, you agree
            to be bound by these Terms and Conditions. Please read them
            carefully.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">2. Use of Service</h2>
          <p className="text-gray-700 leading-relaxed">
            You agree to use our grocery services responsibly and not engage in
            any unlawful or harmful activities. We reserve the right to suspend
            or terminate your access if you violate our policies.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            3. Product Information
          </h2>
          <p className="text-gray-700 leading-relaxed">
            We strive to provide accurate product descriptions, but cannot
            guarantee all details. Product availability and prices are subject
            to change without prior notice.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">4. Payment & Delivery</h2>
          <p className="text-gray-700 leading-relaxed">
            Payment must be completed before delivery. Delivery times are
            estimates and may vary due to unforeseen circumstances.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">5. Returns & Refunds</h2>
          <p className="text-gray-700 leading-relaxed">
            Please review our Return Policy for details on refunds and
            exchanges. We aim to resolve any issues quickly and fairly.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            6. Limitation of Liability
          </h2>
          <p className="text-gray-700 leading-relaxed">
            FreshMart is not liable for any indirect or consequential damages
            arising from the use of our services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Changes to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update these Terms and Conditions from time to time.
            Continued use of our service means you accept the new terms.
          </p>
        </section>

        <p className="mt-10 text-gray-600 text-sm italic">
          Last updated: July 2025
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
