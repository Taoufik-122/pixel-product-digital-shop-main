import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
}

const CategoriesList = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  // جلب التصنيفات عند تحميل الصفحة
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("فشل في جلب التصنيفات:", error);
      }
    };

    fetchCategories();
  }, []);

  // حذف تصنيف
  const handleDelete = async (id: number) => {
    if (window.confirm("هل أنت متأكد أنك تريد حذف هذا التصنيف؟")) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`);
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
      } catch (error) {
        console.error("فشل في حذف التصنيف:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link to="/admin/categories/new">
          <Button>Add New Category</Button>
        </Link>
      </div>

      <Table>
        <TableCaption>List of all available categories</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link to={`/admin/categories/edit/${category.id}`}>
                    <Button size="sm" variant="outline">
                      <Edit size={16} />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoriesList;
