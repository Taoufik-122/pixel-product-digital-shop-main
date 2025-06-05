import React, { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CategorySidebar from "@/components/CategorySidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Product } from "@/types/product";
import { supabase } from "@/lib/supabaseClient";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("❌ حدث خطأ أثناء جلب المنتجات:", error.message);
      } else {
        setProducts(data as Product[]);
      }

      setLoading(false);
    };

    fetchProducts();
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

        <div className="container mx-auto px-4 mt-8">
          <SidebarProvider>
            <div className="flex w-full">
              <CategorySidebar />
              <SidebarInset className="p-4">
                <div className="mb-6">
                  <SidebarTrigger className="md:hidden" />
                </div>

                {loading ? (
                  <p className="text-center">جاري التحميل...</p>
                ) : products.length === 0 ? (
                  <p className="text-center">لا توجد منتجات حالياً.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
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
