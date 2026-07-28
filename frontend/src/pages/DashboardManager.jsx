import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_OPTIONS = {
  storeVisit: {
    name: 'گزارش بازدید فروشگاه‌ها',
    getAll: 'http://office.bandarabbasmall.com:5000/api/storeVisit/all',
    exportExcel: 'http://office.bandarabbasmall.com:5000/api/storeVisit/export/excel',
  },
  customerVisit: {
    name: 'گزارش شکایات مشتریان',
    getAll: 'http://office.bandarabbasmall.com:5000/api/customerVisit/all',
    exportExcel: 'http://office.bandarabbasmall.com:5000/api/customerVisit/export/excel',
  },
  units: {
    name: 'لیست واحدها',
    getAll: 'http://office.bandarabbasmall.com:5000/api/register-unit/unit/get',
  },
};

function ManagerDashboard() {
  const [currentTab, setCurrentTab] = useState('storeVisit');
  const [data, setData] = useState([]); // داده‌های هر تب
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // گرفتن داده‌ها براساس تب انتخاب شده
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    setData([]);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(API_OPTIONS[currentTab].getAll, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // داده‌ها می‌تونه داخل res.data.visits یا res.data.units باشه
      if (currentTab === 'storeVisit' || currentTab === 'customerVisit') {
        setData(Array.isArray(res.data.visits) ? res.data.visits : res.data.visits || []);
      } else if (currentTab === 'units') {
        setData(res.data.units || []);
      }
    } catch (err) {
      setError('خطا در دریافت اطلاعات');
      console.error(err.response || err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [currentTab]);

  // دانلود اکسل فقط برای تب‌های storeVisit و customerVisit فعال است
  const handleDownloadExcel = async () => {
    if (!API_OPTIONS[currentTab].exportExcel) return;
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get(API_OPTIONS[currentTab].exportExcel, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${currentTab}_report.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('خطا در دانلود اکسل:', err.response || err.message);
      alert('خطا در دانلود فایل اکسل');
    }
  };

  // حذف رکورد فقط برای دو تب اول (اگه لازم داری می‌تونیم اضافه کنیم)
  const deleteItem = async (id) => {
    if (!window.confirm('آیا مطمئن هستید؟')) return;
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://office.bandarabbasmall.com:5000/api/${currentTab}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('خطا در حذف:', err.response || err.message);
      alert('حذف با خطا مواجه شد.');
    }
  };

  // رندر جدول بر اساس تب
  const renderTable = () => {
    if (loading) return <p style={styles.loading}>در حال بارگذاری...</p>;
    if (error) return <p style={{ ...styles.loading, color: 'red' }}>{error}</p>;
    if (!data.length) return <p style={styles.loading}>داده‌ای یافت نشد.</p>;

   if (currentTab === 'storeVisit') {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>نام فروشگاه</th>
          <th style={styles.th}>پلاک</th>
          <th style={styles.th}>نام بازدیدکننده</th>
          <th style={styles.th}>تاریخ بازدید</th>
          <th style={styles.th}>زمان بازدید</th>
          <th style={styles.th}>دلیل تعطیل بودن</th>
          <th style={styles.th}>عملیات</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item._id}>
            <td style={styles.td}>{item.storeName || '---'}</td>
            <td style={styles.td}>{item.storePlate || '---'}</td>
            <td style={styles.td}>{item.createdBy?.name || '---'}</td>
            <td style={styles.td}>
              {item.date ? new Date(item.date).toLocaleDateString('fa-IR') : '---'}
            </td>
            <td style={styles.td}>
              {item.checkIn && item.checkOut ? `${item.checkIn} تا ${item.checkOut}` : '---'}
            </td>
            <td style={styles.td}>{item.closureReason || '---'}</td> {/* ✅ اصلاح‌شده */}
            <td style={styles.td}>
              <button style={styles.deleteButton} onClick={() => deleteItem(item._id)}>
                حذف
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


    if (currentTab === 'customerVisit') {
      return (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>نام</th>
              <th style={styles.th}>شماره تماس</th>
              <th style={styles.th}>توضیحات</th>
              <th style={styles.th}>موقعیت</th>
              <th style={styles.th}>تاریخ و زمان</th>
              <th style={styles.th}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td style={styles.td}>{item.fullName || '---'}</td>
                <td style={styles.td}>{item.phone || '---'}</td>
                <td style={styles.td}>{item.description || '---'}</td>
                <td style={styles.td}>{item.location || '---'}</td>
                <td style={styles.td}>
                  {item.time ? new Date(item.time).toLocaleString('fa-IR') : '---'}
                </td>
                <td style={styles.td}>
                  <button style={styles.deleteButton} onClick={() => deleteItem(item._id)}>
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (currentTab === 'units') {
      return (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>نام واحد</th>
              <th style={styles.th}>شماره واحد</th>
              <th style={styles.th}>مساحت</th>
              <th style={styles.th}>تلفن ثابت</th>
              <th style={styles.th}>تماس مشتری</th>
              <th style={styles.th}>نام مدیر</th>
              <th style={styles.th}>کد ملی مدیر</th>
              <th style={styles.th}>تلفن مدیر</th>
              <th style={styles.th}>تلفن اضطراری مدیر</th>
              <th style={styles.th}>ایمیل مدیر</th>
              <th style={styles.th}>مدیر داخلی</th>
              <th style={styles.th}>کد ملی مدیر داخلی</th>
              <th style={styles.th}>تلفن مدیر داخلی</th>
              <th style={styles.th}>تلفن اضطراری مدیر داخلی</th>
    
              <th style={styles.th}>پرسنل</th>
    
              <th style={styles.th}>مجوز دارد؟</th>
              <th style={styles.th}>کارگاه دارد؟</th>
              <th style={styles.th}>کد کارگاه</th>
              <th style={styles.th}>بیمه آتش‌سوزی دارد؟</th>
              <th style={styles.th}>تاریخ شروع بیمه آتش‌سوزی</th>
              <th style={styles.th}>تاریخ پایان بیمه آتش‌سوزی</th>
              <th style={styles.th}>بیمه مسئولیت دارد؟</th>
              <th style={styles.th}>تاریخ شروع بیمه مسئولیت</th>
              <th style={styles.th}>تاریخ پایان بیمه مسئولیت</th>
              <th style={styles.th}>کپسول آتش‌نشانی</th>
              <th style={styles.th}>تاریخ انقضای کپسول</th>
              <th style={styles.th}>کمک‌های اولیه</th>
              <th style={styles.th}>لباس فرم</th>
              <th style={styles.th}>کارت شناسایی</th>
              <th style={styles.th}>اینستاگرام دارد؟</th>
              <th style={styles.th}>آدرس اینستاگرام</th>
              <th style={styles.th}>وبسایت دارد؟</th>
              <th style={styles.th}>آدرس وبسایت</th>
              <th style={styles.th}>اسنپ‌پی دارد؟</th>
              <th style={styles.th}>کیسه فروشگاه دارد؟</th>
              <th style={styles.th}>وفاداری دارد؟</th>
              <th style={styles.th}>توضیحات وفاداری</th>
              <th style={styles.th}>تنوع محصول</th>
              <th style={styles.th}>بسته‌بندی</th>
              <th style={styles.th}>روش ارسال</th>
              <th style={styles.th}>اینترنت دارد؟</th>
              <th style={styles.th}>شروع اینترنت</th>
              <th style={styles.th}>پایان اینترنت</th>
            </tr>
          </thead>
          <tbody>
            {data.map((unit) => (
              <tr key={unit._id} style={{ verticalAlign: 'top' }}>
                <td style={styles.td}>{unit.unit_name || '—'}</td>
                <td style={styles.td}>{unit.unit_number || '—'}</td>
                <td style={styles.td}>{unit.area || '—'}</td>
                <td style={styles.td}>{unit.landline || '—'}</td>
                <td style={styles.td}>{unit.customer_contact || '—'}</td>
                <td style={styles.td}>{unit.manager_name || '—'}</td>
                <td style={styles.td}>{unit.manager_national_code || '—'}</td>
                <td style={styles.td}>{unit.manager_phone || '—'}</td>
                <td style={styles.td}>{unit.manager_emergency || '—'}</td>
                <td style={styles.td}>{unit.manager_email || '—'}</td>
                <td style={styles.td}>{unit.internal_manager || '—'}</td>
                <td style={styles.td}>{unit.internal_manager_national_code || '—'}</td>
                <td style={styles.td}>{unit.internal_manager_phone || '—'}</td>
                <td style={styles.td}>{unit.internal_manager_emergency || '—'}</td>
    
                <td style={styles.td}>
                  {unit.personnel && unit.personnel.length > 0 ? (
                    <ul style={{ paddingInlineStart: '16px', textAlign: 'right' }}>
                      {unit.personnel.map((p, i) => (
                        <li key={i}>
                          {p.name} - {p.phone} - {p.nationalCode}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    '—'
                  )}
                </td>
    
                <td style={styles.td}>{unit.has_license || '—'}</td>
                <td style={styles.td}>{unit.has_workshop || '—'}</td>
                <td style={styles.td}>{unit.workshop_code || '—'}</td>
                <td style={styles.td}>{unit.has_fire_insurance || '—'}</td>
                <td style={styles.td}>{unit.fire_insurance_start ? new Date(unit.fire_insurance_start).toLocaleDateString('fa-IR') : '—'}</td>
                <td style={styles.td}>{unit.fire_insurance_end ? new Date(unit.fire_insurance_end).toLocaleDateString('fa-IR') : '—'}</td>
                <td style={styles.td}>{unit.has_liability_insurance || '—'}</td>
                <td style={styles.td}>{unit.liability_insurance_start ? new Date(unit.liability_insurance_start).toLocaleDateString('fa-IR') : '—'}</td>
                <td style={styles.td}>{unit.liability_insurance_end ? new Date(unit.liability_insurance_end).toLocaleDateString('fa-IR') : '—'}</td>
                <td style={styles.td}>{unit.extinguisher || '—'}</td>
                <td style={styles.td}>{unit.extinguisher_expiry ? new Date(unit.extinguisher_expiry).toLocaleDateString('fa-IR') : '—'}</td>
                <td style={styles.td}>{unit.first_aid || '—'}</td>
                <td style={styles.td}>{unit.uniform || '—'}</td>
                <td style={styles.td}>{unit.id_card || '—'}</td>
                <td style={styles.td}>{unit.has_instagram || '—'}</td>
                <td style={styles.td}>{unit.instagram_url || '—'}</td>
                <td style={styles.td}>{unit.has_website || '—'}</td>
                <td style={styles.td}>{unit.website_url || '—'}</td>
                <td style={styles.td}>{unit.has_snappay || '—'}</td>
                <td style={styles.td}>{unit.has_shop_bag || '—'}</td>
                <td style={styles.td}>{unit.has_loyalty || '—'}</td>
                <td style={styles.td}>{unit.loyalty_description || '—'}</td>
                <td style={styles.td}>{unit.product_variety || '—'}</td>
                <td style={styles.td}>{unit.packaging || '—'}</td>
                <td style={styles.td}>{unit.delivery_method || '—'}</td>
                <td style={styles.td}>{unit.has_internet || '—'}</td>
                <td style={styles.td}>{unit.internet_start ? new Date(unit.internet_start).toLocaleDateString('fa-IR') : '—'}</td>
                <td style={styles.td}>{unit.internet_end ? new Date(unit.internet_end).toLocaleDateString('fa-IR') : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    

    return null;
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.sidebar}>
          {Object.entries(API_OPTIONS).map(([key, opt]) => (
            <button
              key={key}
              style={{
                ...styles.tabButton,
                backgroundColor: currentTab === key ? '#2a5298' : '#ddd',
                color: currentTab === key ? '#fff' : '#333',
              }}
              onClick={() => setCurrentTab(key)}
            >
              {opt.name}
            </button>
          ))}
        </div>

        <div style={styles.mainContent}>
          <div style={styles.header}>
            <h2 style={styles.title}>{API_OPTIONS[currentTab].name}</h2>
            {(currentTab === 'storeVisit' || currentTab === 'customerVisit') && (
              <button onClick={handleDownloadExcel} style={styles.button}>
                📥 خروجی اکسل
              </button>
            )}
          </div>

          <div style={styles.tableWrapper}>{renderTable()}</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    background: '#f2f4f8',
    minHeight: '100vh',
    fontFamily: 'DoranFaNum, sans-serif',
    padding: '1rem',
  },
  container: {
    display: 'flex',
    gap: '1rem',
  },
  sidebar: {
    width: '220px',
    padding: '1rem',
    background: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  tabButton: {
    padding: '12px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background-color 0.3s ease',
  },
  mainContent: {
    flexGrow: 1,
    padding: '1rem',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.4rem',
    color: '#2a2a2a',
  },
  button: {
    backgroundColor: '#2a5298',
    color: '#fff',
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    padding: '6px 10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: '12px',
    backgroundColor: '#e0e0e0',
    textAlign: 'center',
    border: '1px solid #ccc',
  },
  td: {
    padding: '10px',
    textAlign: 'center',
    border: '1px solid #ccc',
    direction: 'rtl',
  },
  loading: {
    fontSize: '1rem',
    color: '#777',
    padding: '20px',
    textAlign: 'center',
  },
};

export default ManagerDashboard;
