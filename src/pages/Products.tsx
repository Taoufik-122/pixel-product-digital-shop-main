import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CategorySidebar from "@/components/CategorySidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Product } from "@/types/product";

const Products = () => {
  const [productsData, setProductsData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then((res) => {
        setProductsData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("خطأ في جلب المنتجات:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-purple to-brand-blue text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center">Products</h1>
            <p className="text-center mt-2 opacity-90 max-w-2xl mx-auto">
              Explore our collection of premium digital products
            </p>
          </div>
        </section>

        {/* Products with sidebar */}
        <div className="container mx-auto px-4 mt-8">
          <SidebarProvider>
            <div className="flex w-full">
              <CategorySidebar />
              <SidebarInset className="p-4">
                {/* Mobile sidebar trigger */}
                <div className="mb-6">
                  <SidebarTrigger className="md:hidden" />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productsData.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
