
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";

// Mock purchased products - in a real app, these would come from the order
const purchasedItems = [
  {
    id: 1,
    title: "Digital Art Templates Bundle",
    fileSize: "120 MB",
    fileType: "ZIP"
  },
  {
    id: 3,
    title: "Social Media Graphics Pack",
    fileSize: "45 MB",
    fileType: "ZIP"
  }
];











  // ... باقي الكود بدون تغيير




  const CheckoutSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderNumber = location.state?.orderNumber || `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const [downloading, setDownloading] = useState<number | null>(null);
  
  const handleDownload = (productId: number, productTitle: string) => {
    setDownloading(productId);
    
    // Simulate download process
    toast({
      title: "Download started",
      description: `Preparing ${productTitle} for download...`,
    });
    
    setTimeout(() => {
      toast({
        title: "Download complete",
        description: `${productTitle} has been downloaded successfully.`,
      });
      setDownloading(null);
    }, 2500);
  };

  const handleDownloadAll = () => {
    toast({
      title: "Preparing downloads",
      description: "All files are being prepared for download.",
    });
    
    // In a real app, this would trigger all downloads
    setTimeout(() => {
      toast({
        title: "Downloads ready",
        description: "All files have been downloaded successfully.",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle size={64} className="text-green-600" />
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Thank You for Your Purchase!</h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Your order has been successfully processed and your downloads are ready.
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
              <h2 className="text-xl font-medium mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number</span>
                  <span className="font-medium">{orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-green-600">Completed</span>
                </div>
              </div>
            </div>
            
            <div id="download" className="bg-gray-50 p-6 rounded-lg mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium">Your Downloads</h2>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleDownloadAll}
                >
                  <Download size={16} />
                  Download All
                </Button>
              </div>
              
              <div className="space-y-4">
                {purchasedItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-brand-purple/10 p-2 rounded">
                        <ShoppingBag size={24} className="text-brand-purple" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.fileSize} • {item.fileType}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={downloading === item.id}
                      onClick={() => handleDownload(item.id, item.title)}
                    >
                      {downloading === item.id ? "Downloading..." : "Download"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </Button>
            </div>
            
            <div className="text-sm text-gray-500">
              <p className="mb-2">
                We've sent a receipt and download instructions to your email address.
              </p>
              <p>
                If you have any questions about your order, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
