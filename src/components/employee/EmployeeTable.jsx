import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Edit, Trash2, Plus, Download } from "lucide-react";
import axios from 'axios';
import * as XLSX from 'xlsx';

const API_URL = 'http://localhost/php-project/employee.php';
const PHONES_API = 'http://localhost/php-project/phonenum.php';
const BRANCHES_API = 'http://localhost/php-project/branch.php';

const EmployeeTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    shift: "Morning",
    income: "",
    status: "",
    branch_id: "",
    phones: []
  });

  useEffect(() => {
    const fetchData = async () => {
      await fetchBranches();
      await fetchEmployees();
    };
    fetchData();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      setEmployees(response.data.data);
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error);
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axios.get(BRANCHES_API);
      setBranches(response.data.data || response.data || []);
    } catch (error) {
      console.error('خطأ في جلب الفروع:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.phones];
    newPhones[index] = value;
    setFormData({ ...formData, phones: newPhones });
  };

  const handleAddPhoneField = () => {
    setFormData({ ...formData, phones: [...formData.phones, ""] });
  };

  const handleRemovePhoneField = (index) => {
    const newPhones = formData.phones.filter((_, i) => i !== index);
    setFormData({ ...formData, phones: newPhones });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) setCurrentEmployee(null);
  };

  const handleEditEmployee = (employee) => {
    setCurrentEmployee(employee);
    setFormData({
      name: employee.name,
      shift: employee.shift,
      income: employee.income,
      status: employee.status,
      branch_id: employee.branch_id?.toString() || "",
      phones: employee.phones?.split(',') || []
    });
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = async (id) => {
    if (window.confirm("هل أنت متأكد من الحذف؟")) {
      try {
        await axios.delete(`${API_URL}?id=${id}`);
        await fetchEmployees();
      } catch (error) {
        console.error('خطأ في الحذف:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        shift: formData.shift,
        income: formData.income,
        status: formData.status,
        branch_id: Number(formData.branch_id)
      };

      let employeeId = currentEmployee?.id;

      if (currentEmployee) {
        await axios.put(`${API_URL}?id=${employeeId}`, payload);
      } else {
        const res = await axios.post(API_URL, payload);
        employeeId = res.data.id;
      }

      await axios.post(PHONES_API, {
        employeeID: employeeId,
        phones: formData.phones.filter(phone => phone.trim() !== "")
      });

      await fetchEmployees();
      setIsModalOpen(false);
    } catch (error) {
      console.error('خطأ في الحفظ:', error.response?.data || error.message);
    }
  };

  const handleExportToExcel = () => {
    const dataToExport = employees.map(employee => ({
      "الاسم": employee.name,
      "الفرع": employee.branch_name,
      "الهواتف": employee.phones?.replace(/,/g, '\n'),
      "الفترة": employee.shift,
      "الراتب": `${employee.income} جنيه`,
      "الوظيفة": employee.status
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "الموظفين");
    XLSX.writeFile(wb, "الموظفين.xlsx");
  };

  const filteredEmployees = employees.filter(employee => 
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    employee.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-gray-100'>إدارة الموظفين</h2>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <input
              type='text'
              placeholder='ابحث عن موظف...'
              className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExportToExcel}
              className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2'
            >
              <Download size={18} />
              تصدير Excel
            </button>
            <button 
              onClick={() => {
                setFormData({
                  name: "",
                  shift: "Morning",
                  income: "",
                  status: "",
                  branch_id: "",
                  phones: []
                });
                setIsModalOpen(true);
              }}
              className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2'
            >
              <Plus size={18} />
              إضافة موظف
            </button>
          </div>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-700'>
          <thead className="bg-gray-800">
            <tr>
              <th className='px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase'>الاسم</th>
              <th className='px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase'>الفرع</th>
              <th className='px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase'>الهواتف</th>
              <th className='px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase'>الفترة</th>
              <th className='px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase'>الراتب</th>
              <th className='px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase'>الوظيفة</th>
              <th className='px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase'>الإجراءات</th>
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-700'>
            {filteredEmployees.map((employee) => (
              <motion.tr
                key={employee.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className='px-4 py-4 text-sm text-gray-100 text-right'>{employee.name}</td>
                <td className='px-4 py-4 text-sm text-gray-300 text-right'>{employee.branch_name}</td>
                <td className='px-4 py-4 text-sm text-gray-300 text-right'>
                  {employee.phones?.split(',').map((phone, index) => (
                    <div key={index}>{phone}</div>
                  ))}
                </td>
                <td className='px-4 py-4 text-sm text-gray-300 text-right'>{employee.shift}</td>
                <td className='px-4 py-4 text-right'>
                  <span className='inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-800 text-blue-100'>
                    {employee.income} جنيه
                  </span>
                </td>
                <td className='px-4 py-4 text-right'>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                    employee.status === "Manager" 
                      ? "bg-green-800 text-green-100"
                      : "bg-red-800 text-red-100"
                  }`}>
                    {employee.status}
                  </span>
                </td>
                <td className='px-4 py-4 text-right'>
                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => handleEditEmployee(employee)}
                      className='text-indigo-400 hover:text-indigo-300'
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className='text-red-400 hover:text-red-300'
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              {currentEmployee ? "تعديل الموظف" : "إضافة موظف جديد"}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">الاسم الكامل</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">الفرع</label>
                    <select
                      name="branch_id"
                      value={formData.branch_id}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">اختر فرعًا</option>
                      {branches.map((branch) => (
                        <option 
                          key={branch.id || branch.ID} 
                          value={branch.id || branch.ID}
                        >
                          {branch.branch_name || branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">الراتب</label>
                    <input
                      type="number"
                      name="income"
                      value={formData.income}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">الفترة</label>
                    <select
                      name="shift"
                      value={formData.shift}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="Morning">صباحية</option>
                      <option value="Evening">مسائية</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">الوظيفة</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">اختر الوظيفة</option>
                      <option value="Manager">مدير</option>
                      <option value="Employee">موظف</option>
                      <option value="Supervisor">مشرف</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-gray-300 text-sm mb-2">أرقام الهواتف</label>
                {formData.phones.map((phone, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="أدخل رقم الهاتف"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoneField(index)}
                      className="px-3 text-red-500 hover:text-red-400"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddPhoneField}
                  className="text-blue-500 hover:text-blue-400 flex items-center gap-1 mt-2"
                >
                  <Plus size={16} />
                  إضافة رقم جديد
                </button>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-300 hover:text-white"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  {currentEmployee ? "حفظ التغييرات" : "إضافة موظف"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default EmployeeTable;