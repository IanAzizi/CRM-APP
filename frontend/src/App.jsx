import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardManager from './pages/DashboardManager';
import UserDashboard from './pages/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerVisitForm from './pages/CustomerVisitForm';

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import jMoment from "moment-jalaali";

// فعال‌سازی تقویم فارسی
jMoment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale="fa">
      <Router>
        <Routes>
          {/* صفحه لاگین */}
          <Route path="/login" element={<Login />} />

          {/* صفحه داشبورد منیجر */}
          <Route
            path="/dashboard/manager"
            element={
              <ProtectedRoute allowedRoles={['manager']}>
                <DashboardManager />
              </ProtectedRoute>
            }
          />
        y\
          {/* صفحه داشبورد کاربر */}
          <Route
            path="/dashboard/user"
            element={
              <ProtectedRoute allowedRoles={['user', 'gard', 'crm']}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* اگر نیاز به مسیرهای دیگه بود، اینجا می‌تونی اضافه کنی */}
          
        </Routes>
      </Router>
    </LocalizationProvider>
  );
}

export default App;
