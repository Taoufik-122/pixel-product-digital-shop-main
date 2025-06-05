import { Check, Clock, Truck, X, RotateCcw } from "lucide-react";
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(`
            *,
            items:order_items(*)
          `);

        if (error) throw error;

        const ordersWithTotal = data.map(order => {
          const total = order.items?.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0) || 0;
          return { ...order, total, status: order.status || "pending" };
        });

        setOrders(ordersWithTotal);
      } catch (err) {
        setError(err.message || "حدث خطأ غير معروف أثناء تحميل الطلبات.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const setLoadingState = (orderId, action, isLoading) => {
    setLoadingStates(prev => ({
      ...prev,
      [`${orderId}-${action}`]: isLoading,
    }));
  };

  const showToast = (message, type = "success") => {
    const toastEl = document.createElement("div");
    toastEl.innerHTML = `
      <div class="fixed top-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-72">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full ${
            type === "success" ? "bg-green-500" : type === "warning" ? "bg-yellow-500" : "bg-red-500"
          }"></div>
          <span class="text-sm font-medium">${message}</span>
        </div>
      </div>
    `;
    document.body.appendChild(toastEl);
    setTimeout(() => {
      document.body.removeChild(toastEl);
    }, 3000);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "فشل في تحديث الحالة");
      }

      setOrders(prev =>
        prev.map(order => (order.id === Number(orderId) ? { ...order, status: newStatus } : order))
      );

      showToast(`تم تحديث حالة الطلب ${orderId} إلى ${newStatus}`);
    } catch (err) {
      showToast(`حدث خطأ أثناء تحديث الطلب: ${err.message}`, "error");
    }
  };

  const handleConfirmOrder = orderId => {
    setLoadingState(orderId, "confirm", true);
    updateOrderStatus(orderId, "confirmed").finally(() => setLoadingState(orderId, "confirm", false));
  };

  const handleShipOrder = orderId => {
    setLoadingState(orderId, "ship", true);
    updateOrderStatus(orderId, "shipping").finally(() => setLoadingState(orderId, "ship", false));
  };

  const handleCancelOrder = orderId => {
    setLoadingState(orderId, "cancel", true);
    updateOrderStatus(orderId, "cancelled").finally(() => setLoadingState(orderId, "cancel", false));
  };

  const handleReactivateOrder = orderId => {
    setLoadingState(orderId, "reactivate", true);
    updateOrderStatus(orderId, "pending").finally(() => setLoadingState(orderId, "reactivate", false));
  };

  const getStatusBadge = status => {
    const statusConfig = {
      pending: { icon: Clock, text: "في الانتظار", className: "bg-amber-100 text-amber-800" },
      confirmed: { icon: Check, text: "مؤكد", className: "bg-green-100 text-green-800" },
      shipping: { icon: Truck, text: "قيد الشحن", className: "bg-blue-100 text-blue-800" },
      cancelled: { icon: X, text: "ملغي", className: "bg-red-100 text-red-800" },
    };
    const config = statusConfig[status];
    if (!config) return null;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        <Icon className="w-3 h-3 ml-1" />
        {config.text}
      </span>
    );
  };

  const getActionButtons = order => {
    const isLoading = action => loadingStates[`${order.id}-${action}`];
    const commonClasses = "text-white px-3 py-1 rounded flex items-center gap-1 text-sm";

    switch (order.status) {
      case "pending":
        return (
          <div className="flex gap-2">
            <button
              disabled={isLoading("confirm")}
              onClick={e => {
                e.stopPropagation();
                handleConfirmOrder(order.id);
              }}
              className={`${commonClasses} bg-green-500 hover:bg-green-600`}
            >
              {isLoading("confirm") ? <LoadingSpinner /> : <Check />} تأكيد
            </button>
            <button
              disabled={isLoading("cancel")}
              onClick={e => {
                e.stopPropagation();
                handleCancelOrder(order.id);
              }}
              className={`${commonClasses} bg-red-500 hover:bg-red-600`}
            >
              {isLoading("cancel") ? <LoadingSpinner /> : <X />} إلغاء
            </button>
          </div>
        );
      case "confirmed":
        return (
          <div className="flex gap-2">
            <button
              disabled={isLoading("ship")}
              onClick={e => {
                e.stopPropagation();
                handleShipOrder(order.id);
              }}
              className={`${commonClasses} bg-blue-500 hover:bg-blue-600`}
            >
              {isLoading("ship") ? <LoadingSpinner /> : <Truck />} شحن
            </button>
            <button
              disabled={isLoading("cancel")}
              onClick={e => {
                e.stopPropagation();
                handleCancelOrder(order.id);
              }}
              className={`${commonClasses} bg-red-500 hover:bg-red-600`}
            >
              {isLoading("cancel") ? <LoadingSpinner /> : <X />} إلغاء
            </button>
          </div>
        );
      case "shipping":
        return (
          <button
            disabled
            className="bg-gray-400 text-white px-3 py-1 rounded flex items-center gap-1 cursor-not-allowed text-sm"
          >
            <Truck /> قيد الشحن
          </button>
        );
      case "cancelled":
        return (
          <button
            disabled={isLoading("reactivate")}
            onClick={e => {
              e.stopPropagation();
              handleReactivateOrder(order.id);
            }}
            className="bg-yellow-400 text-black px-3 py-1 rounded flex items-center gap-1 hover:bg-yellow-500 text-sm"
          >
            {isLoading("reactivate") ? <LoadingSpinner /> : <RotateCcw />} إعادة تفعيل
          </button>
        );
      default:
        return null;
    }
  };

  const toggleOrderDetails = orderId => {
    setExpandedOrder(prev => (prev === orderId ? null : orderId));
  };

  const LoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
  );

  if (loading) return <div className="p-6 text-center">جارٍ تحميل الطلبات...</div>;
  if (error) return <div className="p-6 text-center text-red-600">حدث خطأ: {error}</div>;

  return (
    <div className="space-y-6 p-6" dir="rtl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">إدارة طلبات العملاء</h2>
        <p className="text-gray-600">قم بإدارة ومتابعة جميع طلبات العملاء بسهولة</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden border">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            قائمة الطلبات ({orders.length} طلب)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 text-right font-semibold text-gray-700">رقم الطلب</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-700">العميل</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-700">التاريخ</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-700">المجموع</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-700">الحالة</th>
                <th className="px-6 py-4 text-right font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <React.Fragment key={order.id}>
                  <tr
                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 border-b hover:shadow-sm"
                    onClick={() => toggleOrderDetails(order.id)}
                  >
                    <td className="px-6 py-4 font-mono text-sm font-medium text-blue-600">{order.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{order.first_name || "عميل مجهول"}</div>
                        <div className="text-xs text-gray-500">{order.email || ""}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {order.date || (order.created_at ? order.created_at.split("T")[0] : "")}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">{order.total.toFixed(2)} د.إ</span>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                    <td className="px-6 py-4">{getActionButtons(order)}</td>
                  </tr>

                  {expandedOrder === order.id && (
                    <tr className="bg-gray-50 border-b">
                      <td colSpan={6} className="p-4 text-sm">
                        <div>
                          <h4 className="font-semibold mb-2">تفاصيل الطلب</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {order.items?.map(item => (
                              <li key={item.id || item.name}>
                                {item.name} - {item.quantity} × {item.price.toFixed(2)} د.إ
                              </li>
                            )) || <li>لا توجد عناصر</li>}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
