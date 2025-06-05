import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";
import { supabase } from "@/lib/supabaseClient"; // import Supabase

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setProduct(null);
      } else {
        setProduct(data as Product);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
          <Button onClick={() => navigate("/")}>الرجوع للصفحة الرئيسية</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-8 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          الرجوع
        </Button>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg overflow-hidden shadow-md">
            <img 
              src={product.image} 
              alt={product.title} 
              className="w-full h-auto object-cover" 
            />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            
            <div className="mb-4">
              <span className="inline-block bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm">
                {product.category}
              </span>
            </div>
            
            <div className="text-2xl font-bold mb-6 text-brand-purple">
              ${product.price.toFixed(2)}
            </div>
            
            <p className="text-gray-700 mb-8">
              {product.description}
            </p>
            
            <Button 
              onClick={() => addItem(product)} 
              size="lg"
              className="w-full md:w-auto bg-brand-purple hover:bg-brand-purple/90 flex items-center justify-center gap-2"
            >
              <ShoppingCart size={20} />
              أضف إلى السلة
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
