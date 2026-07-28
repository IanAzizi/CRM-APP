import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "../../src/index.css";

const LOCAL_STORAGE_KEY = "lastFormData";

// لیست تستی فروشگاه‌ها
const storeList = [
  { name: "گراد", plate: "1.2" },
  { name: "ورلس", plate: "4.5.6.7" },
  { name: "MC", plate: "8 MC" },
    { name: "مکث مادام", plate: "9" },
  { name: "سیاه پوش", plate: "10" },
   { name: "السی وایکیکی", plate: "13" },
     { name: "موکا", plate: "14" },
  { name: "ناتالی ", plate: "15 " },
    { name: "پاما", plate: "16" },
  { name: "شالی شاپ", plate: "17" },
    { name: "ساعت سلیقه", plate: "18" },
  { name: "هزار و یک عطر", plate: "19 " },
    { name: "تن درست", plate: "20" },
  { name: "نفیس", plate: "21 نفیس" },
    { name: "کلاه جامئیکا", plate: "21/1" },
  { name: "لیلیموند", plate: "22" },
    { name: "محصول خوب", plate: "23" },
  { name: "دکان", plate: "24" },
    { name: "فرش محمد زاده", plate: "25" },
  { name: "اسکیچرز", plate: "26" },
    { name: "عینک زاور", plate: "27" },
  { name: "هامیکس", plate: "28" },
    { name: "پیمان", plate: "29" },
  { name: "نکست", plate: "30" },
    { name: "رچسا", plate: "31" },
  { name: "تولیکا", plate: "32" },
    { name: "کافه نل", plate: "33" },
  { name: "پاندورا", plate: "34" },
    { name: "روشا گلد", plate: "35" },
  { name: "361", plate: "361" },
    { name: "ترکمانی", plate: "37" },
  { name:"پریمو", plate: "38" },
    { name: "کومار", plate: "39" },
  { name: "پیجامه", plate: "40" },
    { name: "منگو من", plate: "41" },
  { name: "چرم مشهد", plate: "42" },
    { name: "دییر", plate: "43" },
  { name: "پرنسا", plate: "44" },
    { name: "منگو", plate: "45" },
  { name: "دختر روز", plate: "46" },
    { name: "عطر باران", plate: "47" },
  { name: "کافه ویونا", plate: "48" },
    { name: "تاپ من", plate: "49" },
  { name: "روژین جین", plate: "50" },
    { name: "باغچه", plate: "51" },
  { name: "پابلو", plate: "56" },
    { name: "مزون مریمی", plate: "57" },
  { name: "باتیس", plate: "58" },
    { name: "کیف و کفش مکث", plate: "59" },
  { name: "ایدرنس", plate: "126" }, 
    { name: "بوکلند", plate: "128" },
  { name: "دنیای ساعت", plate: "129" },
    { name: "M&T", plate: "130" },
  { name: "پازشوز", plate: "131" },
    { name: "میسو", plate: "132" },
  { name: "السولن", plate: "133" },
    { name: "بست مزون", plate: "134" },
  { name: "بارکد", plate: "135" },
    { name: "عاج", plate: "136" },
  { name: "اپرا", plate: "137" },
    { name: "QD", plate: "138" },
  { name: "آرتین استور", plate: "139" },
    { name: "طلای شهریور", plate: "140" },
  { name: "طلای عوض الحیات", plate: "140.1" },
    { name: "راد گالری", plate: "141" },
  { name: "طلای کامت", plate: "141.1" },
    { name: "طلای دایان", plate: "143" },
  { name: "طلای آریل", plate: "144" },
    { name: "طلای چاوش", plate: "145" },
  { name: "طلای الوندی", plate: "146" },
    { name: "ساتراس", plate: "147" },
  { name: "مینا گالری", plate: "148" },
    { name: "گارنت", plate: "149" },
  { name: "دوراگالری", plate: "150" },
  { name: "هوم دکور", plate: "253" },
    { name: "طلا نیل", plate: "152" },
    { name: "لی لی گالری", plate: "0" },
  { name: "سامان", plate: "154" },
    { name: "دنا گلد", plate: "155" },
  { name: "طن گالری", plate: "156" },
    { name: "وگا گلد", plate: "157" },
  { name: "اینفینیتی استور", plate: "158" },
    { name: "ایوروشه", plate: "159" },
  { name: "سورنا", plate: "160" },
    { name: "ورس", plate: "161" },
  { name: "جامای مد", plate: "162" },
    { name: "پاستالیا", plate: "208" },
  { name: "اریکه", plate: "215" },
    { name: "بی بی لند", plate: "216" },
  { name: "باتیک کیدز", plate: "222" },
    { name: "کاتالند", plate: "224" },
  { name: "مسیح کیدز", plate: "225" },
    { name: "چیلک", plate: "226" },
  { name: "کفش پارسا", plate: "227" },
    { name: "آنجل", plate: "228" },
  { name: "رشو ببو", plate: "233" },
    { name: "ریت", plate: "237" },
  { name: "مبل مرتضی", plate: "241" },
    { name: "مونکیدز", plate: "242" },
  { name: "دلبند کیدز", plate: "243" },
    { name: "ویژن", plate: "244" },
  { name: "ام شکلات", plate: "245" },
    { name: "دندی", plate: "246" },
  { name: "لایت", plate: "256" },
    { name: "پیرایش محسن", plate: "262" },
  { name: "MBQ", plate: "263" },
    { name: "پوشاک کیوان", plate: "61" },
  { name: "هانی گالری", plate: "62" },
    { name: "اسپرینگ فیلد", plate: "63" },
  { name: "aldo", plate: "64" },
    { name: "ارور", plate: "66" },
  { name: "زیگ عبایا", plate: "67" },
    { name: "بلوط پرفیوم", plate: "68" },
  { name: "وددو", plate: "69" },
    { name: "مارماریس", plate: "101" },
  { name: "باتیک", plate: "104" },
    { name: "کفش شیما", plate: "106" },
  { name: "گپ", plate: "107 گپ" },
    { name: "ایکات", plate: "109 ایکات" },
  { name: "بازل", plate: "110" },
    { name: "هایپر", plate: "111" },
  { name: "مزلاو", plate: "112" },
    { name: "عطر راستی", plate: "113" },
  { name: "دریس شاپ", plate: "114" },
    { name: "ساعت لوزان", plate: "115" },
  { name: "عطر ترنج", plate: "116" },
    { name: "شیوا گالری", plate: "117" },
  { name: "نایس", plate: "118" },
    { name: "زیباروشاپ", plate: "119" },
  { name: "تکلیس", plate: "121" },
    { name: "آدیناست", plate: "122" },
  { name: "توتیاشاپ", plate: "123" },
    { name: "مزون سارا", plate: "124" },
  { name: "اوشه", plate: "125" },
  { name: "ایکات", plate: "109" },
  { name: "طلای آرس", plate: "151" },
  { name: "دورا", plate: "150" },
  { name: "طلای سامان", plate: "154" },
  { name: "موچی", plate: "0" },
  { name: "داتیس", plate: "0" },
  { name: "دلیمانجو", plate: "0" },
  { name: "آدینا", plate: "0" },
  { name: "اوپرا اوپتیک", plate: "0" },
  { name: "هیزو", plate: "0" },
  { name: "استلا", plate: "0" },
  { name: "مونته", plate: "0" },
  { name: "فوندو", plate: "0" },
  { name: "کیوبتل", plate: "0" },
  { name: "کراپ اکسسوری", plate: "0" },
  { name: "شهر بازی", plate: "0" },
  { name: "رنگین کمان", plate: "0" },
  { name: "بهشت شیرین", plate: "0" },
  { name: "ماکزیم", plate: "0" },
  { name: "دلی جان", plate: "0" },
  { name: "دخت بندر", plate: "0" },
  { name: "بوخش", plate: "0" },
  { name: "دنیای رایحه", plate: "0" },
  { name: "طلای جنوب", plate: "0" },
  { name: "صندلی ماساژ(اقای لشگری)", plate: "0" },
  { name: "صندلی ماساژ(آقای فتح اللهی)", plate: "0" },
  { name: "سیاه سفید", plate: "0" },
  { name: "ارکاتل", plate: "0" },
  { name: "سوگند", plate: "0" },
  { name: "پرفیوم لند", plate: "0" },
  { name: "نیل بارکد", plate: "0" },
  { name: "زیگورات", plate: "0" },
  { name: "روشا گل", plate: "35" },
  { name: "اوشه", plate: "125" },
  { name: "هرا گلد", plate: "153" },
  { name: "طلای وگا", plate: "157" },
  { name: "الدو", plate: "64" },
  { name: "اوشه", plate: "125" },
  { name: "اوپرا", plate: "137" },
  { name: "کیودی", plate: "138 " },
  { name: "سفر بستکی", plate: "0" },
  { name: "استند سیاه سفید", plate: "0" },
  { name: "دوژه", plate: "0" },
  { name: "طلا جنوب", plate: "0" },
  { name: "پشمک", plate: "0" },
  { name: "بستنی رولکا", plate: "0" },
  { name: "گل طبیعی طبقه اول", plate: "0" },
  { name: "پاپ کورن طبقه دوم", plate: "0" },
  { name: "طلا فروشی الزارا", plate: "141.2" },
  { name: "ایرانسل", plate: "0" },
  { name: "استند لوتوس", plate: "0" },
  { name: "استند باقلوا", plate: "0" },
  { name: "استند کراپ اکسسوری", plate: "0" },
  { name: "نیم پف", plate: "0" },
  { name: "استند قطعات ماشین", plate: "0" },
  { name: "وستا", plate: "0" },
  { name: "Mas land", plate: "0" },
  { name: "مارال گل", plate: "0" },
  { name: "ماشین عروسکی", plate: "0" },
  { name: "شقایق واحدی", plate: "256" },
  { name: "باذل هوم", plate: "110" },
  { name: "مسلند", plate: "0" },
  { name: "کراب اسپیکر", plate: "0" },
  { name: "جم دی", plate: "0" },
  { name: "لی لیا گالری", plate: "0" },
  { name: "آف موبایل", plate: "0" },
  { name: "دیوید جونز", plate: "57" },
  { name: "ردپا", plate: "54" },
  { name: "ام استایل", plate: "52" },
  { name: "جزیره اسباب بازی", plate: "120" },
  { name: "کومو", plate: "21" },
  { name: "مغربی هوم", plate: "53" },
  { name: "گشر", plate: "0" },
  { name: "پارسا", plate: "41" },
  { name: "ذرت مکزیکی", plate: "0" },
  { name: "بابل تی", plate: "0" },
  { name: "پرشین اسپورت", plate: "55" },
  { name: "کومو", plate: "21" },
  { name: "پاز استایل", plate: "130" },
  { name: "مامانی نی", plate: "241" },
  { name: "یلمه", plate: "0" },
  { name: "خلطاطی", plate: "0" },
  { name: "ورا گلد", plate: "146" },
  { name: "کومو", plate: "21" },
  { name: "اسپورت لند", plate: "32" },
  { name: "دانژه", plate: "45" },
  { name: "بیگ باکس", plate: "12" },
  { name: "معمار فیروزه ای", plate: "60" },
  { name: "هوگون", plate: "134" },
  { name: "مرینو", plate: "228" },
  { name: "گیم لند", plate: "213" },
  { name: "پریفا", plate: "0" },
  { name: "ویرا", plate: "0" },
  { name: "احمد مغربی", plate: "0" },
  { name: "کرلی شاپ", plate: "0" },
  { name: "قهوه روزانه", plate: "0" },
  { name: "تعمیرات هنگام", plate: "0" },
  { name: "ترش لند", plate: "0" },
  { name: "استند فلفل", plate: "0" },

  
];

const DashboardCrmGard = () => {
  const [formData, setFormData] = useState({
    storeName: "",
    storePlate: "",
    date: null,
    checkIn: "",
    checkOut: "",
    closureReason: "" // ⬅️ اضافه شد
  });

  const [archiveVisible, setArchiveVisible] = useState(false);
  const [storeVisits, setStoreVisits] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const { data, timestamp } = JSON.parse(savedData);
      const now = Date.now();
      const hoursPassed = (now - timestamp) / (1000 * 60 * 60);

      if (hoursPassed < 24) {
        setFormData(data);
        setArchiveVisible(true);
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get("http://office.bandarabbasmall.com:5000/api/storeVisit/all", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStoreVisits(response.data || []);
      } catch (err) {
        console.error("خطا در گرفتن لیست بازدیدها:", err.response?.data || err.message);
      }
    };

    fetchVisits();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "storeName") {
      const suggestions = storeList.filter((store) =>
        store.name.includes(value)
      );
      setFilteredStores(suggestions);
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (store) => {
    setFormData({
      ...formData,
      storeName: store.name,
      storePlate: store.plate
    });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(
        "http://office.bandarabbasmall.com:5000/api/storeVisit/submit",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("فرم با موفقیت ارسال شد");

      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ data: formData, timestamp: Date.now() })
      );
      setArchiveVisible(true);

      const response = await axios.get("http://office.bandarabbasmall.com:5000/api/storeVisit/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStoreVisits(response.data || []);
    } catch (err) {
      console.error("خطا در ارسال فرم:", err.response?.data || err.message);
      alert("خطا در ارسال فرم");
    }
  };

  const handleClearArchive = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setArchiveVisible(false);
    setFormData({
      storeName: "",
      storePlate: "",
      date: null,
      checkIn: "",
      checkOut: ""
    });
  };

  return (
    <div style={styles.page} dir="rtl">
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>فرم ثبت بازدید فروشگاه</h2>

        {archiveVisible && (
          <div style={{ color: "#007bff", fontSize: "0.9rem", marginBottom: 10 }}>
            اطلاعات شما تا ۲۴ ساعت آینده ذخیره شده است.
            <button
              type="button"
              onClick={handleClearArchive}
              style={{
                marginRight: 10,
                background: "none",
                border: "none",
                color: "red",
                cursor: "pointer"
              }}
            >
              حذف بایگانی
            </button>
          </div>
        )}

        <label style={styles.label}>نام فروشگاه</label>
        <input
          type="text"
          name="storeName"
          placeholder="نام فروشگاه"
          value={formData.storeName}
          onChange={handleChange}
          style={styles.input}
          autoComplete="off"
          required
        />
        {showSuggestions && filteredStores.length > 0 && (
          <ul style={styles.suggestions}>
            {filteredStores.map((store, idx) => (
              <li key={idx} onClick={() => handleSuggestionClick(store)} style={styles.suggestionItem}>
                {store.name}
              </li>
            ))}
          </ul>
        )}

        <label style={styles.label}>پلاک فروشگاه</label>
        <input
          type="text"
          name="storePlate"
          placeholder="پلاک فروشگاه"
          value={formData.storePlate}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>تاریخ ثبت</label>
        <DatePicker
          calendar={persian}
          locale={persian_fa}
          value={formData.date}
          onChange={(date) => setFormData({ ...formData, date: date?.toDate() })}
          style={styles.input}
        />

        <label style={styles.label}>ساعت ورود</label>
        <input
          type="time"
          name="checkIn"
          value={formData.checkIn}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <label style={styles.label}>ساعت خروج</label>
        <input
          type="time"
          name="checkOut"
          value={formData.checkOut}
          onChange={handleChange}
          style={styles.input}
          required
        />
            <label style={styles.label}>دلیل تعطیلی (در صورت تعطیل بودن)</label>
    <select
      name="closureReason"
      value={formData.closureReason}
      onChange={handleChange}
      style={styles.input}
    >
 <option value="">-- انتخاب کنید --</option>
  <option value="پلمپ">پلمپ</option>
  <option value="قطعی برق">قطعی برق</option>
  <option value="تغییردکوراسیون">تغییردکوراسیون</option>
  <option value="تعطیلی غیر موجه">تعطیلی غیر موجه</option>
  <option value="تعطیلی هماهنگ شده">تعطیلی هماهنگ شده</option>
  <option value="عدم اجازه از سوی مدیریت">عدم اجازه از سوی مدیریت</option>
    </select>

        <button type="submit" style={styles.button}>
          ثبت بازدید
        </button>
      </form>

      <div style={styles.listCard}>
        <h3 style={styles.title}>لیست بازدیدهای ثبت‌شده</h3>
        {storeVisits.length === 0 ? (
          <p>هیچ بازدیدی ثبت نشده است.</p>
        ) : (
          storeVisits.visits.map((visit, index) => (
            <div key={index} style={styles.visitItem}>
              <p><strong>نام فروشگاه:</strong> {visit.storeName}</p>
              <p><strong>پلاک:</strong> {visit.storePlate}</p>
              <p><strong>تاریخ:</strong> {new Date(visit.date).toLocaleDateString("fa-IR")}</p>
              <p><strong>ورود:</strong> {visit.checkIn}</p>
              <strong>خروج:</strong> {visit.checkOut}
              <hr />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "2rem",
    fontFamily: "'DoranFaNum', sans-serif"
  },
  card: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "2rem",
    position: "relative"
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "1.3rem",
    color: "#333"
  },
  input: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
    width: "100%"
  },
  button: {
    padding: "12px",
    backgroundColor: "#2a5298",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem"
  },
  listCard: {
    background: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "600px"
  },
  visitItem: {
    marginBottom: "1rem",
    fontSize: "0.95rem",
    lineHeight: "1.6"
  },
  suggestions: {
    listStyleType: "none",
    margin: 0,
    padding: "0 0 0 10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    maxHeight: "150px",
    overflowY: "auto",
    backgroundColor: "white",
    position: "absolute",
    top: "190px", // ممکنه لازم باشه تغییر بدی بسته به مکان input
    width: "100%",
    zIndex: 10
  },
  suggestionItem: {
    padding: "8px",
    cursor: "pointer",
    borderBottom: "1px solid #eee"
  }
};

export default DashboardCrmGard;
