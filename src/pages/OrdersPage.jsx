import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import OrdersTable from "../components/orders/OrdersTable";
import { CheckCircle, Clock, DollarSign, ShoppingBag } from "lucide-react";
import QuranVerse from "../components/QuranVerse";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const API_BASE_URL = "http://localhost/php-project";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, customersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/order1.php`).then(res => res.json()),
          fetch(`${API_BASE_URL}/customer.php`).then(res => res.json())
        ]);
        setOrders(ordersRes);
        setCustomers(customersRes);
      } catch (error) {
        console.error("فشل في جلب البيانات:", error);
      }
    };
    fetchData();
  }, []);

  const orderStats = {
    totalOrders: orders.length,
    pendingOrders: orders.filter(order => order.status === "قيد المعالجة").length,
    completedOrders: orders.filter(order => order.status === "تم التسليم").length,
    totalRevenue: orders
      .reduce((sum, order) => sum + parseFloat(order.price), 0)
      .toLocaleString('en-EG', { style: 'currency', currency: 'EGP' })
  };

  return (
    <div className='flex-1 relative z-10 overflow-auto'>
      <Header title={"الــطـلـبـات"} />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name='مجموع الطلبات' 
          icon={ShoppingBag}
           value={orderStats.totalOrders}
            color='#6366F1' />
            
          <StatCard name='مجموع المكسب '
           icon={DollarSign}
            value={orderStats.totalRevenue} 
            color='#EF4444' 
            
            />
        </motion.div>

        <OrdersTable 
          orders={orders} 
          setOrders={setOrders} 
          customers={customers}
        />
        <QuranVerse
          arabicText="﴿ وَإِذَا جَاءَكَ الَّذِينَ يُؤْمِنُونَ بِآيَاتِنَا فَقُلْ سَلَامٌ عَلَيْكُمْ ۖ كَتَبَ رَبُّكُمْ عَلَىٰ نَفْسِهِ الرَّحْمَةَ ۖ أَنَّهُ مَنْ عَمِلَ مِنكُمْ سُوءًا بِجَهَالَةٍ ثُمَّ تَابَ مِن بَعْدِهِ وَأَصْلَحَ فَأَنَّهُ غَفُورٌ رَّحِيمٌ﴾"
          reference="﴿ الأنعام : 54﴾"
        />
      </main>
    </div>
  );
};

export default OrdersPage;