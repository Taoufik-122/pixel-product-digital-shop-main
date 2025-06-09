import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmailConfirmed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/signin", {
        state: { message: "تم تأكيد بريدك بنجاح. يمكنك الآن تسجيل الدخول." },
      });
    }, 3000); // بعد 3 ثوانٍ

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="text-center py-20">
      <h1 className="text-xl font-bold mb-2">✅ تم تأكيد بريدك الإلكتروني</h1>
      <p>سيتم تحويلك إلى صفحة تسجيل الدخول خلال لحظات...</p>
    </div>
  );
};

export default EmailConfirmed;
