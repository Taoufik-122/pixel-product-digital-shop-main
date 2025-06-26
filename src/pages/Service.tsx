import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, ShieldCheck, Download, BadgeDollarSign, LockKeyhole, RefreshCcw, Users, PencilRuler, UserCheck, Wrench, Mail } from "lucide-react";

const Service = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-20 shadow-inner">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">Terms of Service</h1>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              Please read these terms carefully before using Pixel Store’s digital services.
            </p>
          </div>
        </section>

        {/* Terms Content */}
       <section className="py-16 container mx-auto px-4">
  <div className="max-w-4xl mx-auto">
    <h2 className="text-4xl font-extrabold text-center text-brand-purple mb-12 tracking-tight drop-shadow-md">
      <FileText className="inline-block w-8 h-8 mr-2 -mt-1" />
      Terms of Service
    </h2>
    <div className="space-y-10 text-lg leading-relaxed text-gray-700">
      <div>
        <p className="text-gray-500 mb-1 text-sm">Effective Date: <span className="text-black font-semibold">June 25, 2025</span></p>
        <p className="text-gray-700">Welcome to Pixel Store. These Terms of Service govern your access to and use of our digital products and services.</p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-brand-purple flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-blue" />
          1. Acceptance of Terms
        </h3>
        <p>By accessing or purchasing from Pixel Store, you agree to comply with and be bound by these Terms.</p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-brand-purple flex items-center gap-2">
          <Download className="w-5 h-5 text-brand-blue" />
          2. Digital Products
        </h3>
        <p>All products are digital and non-refundable once delivered.</p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-brand-purple flex items-center gap-2">
          <BadgeDollarSign className="w-5 h-5 text-brand-blue" />
          3. Licensing
        </h3>
        <p>You receive a non-transferable license. Redistribution is prohibited unless specified otherwise.</p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-brand-purple flex items-center gap-2">
          <LockKeyhole className="w-5 h-5 text-brand-blue" />
          4. Payments
        </h3>
        <p>Payments are secure. Prices include applicable taxes.</p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-brand-purple flex items-center gap-2">
          <RefreshCcw className="w-5 h-5 text-brand-blue" />
          5. Refund Policy
        </h3>
        <p>No refunds after download except in special cases like duplicate payment.</p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-brand-purple flex items-center gap-2">
          <PencilRuler className="w-5 h-5 text-brand-blue" />
          6. Intellectual Property
        </h3>
        <p>All designs and assets are owned by Pixel Store. Unauthorized use is prohibited.</p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-brand-purple flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-brand-blue" />
          7. Account & Access
        </h3>
        <p>Keep your account secure. We may suspend accounts for misuse.</p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-brand-purple flex items-center gap-2">
          <Wrench className="w-5 h-5 text-brand-blue" />
          8. Modification of Terms
        </h3>
        <p>Terms can be updated at any time. Continued use means acceptance of new terms.</p>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-brand-purple flex items-center gap-2">
          <Mail className="w-5 h-5 text-brand-blue" />
          9. Contact
        </h3>
        <p>
          <strong>Email:</strong> support@pixelstore.com<br />
          <strong>Website:</strong> www.pixelstore.com
        </p>
      </div>
    </div>
  </div>
</section>


        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Become Part of the Pixel Community</h2>
            <p className="text-lg max-w-xl mx-auto mb-8">
              Discover high-quality resources and unlock creative potential with our digital products.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-indigo-700 hover:bg-white/90 transition">
                <Link to="/products">Explore Products</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 transition">
                <Link to="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Service;
