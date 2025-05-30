import { useNavigate } from "react-router-dom";
// استيراد jwt_decode بشكل صحيح
import jwt_decode from "jwt-decode";

// واجهة لتحديد البيانات المستخرجة من التوكن
interface DecodedToken {
  isAdmin: boolean;
  // يمكن إضافة المزيد من الخصائص هنا إذا كانت موجودة في التوكن
}

const ProtectedRoute = ({ element }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const isAuthenticated = token ? true : false;

  // فك التوكن وتحديد نوع البيانات باستخدام واجهة DecodedToken
  const isAdmin = isAuthenticated ? (jwt_decode<DecodedToken>(token).isAdmin) : false;

  if (!isAuthenticated || !isAdmin) {
    navigate("/signin");
    return null;
  }

  return element;
};

export default ProtectedRoute;
