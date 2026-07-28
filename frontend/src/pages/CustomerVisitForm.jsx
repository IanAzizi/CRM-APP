import { useState } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import '../../src/index.css';

import {
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  createTheme,  
  ThemeProvider,
} from "@mui/material";

import axios from "axios";
import moment from "moment-jalaali";

const theme = createTheme({
  typography: {
    fontFamily: 'iransans, sans-serif',
    
  },
});

const TabPanel = ({ children, value, index }) => {
  return value === index ? <Box mt={2}>{children}</Box> : null;
};

const CustomerFeedbackTabs = () => {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    time: new Date().toISOString().slice(0, 16),
    description: "",
    location: "",
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const isValidPhone = /^09\d{9}$/.test(form.phone);
    if (!isValidPhone) {
      setSnackbar({
        open: true,
        message: "شماره موبایل باید با 09 شروع شده و 11 رقم باشد. مثال: 09123456789",
        severity: "error"
      });
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://office.bandarabbasmall.com:5000/api/customerVisit", form);
      setSnackbar({ open: true, message: "ثبت با موفقیت انجام شد.", severity: "success" });
      setForm({
        fullName: "",
        phone: "",
        time: moment().format("YYYY-MM-DDTHH:mm"),
        description: "",
        location: "",
      });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "خطا در ارسال اطلاعات.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box  component={Paper} elevation={3} p={3} maxWidth="600px" mx="auto" mt={5} textAlign="center" >
        <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)} variant="fullWidth">
          <Tab label="شکایت / بازدید" />
          <Tab label="انتقاد و پیشنهادات" />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <Typography variant="h6" gutterBottom>
            فرم ثبت شکایت یا بازدید
          </Typography>
          {renderForm({
            form,
            handleChange,
            handleSubmit,
            loading,
            snackbar,
            setSnackbar,
            setForm,
            isFeedback: false
          })}
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <Typography variant="h6" gutterBottom>
            فرم ثبت انتقاد یا پیشنهاد
          </Typography>
          {renderForm({
            form,
            handleChange,
            handleSubmit,
            loading,
            snackbar,
            setSnackbar,
            setForm,
            isFeedback: true
          })}
        </TabPanel>
      </Box>
    </ThemeProvider>
  );
};
const renderForm = ({
  form,
  handleChange,
  handleSubmit,
  loading,
  snackbar,
  setSnackbar,
  setForm,
  isFeedback
}) => (
  <form   onSubmit={handleSubmit}>
    <label>نام و نام خانوادگی</label>
    <TextField
      name="fullName"
      label="نام شما"
      fullWidth
      margin="normal"
      value={form.fullName}
      onChange={handleChange}
      required
    />
    <label>شماره تماس</label>
    <TextField
      name="phone"
      label="شماره موبایل"
      fullWidth
      margin="normal"
      value={form.phone}
      onChange={handleChange}
      required
      placeholder="مثلاً: 09123456789"
      helperText="شماره باید با 09 شروع شده و 11 رقم باشد."
    />
    <div style={{ marginTop: "1rem", textAlign: "center" }}>
      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>
        {isFeedback ? "تاریخ ثبت پیشنهاد/انتقاد:" : "تاریخ و زمان بازدید:"}
      </label>
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        value={form.time}
        onChange={(date) => {
          const formatted = date?.toDate()?.toISOString();
          setForm({ ...form, time: formatted });
        }}
        format="YYYY/MM/DD HH:mm"
        plugins={[]}
        calendarPosition="bottom-right"
        editable={false}
        style={{
          width: "100%",
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          fontFamily: "iransans",
        }}
      />
    </div>
    <label>{isFeedback ? "مکان مورد نظر شما" : "محل بازدید"}</label>
    <TextField
      name="location"
      label={isFeedback ? "مکان مربوط به پیشنهاد یا انتقاد" : "محل بازدید"}
      select
      fullWidth
      margin="normal"
      value={form.location}
      onChange={handleChange}
      required
    >
      {[
        "بندرعباس مال",
        "سینما",
        "فروشگاه ها",
        "هایپر استار",
        "رستوران مارماریس",
        "فود کورت",
        "کافه ها",
      ].map((loc) => (
        <MenuItem key={loc} value={loc}>
          {loc}
        </MenuItem>
      ))}
    </TextField>

    <label>{isFeedback ? "متن پیشنهاد یا انتقاد شما" : "توضیحات"}</label>
    <TextField
      name="description"
      label={isFeedback ? "انتقاد / پیشنهاد" : "توضیحات"}
      fullWidth
      margin="normal"
      value={form.description}
      onChange={handleChange}
      multiline
      rows={4}
    />

    <Button
      type="submit"
      variant="contained"
      color="primary"
      fullWidth
      disabled={loading}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : "ارسال"}
    </Button>

    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
        variant="filled"
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  </form>
);

export default CustomerFeedbackTabs;
