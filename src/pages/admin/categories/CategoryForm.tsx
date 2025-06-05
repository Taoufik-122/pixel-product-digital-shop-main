import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { supabase } from "@/lib/supabaseClient";

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
  const fetchCategory = async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("خطأ في جلب الصنف:", error.message);
      alert("حدث خطأ أثناء تحميل الصنف.");
    } else {
      form.reset({
        name: data.name,
        slug: data.slug,
      });
    }
  };

  if (isEditing) {
    fetchCategory();
  }
}, [id, isEditing, form]);


  // إنشاء أو تعديل التصنيف
  const onSubmit = async (data: CategoryFormValues) => {
  try {
    if (isEditing) {
      const { error } = await supabase
        .from("categories")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("categories").insert(data);
      if (error) throw error;
    }

    navigate("/admin/categories");
  } catch (error: any) {
    console.error("فشل الحفظ:", error.message);
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
