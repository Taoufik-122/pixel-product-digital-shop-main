
import React from "react";
import { Link, useParams } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { ShoppingCart, Layers, Package, Download, Edit } from "lucide-react";
import { useCart } from "@/context/CartContext";

// List of available categories
const categories = [
  { id: "templates", name: "Templates", icon: Layers },
  { id: "graphics", name: "Graphics", icon: Layers },
  { id: "software", name: "Software", icon: Package },
];

const CategorySidebar = () => {
  const { category } = useParams<{ category?: string }>();
  const { items } = useCart();
  const { isMobile } = useSidebar();
  
  return (
    <Sidebar
      variant={isMobile ? "sidebar" : "floating"}
      collapsible={isMobile ? "offcanvas" : "icon"}
    >
      <SidebarHeader className="flex items-center justify-between">
        <h3 className="text-lg font-semibold ml-2">Categories</h3>
        <SidebarTrigger className="md:hidden" />
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Browse</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild
                  isActive={!category}
                  tooltip="All Products"
                >
                  <Link to="">
                    <Package size={20} />
                    <span>All Products</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {categories.map((cat) => (
                <SidebarMenuItem key={cat.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={category === cat.id}
                    tooltip={cat.name}
                  >
                    <Link to={`/categories/${cat.id}`}>
                      <cat.icon size={20} />
                      <span>{cat.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Shopping Cart"
                >
                  <Link to="/cart">
                    <ShoppingCart size={20} />
                    <span className="flex justify-between w-full">
                      Cart
                      {items.length > 0 && (
                        <span className="bg-brand-purple text-white text-xs rounded-full px-2 py-0.5 ml-2">
                          {items.length}
                        </span>
                      )}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Downloads"
                >
                  <Link to="/checkout/success#download">
                    <Download size={20} />
                    <span>Downloads</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Admin Dashboard"
                >
                  <Link to="/admin">
                    <Edit size={20} />
                    <span>Admin Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default CategorySidebar;
