import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart, User, Lock } from 'lucide-react';
import { MenuItem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuthStore, authActions } from '../store/authStore';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
}

export function OrderModal({ isOpen, onClose, item }: OrderModalProps) {
  const { language, t } = useLanguage();
  const user = useAuthStore(s => s.user);
  const login = authActions.login;
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestInfo, setGuestInfo] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!item) return null;

  const total = item.price * quantity;
  const pointsToEarn = Math.floor(total / 1000); // 1 point per 1000 VND

  const validateGuestForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!guestInfo.name.trim()) {
      newErrors.name = language === 'vi' ? 'Vui lòng nhập họ tên' : 'Please enter your name';
    }
    
    if (!guestInfo.phone.trim()) {
      newErrors.phone = language === 'vi' ? 'Vui lòng nhập số điện thoại' : 'Please enter phone number';
    } else if (!/^[0-9]{10,11}$/.test(guestInfo.phone.replace(/\s/g, ''))) {
      newErrors.phone = language === 'vi' ? 'Số điện thoại không hợp lệ' : 'Invalid phone number';
    }
    
    if (!guestInfo.email.trim()) {
      newErrors.email = language === 'vi' ? 'Vui lòng nhập email' : 'Please enter email';
    } else if (!/\S+@\S+\.\S+/.test(guestInfo.email)) {
      newErrors.email = language === 'vi' ? 'Email không hợp lệ' : 'Invalid email format';
    }
    
    if (!guestInfo.password.trim()) {
      newErrors.password = language === 'vi' ? 'Vui lòng nhập mật khẩu' : 'Please enter password';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // If user is not logged in, show guest form
      if (!user && !showGuestForm) {
        setShowGuestForm(true);
        setIsSubmitting(false);
        return;
      }
      
      // If guest form is shown, validate and try to register/login
      if (!user && showGuestForm) {
        if (!validateGuestForm()) {
          setIsSubmitting(false);
          return;
        }
        
        // Try to login first
        const loginSuccess = await login(guestInfo.email, guestInfo.password);
        
        if (!loginSuccess) {
          // If login fails, this would be registration in a real app
          alert(language === 'vi' 
            ? 'Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.'
            : 'Registration successful! Please login to continue.'
          );
          setIsSubmitting(false);
          return;
        }
      }
      
      // Mock order submission
      item.orders += quantity;
      
      alert(t('order.success'));
      onClose();
      resetModal();
    } catch (error) {
      alert(language === 'vi' ? 'Có lỗi xảy ra!' : 'An error occurred!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = () => {
    setShowGuestForm(false);
    setErrors({});
    
    // Close modal and open login modal
    onClose();
    // This would trigger the main login modal
    setTimeout(() => {
      // Trigger login modal from parent component
      window.dispatchEvent(new CustomEvent('openLoginModal'));
    }, 100);
  };

  const resetModal = () => {
    setShowGuestForm(false);
    setGuestInfo({ name: '', phone: '', email: '', password: '' });
    setQuantity(1);
    setNotes('');
    setErrors({});
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const isFormValid = showGuestForm 
    ? guestInfo.name && guestInfo.phone && guestInfo.email && guestInfo.password && Object.keys(errors).length === 0
    : true;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="relative">
              <img
                src={item.image}
                alt={language === 'vi' ? item.name : item.nameEn}
                className="w-full h-40 md:h-48 object-cover"
              />
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur-sm hover:bg-black/30 rounded-full transition-colors"
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 max-h-[calc(90vh-10rem)] overflow-y-auto">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('order.title')}
              </h2>
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {language === 'vi' ? item.name : item.nameEn}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {language === 'vi' ? item.description : item.descriptionEn}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('order.quantity')}
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-xl font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('order.notes')}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={language === 'vi' ? 'Ghi chú thêm...' : 'Additional notes...'}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white resize-none"
                    rows={3}
                  />
                </div>

                {/* Guest Information Form */}
                <AnimatePresence>
                  {!user && showGuestForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {language === 'vi' ? 'Thông tin khách hàng' : 'Customer Information'}
                      </h4>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {language === 'vi' ? 'Họ tên' : 'Full Name'}
                          </label>
                          <input
                            type="text"
                            value={guestInfo.name}
                            onChange={(e) => {
                              setGuestInfo({ ...guestInfo, name: e.target.value });
                              if (errors.name) {
                                setErrors({ ...errors, name: '' });
                              }
                            }}
                            className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white text-sm ${
                              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                          {errors.name && (
                            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            {language === 'vi' ? 'Số điện thoại' : 'Phone Number'}
                          </label>
                          <input
                            type="tel"
                            value={guestInfo.phone}
                            onChange={(e) => {
                              setGuestInfo({ ...guestInfo, phone: e.target.value });
                              if (errors.phone) {
                                setErrors({ ...errors, phone: '' });
                              }
                            }}
                            className={`w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white text-sm ${
                              errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="email"
                            value={guestInfo.email}
                            onChange={(e) => {
                              setGuestInfo({ ...guestInfo, email: e.target.value });
                              if (errors.email) {
                                setErrors({ ...errors, email: '' });
                              }
                            }}
                            className={`w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white text-sm ${
                              errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          {language === 'vi' ? 'Mật khẩu' : 'Password'}
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="password"
                            value={guestInfo.password}
                            onChange={(e) => {
                              setGuestInfo({ ...guestInfo, password: e.target.value });
                              if (errors.password) {
                                setErrors({ ...errors, password: '' });
                              }
                            }}
                            className={`w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-gray-900 dark:text-white text-sm ${
                              errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                          />
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleGuestLogin}
                          className="flex-1 py-2 px-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                          {language === 'vi' ? 'Đã có tài khoản?' : 'Have account?'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Total */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">
                      {item.price.toLocaleString('vi-VN')}₫ × {quantity}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {total.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                  {(user || showGuestForm) && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-amber-600">
                        {language === 'vi' ? 'Điểm tích lũy:' : 'Points earned:'}
                      </span>
                      <span className="text-amber-600 font-semibold">
                        +{pointsToEarn}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                    <div className="flex justify-between items-center font-bold text-lg">
                      <span className="text-gray-900 dark:text-white">{t('order.total')}:</span>
                      <span className="text-amber-600">{total.toLocaleString('vi-VN')}₫</span>
                    </div>
                  </div>
                </div>

                {user?.isInStore && (
                  <div className="text-center text-sm text-green-600 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                    {language === 'vi' 
                      ? '🎉 Bạn đang ở tiệm - Sẽ được phục vụ trực tiếp!'
                      : '🎉 You are in-store - Will be served directly!'
                    }
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting || !isFormValid}
                  whileHover={{ scale: isFormValid ? 1.02 : 1 }}
                  whileTap={{ scale: isFormValid ? 0.98 : 1 }}
                  className={`w-full flex items-center justify-center gap-2 py-3 font-semibold rounded-lg transition-colors ${
                    isFormValid && !isSubmitting
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isSubmitting 
                    ? (language === 'vi' ? 'Đang xử lý...' : 'Processing...')
                    : (!user && !showGuestForm)
                      ? (language === 'vi' ? 'Tiếp tục đặt món' : 'Continue Order')
                      : t('order.submit')
                  }
                </motion.button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}