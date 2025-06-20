import { UserCheck, UserPlus, UsersIcon,  HandCoins  } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import UsersTable from "../components/users/UsersTable";
import QuranVerse from "../components/QuranVerse";

const userStats = {
	totalUsers: ``,
	newUsersToday: ``,
	activeUsers: ``,
	userPoints: ``,
};

const UsersPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='المــسـتخـدمـيـن' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
				</motion.div>

				<UsersTable />
				<div className="quran">
			<QuranVerse
			arabicText="﴿ اللَّهُ يَبْسُطُ الرِّزْقَ لِمَن يَشَاءُ وَيَقْدِرُ ۚ وَفَرِحُوا بِالْحَيَاةِ الدُّنْيَا وَمَا الْحَيَاةُ الدُّنْيَا فِي الْآخِرَةِ إِلَّا مَتَاعٌ﴾"
          reference="﴿الرعد: 26﴾"
			/>
	</div>
			</main>
		</div>
	);
};
export default UsersPage;
