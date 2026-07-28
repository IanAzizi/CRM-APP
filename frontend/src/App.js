import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardManager from './pages/DashboardManager';
import UserDashboard from './pages/UserDashboard';
import CustomerVisitForm from './pages/CustomerVisitForm';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterUnit from './pages/RegisterUnit';

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import jMoment from "moment-jalaali";

// 👉 این دو خط برای تم MUI
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// فعال‌سازی تقویم فارسی
jMoment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

// تم ساده برای Material UI (میتونی شخصی‌سازی کنی)
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="fa">
        <Router>
          <Routes>
            {/* صفحه لاگین */}
            <Route path="/login" element={<Login />} />

            {/* داشبورد مدیر */}
            <Route
              path="/dashboard/manager"
              element={
                <ProtectedRoute allowedRoles={['manager']}>
                  <DashboardManager />
                </ProtectedRoute>
              }
            />

            {/* داشبورد کاربر */}
            <Route
              path="/dashboard/user"
              element={
                <ProtectedRoute allowedRoles={['user', 'gard', 'crm']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />

            {/* فرم بازدید مشتری */}
            <Route path="/customer-visit" element={<CustomerVisitForm />} />

            {/* فرم جدید ثبت واحد */}
            <Route path="/register-unit" element={<RegisterUnit />} />
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
