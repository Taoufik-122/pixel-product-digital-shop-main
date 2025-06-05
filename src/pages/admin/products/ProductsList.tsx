import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { Edit, Trash } from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // تأكد من المسار الصحيح

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error("❌ خطأ في جلب المنتجات:", error.message);
      } else {
        setProducts(data as Product[]);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("هل أنت متأكد من حذف المنتج؟")) {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("❌ فشل الحذف:", error.message);
        alert("حدث خطأ أثناء حذف المنتج.");
      } else {
        setProducts(products.filter(product => product.id !== id));
        alert("✅ تم حذف المنتج");
      }
    }
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/admin/products/new">
          <Button>Add New Product</Button>
        </Link>
      </div>

      {loading ? (
        <p>⏳ جارٍ تحميل المنتجات...</p>
      ) : (
        <Table>
          <TableCaption>List of all available products</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead className="w-[250px]">Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-10 h-10 rounded-md object-cover" 
                    />
                    <span>{product.title}</span>
                  </div>
                </TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${Number(product.price).toFixed(2)}</TableCell>
                <TableCell>{product.featured ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                  <Link to={`/admin/products/edit/${product.id}`}>
 
                  
                      <Button size="sm" variant="outline">
                        <Edit size={16} />
                      </Button>
                    </Link>
                    
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ProductsList;
