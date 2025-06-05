import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabaseClient";

type ProductFormValues = {
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  featured: boolean;
};

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== undefined;

  const [categories, setCategories] = useState<{ name: string }[]>([]);

  const form = useForm<ProductFormValues>({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: "",
      image: "",
      featured: false,
    },
    mode: "onChange",
  });

  const { watch } = form;
  const title = watch("title");
  const description = watch("description");
  const price = watch("price");
  const category = watch("category");
  const image = watch("image");

  // جلب التصنيفات من API
 useEffect(() => {
  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("name");
    if (error) {
      console.error("❌ خطأ في تحميل التصنيفات:", error.message);
    } else {
      setCategories(data);
    }
  };
  fetchCategories();
}, []);

  // جلب بيانات المنتج في حالة التعديل
 useEffect(() => {
  if (id) {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", parseInt(id))
        .single();

      if (error) {
        console.error("❌ خطأ في جلب المنتج:", error.message);
      } else if (data) {
        form.reset({
          title: data.title,
          description: data.description,
          price: data.price,
          category: data.category,
          image: data.image,
          featured: data.featured || false,
        });
      }
    };
    fetchProduct();
  }
}, [id, form]);


  // إرسال النموذج
const onSubmit = async (data: ProductFormValues) => {
  try {
    if (isEditing) {
      const { error } = await supabase
        .from("products")
        .update(data)
        .eq("id", parseInt(id!));

      if (error) throw error;
      alert("✅ تم تعديل المنتج بنجاح");
    } else {
      const { error } = await supabase
        .from("products")
        .insert([data]);

      if (error) throw error;
      alert("✅ تم إضافة المنتج بنجاح");
    }

    navigate("/admin/products");
  } catch (error: any) {
    console.error("❌ خطأ أثناء إرسال البيانات:", error.message);
    alert("❌ فشل في حفظ المنتج. يرجى المحاولة لاحقًا.");
  }
};

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Edit Product" : "Add New Product"}
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ======= FORM ======= */}
        <div className="max-w-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ✅ اختيار التصنيف من قاعدة البيانات */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        {...field}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.name} value={cat.name}>
                            {cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4"
                      />
                    </FormControl>
                    <FormLabel>Featured Product</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button type="submit">
                  {isEditing ? "Update Product" : "Create Product"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/products")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* ======= LIVE PREVIEW ======= */}
        <div>
          {image && (
            <div className="bg-white rounded-lg overflow-hidden shadow-md mb-4">
              <img
                src={image}
                alt={title}
                onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          <h1 className="text-3xl font-bold mb-2">
            {title || "Product Title"}
          </h1>

          <div className="mb-4">
            <span className="inline-block bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm">
              {category}
            </span>
          </div>

          <div className="text-2xl font-bold mb-6 text-brand-purple">
            ${!isNaN(Number(price)) ? Number(price).toFixed(2) : "0.00"}
          </div>

          <p className="text-gray-700 mb-8">
            {description || "Product description will appear here..."}
          </p>

          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <h3 className="font-bold mb-2">What's Included:</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Instant digital download</li>
              <li>Full commercial usage rights</li>
              <li>Detailed documentation</li>
              <li>Free updates</li>
              <li>30-day money-back guarantee</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
