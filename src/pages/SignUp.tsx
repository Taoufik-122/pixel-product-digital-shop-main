import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, UserPlus, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient"; // عدل المسار حسب مشروعك

const formSchema = z
  .object({
    name: z.string().min(2, { message: "الاسم يجب أن يكون على الأقل حرفين" }),
    email: z.string().email({ message: "أدخل بريدًا إلكترونيًا صالحًا" }),
    password: z.string().min(6, { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["confirmPassword"],
  });

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSignUp = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setAuthError("");
    setSuccessMessage("");

    try {
      // التسجيل في supabase auth
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          },
        },
      });

      if (error) throw error;

      // إذا تم التسجيل بنجاح أضف المستخدم إلى جدول user
      if (data?.user) {
        await supabase.from("users").insert({

          id: data.user.id,
          email: values.email,
          name: values.name,
          is_admin: false,
        });
      }

      if (data?.user && !data.user.confirmed_at) {
        setSuccessMessage(
          "تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى التحقق من بريدك."
        );
        form.reset();
      } else {
        // إذا لا يوجد تأكيد بالبريد، توجه للصفحة الرئيسية أو المطلوبة
        navigate("/");
      }
    } catch (error: any) {
      console.error("Sign up error:", error);

      if (error.message?.includes("User already registered")) {
        setAuthError("هذا البريد الإلكتروني مسجل مسبقًا.");
      } else if (
        error.message?.includes("Password should be at least 6 characters")
      ) {
        setAuthError("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      } else if (error.message?.includes("Invalid email")) {
        setAuthError("البريد الإلكتروني غير صحيح.");
      } else {
        setAuthError("حدث خطأ أثناء التسجيل. حاول مجددًا.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container max-w-md mx-auto py-10 px-4">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              إنشاء حساب جديد
            </CardTitle>
            <CardDescription className="text-center">
              أدخل معلوماتك لإنشاء حساب
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{authError}</AlertDescription>
              </Alert>
            )}
            {successMessage && (
              <Alert className="mb-4 border-green-200 bg-green-50 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <AlertDescription className="text-green-800">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}

            {!successMessage && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSignUp)}
                  className="space-y-4"
                  noValidate
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: أحمد محمد"
                            autoComplete="name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="your@email.com"
                            type="email"
                            autoComplete="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>كلمة المرور</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              placeholder="••••••••"
                              type={showPassword ? "text" : "password"}
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            <span className="sr-only">
                              {showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                            </span>
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تأكيد كلمة المرور</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              placeholder="••••••••"
                              type={showConfirmPassword ? "text" : "password"}
                              autoComplete="new-password"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff size={18} />
                            ) : (
                              <Eye size={18} />
                            )}
                            <span className="sr-only">
                              {showConfirmPassword
                                ? "إخفاء كلمة المرور"
                                : "إظهار كلمة المرور"}
                            </span>
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center gap-2 justify-center">
                        <svg
                          className="animate-spin h-4 w-4 mr-2 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        جاري إنشاء الحساب...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 justify-center">
                        <UserPlus size={18} />
                        تسجيل
                      </span>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center text-muted-foreground mt-2">
              لديك حساب مسبقاً؟{" "}
              <Link to="/signin" className="text-brand-purple hover:underline">
                تسجيل الدخول
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default SignUp;
