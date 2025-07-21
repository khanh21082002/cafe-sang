import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronDown, Crown, Shield, User } from 'lucide-react';
import { useAuthStore, authActions } from '../store/authStore';
import { useLanguage } from '../contexts/LanguageContext';

export function DemoUserSwitcher() {
  const user = useAuthStore(s => s.user);
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const userTypes = [
    {
      type: 'customer' as const,
      icon: User,
      label: language === 'vi' ? 'Khách hàng' : 'Customer',
      description: language === 'vi' ? 'Nguyễn Văn An - 150 điểm' : 'Nguyen Van An - 150 points',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      type: 'staff' as const,
      icon: Shield,
      label: language === 'vi' ? 'Nhân viên' : 'Staff',
      description: language === 'vi' ? 'Trần Thị Bình - 50 điểm' : 'Tran Thi Binh - 50 points',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      type: 'admin' as const,
      icon: Crown,
      label: language === 'vi' ? 'Quản lý' : 'Admin',
      description: language === 'vi' ? 'Lê Văn Cường - 500 điểm' : 'Le Van Cuong - 500 points',
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  const handleUserSwitch = (userType: 'customer' | 'staff' | 'admin') => {
    const demoUsers = {
      customer: {
        id: '1',
        name: 'Nguyễn Văn An',
        email: 'customer@cafe.com',
        phone: '0123456789',
        points: 150,
        isInStore: true,
        role: 'customer' as const
      },
      staff: {
        id: '2',
        name: 'Trần Thị Bình',
        email: 'staff@cafe.com',
        phone: '0987654321',
        points: 50,
        isInStore: true,
        role: 'staff' as const
      },
      admin: {
        id: '3',
        name: 'Lê Văn Cường',
        email: 'admin@cafe.com',
        phone: '0555666777',
        points: 500,
        isInStore: false,
        role: 'admin' as const
      }
    };
    authActions.switchUser(demoUsers[userType]);
    setIsOpen(false);
  };

  if (!user) return null;

  const currentUserType = userTypes.find(type => type.type === user.role);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
        >
          <Users className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">
            {language === 'vi' ? 'Chuyển người dùng' : 'Switch User'}
          </span>
          <ChevronDown className={`h-4 w-4 text-gray-600 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full right-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {language === 'vi' ? 'Chọn vai trò demo' : 'Select Demo Role'}
                </h3>
              </div>
              
              <div className="p-2">
                {userTypes.map((userType) => {
                  const IconComponent = userType.icon;
                  const isActive = user.role === userType.type;
                  
                  return (
                    <motion.button
                      key={userType.type}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleUserSwitch(userType.type)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <div className={`p-2 rounded-full ${
                        isActive ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        <IconComponent className={`h-4 w-4 ${
                          isActive ? 'text-white' : userType.color
                        }`} />
                      </div>
                      
                      <div className="flex-1 text-left">
                        <div className={`text-sm font-medium ${
                          isActive ? 'text-amber-800 dark:text-amber-200' : 'text-gray-900 dark:text-white'
                        }`}>
                          {userType.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {userType.description}
                        </div>
                      </div>
                      
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-amber-500 rounded-full"
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}