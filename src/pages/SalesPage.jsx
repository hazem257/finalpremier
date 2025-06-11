import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import { CreditCard, DollarSign, ShoppingCart, TrendingUp } from "lucide-react";
const [stats, setStats] = useState({
	totalRevenue : 0
});
 const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 useEffect(() => {
	const fetchStats = async () => {
	  try {
		setLoading(true);
		const [
		  ordersRes,
		] = await Promise.all([
		  fetch('http://localhost/php-project/order1.php'),
		]);

		const orders = await ordersRes.json();

		// حساب إجمالي المبيعات من الطلبات
		const totalRevenue = orders.reduce((acc, order) => acc + parseFloat(order.price), 0);

		setStats({
			totalRevenue,
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
const SalesPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='الــمبيـعــات' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* SALES STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='مجموع المكسب' icon={DollarSign} value={salesStats.totalRevenue} color='#6366F1' />
					<StatCard
						name='متوسط ​​قيمة الطلب'
						icon={ShoppingCart}
						value={salesStats.averageOrderValue}
						color='#10B981'
					/>
					<StatCard
						name=' معدل النمو'
						icon={TrendingUp}
						value={salesStats.conversionRate}
						color='#F59E0B'
					/>
					<StatCard name='نمو المبيغات' icon={CreditCard} value={salesStats.salesGrowth} color='#EF4444' />
				</motion.div>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8'>
				</div>
			</main>
		</div>
	);
};
export default SalesPage;
