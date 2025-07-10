import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { CreditCard, LockIcon, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient"; // تأكد من استيراد عميل Supabase

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🧠 مراجع الحقول (بدلاً من document.getElementById)
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const postalCodeRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLInputElement>(null);
  const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

  // 🛑 إذا كانت السلة فارغة، ارجع للصفحة الرئيسية
  useEffect(() => {
    if (items.length === 0) {
      navigate("/");
    }
  }, [items, navigate]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  const orderData = {
    orderNumber,
    date: new Date().toISOString().slice(0, 19).replace("T", " "),
    firstName: firstNameRef.current?.value || "",
    lastName: lastNameRef.current?.value || "",
    email: emailRef.current?.value || "",
    address: addressRef.current?.value || "",
    city: cityRef.current?.value || "",
    postalCode: postalCodeRef.current?.value || "",
    country: countryRef.current?.value || "",
    items,
  };

  try {
    const { data, error } = await supabase.from("orders").insert([orderData]);

    if (error) {
      toast({ title: "فشل حفظ الطلب", variant: "destructive" });
    } else {
      clearCart();

      // تكوين رسالة الطلب بنفس التنسيق الأصلي
      const message = `
✅ طلب جديد
رقم الطلب: ${orderNumber}
الاسم: ${orderData.firstName} ${orderData.lastName}
البريد: ${orderData.email}
العنوان: ${orderData.address}, ${orderData.city}, ${orderData.country}
الرمز البريدي: ${orderData.postalCode}
المنتجات:
${items
  .map(
    (item) =>
      `- ${item.product.title} × ${item.quantity} = ${
        item.product.price * item.quantity
      } درهم`
  )
  .join("\n")}
المجموع: ${totalPrice} درهم
      `.trim();

      // إرسال رسالة WhatsApp
      const phoneNumber = "212667120556"; // بدون صفر وبكود الدولة
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappURL, "_blank");

      navigate("/checkout/success", { state: { orderNumber } });
    }
  } catch (error) {
    toast({ title: "حدث خطأ أثناء إرسال الطلب", variant: "destructive" });
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          {/* 🧾 ملخص الطلب */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5 text-brand-purple" />
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded overflow-hidden">
                      <img 
                        src={item.product.image} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.product.title}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* 📦 نموذج الدفع */}
          <form onSubmit={handleSubmit}>
            {/* 💳 معلومات الدفع */}
           {/*  <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-brand-purple" />
                Payment Method
              </h2>

              <RadioGroup defaultValue="card" className="mb-6">
                <div className="flex items-center space-x-3 border rounded-md p-3">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-grow">Credit/Debit Card</Label>
                  <div className="flex space-x-2">
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    <div className="w-10 h-6 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </RadioGroup>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input id="cardName" placeholder="John Smith" required />
                </div>
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                </div>
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" required />
                </div>
                <div>
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" required />
                </div>
              </div>
            </div>*/}

            {/* 🧾 بيانات الفاتورة */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <LockIcon className="mr-2 h-5 w-5 text-brand-purple" />
                Billing Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" ref={firstNameRef} required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" ref={lastNameRef} required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" ref={emailRef} required />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" ref={addressRef} required />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" ref={cityRef} required />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input id="postalCode" ref={postalCodeRef} required />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" ref={countryRef} required />
                </div>
              </div>
            </div>

            {/* زر الدفع */}
            <Button 
              type="submit" 
              className="w-full bg-brand-purple hover:bg-brand-purple/90 text-lg py-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : `Pay $${totalPrice.toFixed(2)}`}
            </Button>

            <p className="text-sm text-gray-500 mt-4 text-center">
              By completing your purchase, you agree to our Terms of Service and Privacy Policy.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Checkout;
