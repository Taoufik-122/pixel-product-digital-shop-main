
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  
  return (
    <div className="product-card rounded-lg overflow-hidden bg-white border group">
      <Link to={`/product/${product.id}`}>
        <div className="h-48 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-medium hover:text-brand-purple transition-colors">
            {product.title}
          </h3>
        </Link>
        
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded-md">{product.category}</span>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="font-bold text-lg">{Number(product.price).toFixed(2)} MAD
          </span>
          
          <Button 
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="flex items-center gap-1"
          >
            <ShoppingCart size={16} />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
