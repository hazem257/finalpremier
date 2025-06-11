//import { UsersIcon, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/common/Header";
import QuranVerse from '../components/QuranVerse';
import StatCard from "../components/common/StatCard";
import EmployeeTable from "../components/employee/EmployeeTable";

const Employee = () => {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    newUsersToday: 0,
  });

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost/php-project/employee_stats.php');
      setUserStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='الــمـوظـفـيـن' />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        <motion.div
          className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
        </motion.div>

        <EmployeeTable onEmployeeUpdate={fetchStats} />
        
        <div className="quran">
          <QuranVerse
            arabicText="﴿ ۞ إِنَّ اللَّهَ اشْتَرَىٰ مِنَ الْمُؤْمِنِينَ أَنفُسَهُمْ وَأَمْوَالَهُم بِأَنَّ لَهُمُ الْجَنَّةَ ۚ يُقَاتِلُونَ فِي سَبِيلِ اللَّهِ فَيَقْتُلُونَ وَيُقْتَلُونَ ۖ وَعْدًا عَلَيْهِ حَقًّا فِي التَّوْرَاةِ وَالْإِنجِيلِ وَالْقُرْآنِ ۚ وَمَنْ أَوْفَىٰ بِعَهْدِهِ مِنَ اللَّهِ ۚ فَاسْتَبْشِرُوا بِبَيْعِكُمُ الَّذِي بَايَعْتُم بِهِ ۚ وَذَٰلِكَ هُوَ الْفَوْزُ الْعَظِيمُ﴾"
            reference="﴿ التوبة: 111﴾"
          />
        </div>
      </main>
    </div>
  );
};

export default Employee;
