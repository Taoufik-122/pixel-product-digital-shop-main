import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AuthError = () => {
  const location = useLocation();
  const [errorInfo, setErrorInfo] = useState({
    error: "",
    error_code: "",
    error_description: ""
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setErrorInfo({
      error: params.get('error') || "",
      error_code: params.get('error_code') || "",
      error_description: params.get('error_description') || ""
    });
  }, [location]);

  const getErrorMessage = () => {
    if (errorInfo.error_code === 'otp_expired') {
      return "انتهت صلاحية الرابط. يرجى طلب رابط جديد لإعادة تعيين كلمة المرور.";
    } else if (errorInfo.error === 'access_denied') {
      return "تم رفض الوصول. يرجى المحاولة مرة أخرى.";
    } else {
      return "حدث خطأ في المصادقة. يرجى المحاولة مرة أخرى.";
    }
  };

  return (
    <>
      <Navbar />
      <div className="container max-w-md mx-auto py-10 px-4">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-600">
              خطأ في المصادقة
            </CardTitle>
            <CardDescription>
              حدث خطأ أثناء عملية المصادقة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {getErrorMessage()}
              </AlertDescription>
            </Alert>
            
            {errorInfo.error_description && (
              <Alert>
                <AlertDescription className="text-sm text-gray-600">
                  تفاصيل الخطأ: {decodeURIComponent(errorInfo.error_description)}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link to="/signin">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  العودة لتسجيل الدخول
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link to="/signup">
                  إنشاء حساب جديد
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default AuthError;