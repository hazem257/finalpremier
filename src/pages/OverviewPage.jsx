import { useState, useEffect } from "react";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import ProductsTable from "../components/products/ProductsTable";
import QuranVerse from "../components/QuranVerse"
const OverviewPage = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalUsers: 0,
    totalEmployees: 0,
    totalSuppliers: 0,
    totalProducts: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [
          productsRes,
          employeesRes,
          usersRes,
          suppliersRes,
          ordersRes,
        ] = await Promise.all([
          fetch('http://localhost/php-project/products.php?action=get'),
          fetch('http://localhost/php-project/employee.php'),
          fetch('http://localhost/php-project/customer.php'),
          fetch('http://localhost/php-project/supplier.php?action=get'),
          fetch('http://localhost/php-project/order1.php'),
        ]);

        const products = await productsRes.json();
        const employees = await employeesRes.json();
        const users = await usersRes.json();
        const suppliers = await suppliersRes.json();
        const orders = await ordersRes.json();

        // حساب إجمالي المبيعات من الطلبات
        const totalSales = orders.reduce((acc, order) => acc + parseFloat(order.price), 0);

        setStats({
          totalSales,
          totalUsers: users.data?.length || 0,
          totalEmployees: employees.data?.length || 0,
          totalSuppliers: suppliers.length || 0,
          totalProducts: products.length || 0,
          totalOrders: orders.length || 0,
        });
      } catch (err) {
        setError('فشل في تحميل البيانات');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='نــظــرة عـامـــة' />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2">جاري تحميل البيانات...</p>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : (
          <>
            {/* STATS */}
            <motion.div
              className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <StatCard 
                name='مــجــمــوع المـبــيــعــات' 
                icon={Zap} 
                value={`${stats.totalSales.toLocaleString()} EGP`} 
                color='#6366F1' 
              />
              <StatCard 
                name='المستخدمين' 
                icon={Users} 
                value={stats.totalUsers.toLocaleString()} 
                color='#8B5CF6' 
              />
              <StatCard 
                name='الموظفين' 
                icon={Users} 
                value={stats.totalEmployees.toLocaleString()} 
                color='#8B5CF6' 
              />
              <StatCard 
                name='الموردين' 
                icon={Zap} 
                value={stats.totalSuppliers.toLocaleString()} 
                color='#6366F1' 
              />
              <StatCard 
                name='المنتجات' 
                icon={ShoppingBag} 
                value={stats.totalProducts.toLocaleString()} 
                color='#EC4899' 
              />
              <StatCard 
                name='الطلبات' 
                icon={ShoppingBag} 
                value={stats.totalOrders.toLocaleString()} 
                color='#EC4899' 
              />
            </motion.div>

            {/* CHARTS */}
            <div className='grid grid-cols-1 lg:grid-cols-1 gap-8'>
              <ProductsTable/>
              <div className="quran" style={{width:"100%", display:"flex",alignItems:"center", justifyContent:"center"}}>
                 <QuranVerse
  arabicText="﴿ُوَإِذۡ بَوَّأۡنَا لِإِبۡرَٰهِيمَ مَكَانَ ٱلۡبَيۡتِ أَن لَّا تُشۡرِكۡ بِي شَيۡـٔٗا وَطَهِّرۡ بَيۡتِيَ لِلطَّآئِفِينَ وَٱلۡقَآئِمِينَ وَٱلرُّكَّعِ ٱلسُّجُودِ (26) وَأَذِّن فِي ٱلنَّاسِ بِٱلۡحَجِّ يَأۡتُوكَ رِجَالٗا وَعَلَىٰ كُلِّ ضَامِرٖ يَأۡتِينَ مِن كُلِّ فَجٍّ عَمِيقٖ (27) لِّيَشۡهَدُواْ مَنَٰفِعَ لَهُمۡ وَيَذۡكُرُواْ ٱسۡمَ ٱللَّهِ فِيٓ أَيَّامٖ مَّعۡلُومَٰتٍ عَلَىٰ مَا رَزَقَهُم مِّنۢ بَهِيمَةِ ٱلۡأَنۡعَٰمِۖ فَكُلُواْ مِنۡهَا وَأَطۡعِمُواْ ٱلۡبَآئِسَ ٱلۡفَقِيرَ (28) ثُمَّ لۡيَقۡضُواْ تَفَثَهُمۡ وَلۡيُوفُواْ نُذُورَهُمۡ وَلۡيَطَّوَّفُواْ بِٱلۡبَيۡتِ ٱلۡعَتِيقِ (29) ذَٰلِكَۖ وَمَن يُعَظِّمۡ حُرُمَٰتِ ٱللَّهِ فَهُوَ خَيۡرٞ لَّهُۥ عِندَ رَبِّهِۦۗ وَأُحِلَّتۡ لَكُمُ ٱلۡأَنۡعَٰمُ إِلَّا مَا يُتۡلَىٰ عَلَيۡكُمۡۖ فَٱجۡتَنِبُواْ ٱلرِّجۡسَ مِنَ ٱلۡأَوۡثَٰنِ وَٱجۡتَنِبُواْ قَوۡلَ ٱلزُّورِ (30)﴾"
  reference="الحج: [25:30]"
/>
              </div>
             
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default OverviewPage;