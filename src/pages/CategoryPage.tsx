import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategorySidebar from "@/components/CategorySidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Product } from "@/types/product";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const categoryDescriptions = {
  templates: "Professional design templates for all your creative needs",
  graphics: "High-quality graphics and visual assets for your projects",
  software: "Tools and plugins to enhance your creative workflow"
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products");
        setProducts(response.data);
      } catch (err) {
        console.error("خطأ في جلب المنتجات:", err);
        setError("حدث خطأ أثناء جلب المنتجات");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const normalizedCategory = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "";

  const filteredProducts = products.filter(
    product => product.category?.toLowerCase() === category?.toLowerCase()
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-gradient-to-r from-brand-purple to-brand-blue text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center">{normalizedCategory}</h1>
            <p className="text-center mt-2 opacity-90 max-w-2xl mx-auto">
              {categoryDescriptions[category as keyof typeof categoryDescriptions] ||
                "Explore our collection of premium digital products"}
            </p>
          </div>
        </section>

        <div className="container mx-auto px-4 mt-8">
          <SidebarProvider>
            <div className="flex w-full">
              <CategorySidebar />
              <SidebarInset className="p-4">
                <div className="flex items-center mb-6 gap-2">
                  <SidebarTrigger className="md:hidden" />
                  <Button variant="ghost" size="sm" className="flex items-center gap-1" asChild>
                    <Link to="/products">
                      <ArrowLeft size={16} /> Back to all products
                    </Link>
                  </Button>
                </div>

                {loading ? (
                  <p className="text-center">جاري التحميل...</p>
                ) : error ? (
                  <p className="text-center text-red-500">{error}</p>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-medium">No products found</h3>
                    <p className="text-gray-500 mt-2">
                      We couldn't find any products in this category.
                    </p>
                    <Button asChild className="mt-4">
                      <Link to="/products">Browse all products</Link>
                    </Button>
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

export default CategoryPage;
