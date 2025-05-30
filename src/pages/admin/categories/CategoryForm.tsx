import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

type CategoryFormValues = {
  name: string;
  slug: string;
};

const CategoryForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const form = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      slug: ""
    }
  });

  // جلب بيانات الصنف عند التعديل
  useEffect(() => {
    if (isEditing) {
      axios
        .get(`http://localhost:5000/api/categories/${id}`)
        .then((res) => {
          form.reset({
            name: res.data.name,
            slug: res.data.slug
          });
        })
        .catch((err) => {
          console.error("خطأ في جلب الصنف:", err);
          alert("حدث خطأ أثناء تحميل الصنف.");
        });
    }
  }, [id, isEditing, form]);

  // إنشاء أو تعديل التصنيف
  const onSubmit = async (data: CategoryFormValues) => {
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/categories/${id}`, data);
      } else {
        await axios.post("http://localhost:5000/api/categories", data);
      }

      navigate("/admin/categories");
    } catch (error) {
      console.error("فشل الحفظ:", error);
      alert("حدث خطأ أثناء الحفظ.");
    }
  };

  // توليد slug من الاسم تلقائياً
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "تعديل التصنيف" : "إضافة تصنيف جديد"}
      </h1>

      <div className="max-w-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم التصنيف</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسم التصنيف"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!isEditing) {
                          form.setValue("slug", generateSlug(e.target.value));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: digital-templates" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button type="submit">
                {isEditing ? "تحديث" : "إنشاء"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/admin/categories")}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CategoryForm;
