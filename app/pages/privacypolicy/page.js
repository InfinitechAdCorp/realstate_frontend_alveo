import React from "react";
import Header from "./../header";
import Footer from "./../footer";

const PrivacyPolicy = () => {
  return (
    <>
      <div className="w-[90%] mx-auto p-6 pt-20">

        <div className="mt-10 relative mb-32">
          <h1 className="text-3xl font-bold text-center mb-6">
            Privacy Policy
          </h1>

          <p className="text-lg mb-4">
            At Infinitech Advertising Corporation, we respect and value your
            privacy. This privacy policy outlines how we collect, use, and
            protect your personal information.
          </p>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              1. Information We Collect (Email Inquiry):
            </h2>
            <p className="text-lg">
              Your name, email address, website URL, and mobile phone number for
              the purpose of communication and service delivery.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              2. Use of Collected Information:
            </h2>
            <p className="text-lg">
              The information we collect is used solely to enhance your
              experience with Infinitech Advertising Corporation and provide you
              with the best possible services. This includes, but is not limited
              to:
            </p>
            <ul className="list-inside list-disc text-lg">
              <li>
                Contacting you with updates or information relevant to your
                inquiries or orders.
              </li>
              <li>
                Responding to your queries or providing you with requested
                services.
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">3. Data Security:</h2>
            <p className="text-lg">
              We are committed to ensuring that your information is secure. In
              order to prevent unauthorized access or disclosure, we have put in
              place suitable physical, electronic, and managerial procedures to
              safeguard and secure the information we collect online.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              4. Sharing Your Information:
            </h2>
            <p className="text-lg">
              We do not share, sell, or distribute your personal information to
              third parties unless required by law.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">
              5. Changes to the Privacy Policy:
            </h2>
            <p className="text-lg">
              Infinitech Advertising Corporation may revise this Privacy Policy
              from time to time. Continued use of this website after any changes
              to the Privacy Policy implies your acceptance of those changes.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">6. Contact Us:</h2>
            <p className="text-lg">
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a
                href="mailto:infinitechcorp.ph@gmail.com"
                className="text-blue-600 hover:text-blue-800"
              >
                infinitechcorp.ph@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>

    </>
  );
};

export default PrivacyPolicy;
