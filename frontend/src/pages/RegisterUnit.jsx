import React, { useState } from 'react';
import "../../src/RegisterUnit.css";

const ProgressBar = ({ progress }) => (
  <div className="progress-container">
    <div className="progress-bar" style={{ width: `${progress}%` }}></div>
  </div>
);

const PersonnelInput = ({ index, onRemove }) => {
  return (
    <div className="personnel-item">
      <div className="form-grid">
        <label className="form-label">
          <span>نام پرسنل</span>
          <input
            type="text"
            name={`personnel_name[${index}]`}
            required
          />
        </label>
        <label className="form-label">
          <span>شماره تماس پرسنل</span>
          <input
            type="tel"
            name={`personnel_phone[${index}]`}
            required
          />
        </label>
        <label className="form-label">
          <span>کد ملی پرسنل</span>
          <input
            type="number"
            name={`personnel_national_code[${index}]`}
            required
          />
        </label>
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="remove-personnel-button form-button"
      >
        – حذف
      </button>
    </div>
  );
};

const RegisterUnit = () => {
  const [personnelList, setPersonnelList] = useState([]);
  const [formState, setFormState] = useState({
    has_license: '',
    has_workshop: '',
    has_fire_insurance: '',
    has_liability_insurance: '',
    extinguisher: '',
    uniform: '',
    id_card: '',
    has_instagram: '',
    has_website: '',
    has_snappay: '',
    has_shop_bag: '',
    has_loyalty: '',
    has_internet: '',
    first_aid: '',
  });
  const [formStatus, setFormStatus] = useState({ message: '', type: '' });
  const [progress, setProgress] = useState(0);

  const handleAddPersonnel = () => {
    setPersonnelList([...personnelList, personnelList.length]);
  };

  const handleRemovePersonnel = (index) => {
    setPersonnelList(personnelList.filter((_, i) => i !== index));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInput = () => {
    const totalInputs = document.querySelectorAll("#unit-form input, #unit-form select, #unit-form textarea").length;
    const filledInputs = Array.from(document.querySelectorAll("#unit-form input, #unit-form select, #unit-form textarea")).filter(input => input.value.trim()).length;
    setProgress(Math.floor((filledInputs / totalInputs) * 100));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ message: 'در حال ارسال...', type: 'info' });
    const formData = new FormData(e.target);
    try {
      const response = await fetch('http://localhost:5000/api/register-unit', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'خطا در ارسال فرم');
      }
      setFormStatus({ message: result.message || 'فرم با موفقیت ارسال شد', type: 'success' });
      e.target.reset();
      setPersonnelList([]);
      setFormState({
        has_license: '', has_workshop: '', has_fire_insurance: '',
        has_liability_insurance: '', extinguisher: '', uniform: '',
        id_card: '', has_instagram: '', has_website: '',
        has_snappay: '', has_shop_bag: '', has_loyalty: '',
        has_internet: '', first_aid: '',
      });
      setProgress(0);
    } catch (err) {
      setFormStatus({ message: err.message || 'خطا در ارسال فرم', type: 'error' });
    }
    
  };

  return (
    <div className="unit-form-container">
      <ProgressBar progress={progress} />
      {formStatus.message && (
        <div className={`form-message ${formStatus.type}`}>
          {formStatus.message}
        </div>
      )}
      <form
        id="unit-form"
        onInput={handleInput}
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        noValidate
      >
        <h2>فرم ثبت اطلاعات واحد</h2>

        {/* Unit Information */}
        <div className="form-grid">
          <label className="form-label">
            <span>نام فروشگاه</span>
            <input type="text" name="unit_name" placeholder='مثال: علی علیزاده' required />
          </label>
          <label className="form-label">
            <span>شماره واحد</span>
            <input type="number" name="unit_number" placeholder='مثال: 1' required />
          </label>
          <label className="form-label">
            <span>متراژ واحد</span>
            <input type="number" name="area" placeholder='مثال : 20 (واحد اندازه گیری متر)' required />
          </label>
          <label className="form-label">
            <span>تلفن ثابت</span>
            <input type="tel" name="landline" placeholder='مثال :  123456 076' required />
          </label>
          <label className="form-label">
            <span>شماره تماس واحد</span>
            <input type="tel" name="customer_contact" placeholder='مثال : 123456 076' required />
          </label>
          <label className="form-label">
            <span>کد پستی واحد</span>
            <input type="tel" name="customer_contact" placeholder='مثال : 123456 076' required />
          </label>
        </div>

        {/* Manager Information */}
        <h3>اطلاعات مدیریت</h3>
        <div className="form-grid">
          <label className="form-label">
            <span>مدیریت واحد معاینات قرارداد</span>
            <input type="text" name="manager_name" placeholder='مثال: علی علیزاده' required />
          </label>
          <label className="form-label">
            <span>کد ملی مدیریت واحد</span>
            <input type="number" name="manager_national_code" placeholder='مثال : 1234567890' required />
          </label>
          <label className="form-label">
            <span>شماره تماس مدیریت</span>
            <input type="tel" name="manager_phone" placeholder='09123456789'  required />
          </label>
          <label className="form-label">
            <span>شماره اضطراری مدیریت</span>
            <input type="tel" name="manager_emergency" placeholder='مثال : 09123456789' required />
          </label>
          <label className="form-label">
            <span>ایمیل مدیریت واحد</span>
            <input type="email" name="manager_email" placeholder='مثال : example@gmail.com' required />
          </label>
        </div>

        {/* Internal Manager Information */}
        <h3>اطلاعات مدیر داخلی</h3>
        <div className="form-grid">
          <label className="form-label">
            <span>مدیر داخلی </span>
            <input type="text" name="internal_manager" placeholder='مثال : علی علیزاده'   required />
          </label>
          <label className="form-label">
            <span>کد ملی مدیر داخلی</span>
            <input type="number" name="internal_manager_national_code" placeholder='مثال : 1234567890' required />
          </label>
          <label className="form-label">
            <span>شماره تماس مدیر داخلی</span>
            <input type="tel" name="internal_manager_phone" placeholder='مثال : 09123456789' required />
          </label>
          <label className="form-label">
            <span>شماره اضطراری مدیر داخلی</span>
            <input type="tel" name="internal_manager_emergency" placeholder='مثال : 09123456789' required />
          </label>
        </div>

        {/* Personnel List */}
        <div className="personnel-section">
          <h3>پرسنل</h3>
          <div id="personnel-list">
            {personnelList.map((_, index) => (
              <PersonnelInput key={index} index={index} onRemove={handleRemovePersonnel} />
            ))}
          </div>
          <button
            type="button"
            onClick={handleAddPersonnel}
            className="add-personnel-button form-button"
          >
            + افزودن پرسنل
          </button>
        </div>

        {/* Conditional Fields */}
        <div>
          <label className="form-label">
            <span>واحد دارای پروانه کسب است؟</span>
            <select name="has_license" value={formState.has_license} onChange={handleSelectChange}>
              <option value="">انتخاب کنید</option>
              <option value="yes">بله</option>
              <option value="no">خیر</option>
            </select>
          </label>
          {formState.has_license === 'yes' && (
            <div className="conditional-section">
              <label className="form-label">
                <span>آپلود پروانه کسب</span>
                <input type="file" name="license_file" />
              </label>
            </div>
          )}

          <label className="form-label">
            <span>کد بیمه کارگاهی برای واحد دریافت شده است ؟</span>
            <select name="has_workshop" value={formState.has_workshop} onChange={handleSelectChange}>
              <option value="">انتخاب کنید</option>
              <option value="yes">بله</option>
              <option value="no">خیر</option>
            </select>
          </label>
          {formState.has_workshop === 'yes' && (
            <div className="conditional-section">
              <label className="form-label">
                <span>کد کارگاه</span>
                <input type="number" name="workshop_code" />
              </label>
            </div>
          )}

          <label className="form-label">
            <span>فروشگاه تحت پوشش بیمه آتش‌سوزی قرار دارد ؟</span>
            <select name="has_fire_insurance" value={formState.has_fire_insurance} onChange={handleSelectChange}>
              <option value="">انتخاب کنید</option>
              <option value="yes">بله</option>
              <option value="no">خیر</option>
            </select>
          </label>
          {formState.has_fire_insurance === 'yes' && (
            <div className="conditional-section">
              <label className="form-label">
                <span>آپلود فایل بیمه آتش‌سوزی</span>
                <input type="file" name="fire_insurance_file" />
              </label>
              <label className="form-label">
                <span>تاریخ شروع</span>
                <input type="date" name="fire_insurance_start" />
              </label>
              <label className="form-label">
                <span>تاریخ پایان</span>
                <input type="date" name="fire_insurance_end" />
              </label>
            </div>
          )}

          <label className="form-label">
            <span>بیمه مسئولیت برای فروشگاه تهیه شده است ؟</span>
            <select name="has_liability_insurance" value={formState.has_liability_insurance} onChange={handleSelectChange}>
              <option value="">انتخاب کنید</option>
              <option value="yes">بله</option>
              <option value="no">خیر</option>
            </select>
          </label>
          {formState.has_liability_insurance === 'yes' && (
            <div className="conditional-section">
              <label className="form-label">
                <span>آپلود فایل بیمه مسئولیت</span>
                <input type="file" name="liability_insurance_file" />
              </label>
              <label className="form-label">
                <span>تاریخ شروع</span>
                <input type="date" name="liability_insurance_start" />
              </label>
              <label className="form-label">
                <span>تاریخ پایان</span>
                <input type="date" name="liability_insurance_end" />
              </label>
            </div>
          )}


    <label className="form-label">
      <span>کپسول آتش‌نشانی در واحد موجود است ؟</span>
      <select name="extinguisher" value={formState.extinguisher} onChange={handleSelectChange}>
        <option value="">انتخاب کنید</option>
        <option value="has">دارد</option>
        <option value="none">ندارد</option>
      </select>

      {formState.extinguisher === 'has' && (
        <div className="conditional-section">
          <label className="form-label">
            <span>تاریخ انقضا کپسول</span>
            <input type="date" name="extinguisher_expiry" />
          </label>

          <label className="form-label">
            <span>نوع کپسول</span>
            <select name="extinguisher_type" value={formState.extinguisher_type} onChange={handleSelectChange}>
              <option value="">انتخاب کنید</option>
              <option value="co2">CO2</option>
              <option value="powder_gas">پودر و گاز</option>
            </select>
          </label>
        </div>
      )}
    </label>


          <label className="form-label">
            <span>جعبه کمک‌های اولیه در فروشگاه وجود دارد ؟</span>
            <select name="first_aid" value={formState.first_aid} onChange={handleSelectChange}>
              <option value="">انتخاب کنید</option>
              <option value="has">دارد</option>
              <option value="none">ندارد</option>
            </select>
          </label>

          <label className="form-label">
            <span>لباس فرم سازمانی برای پرسنل تهیه شده است ؟ </span>
            <select name="uniform" value={formState.uniform} onChange={handleSelectChange}>
              <option value="">انتخاب کنید</option>
              <option value="has">دارد</option>
              <option value="none">ندارد</option>
            </select>
          </label>
          {formState.uniform === 'has' && (
            <div className="conditional-section">
              <label className="form-label">
                <span>آپلود عکس لباس فرم</span>
                <input type="file" name="uniform_image" />
              </label>
            </div>
          )}

          <label className="form-label">
            <span>کارت شناسایی سازمانی به پرسنل ارائه شده است ؟ </span>
            <select name="id_card" value={formState.id_card} onChange={handleSelectChange}>
              <option value="">انتخاب کنید</option>
              <option value="has">دارد</option>
              <option value="none">ندارد</option>
            </select>
          </label>
          {formState.id_card === 'has' && (
            <div className="conditional-section">
              <label className="form-label">
                <span>عکس کارت شناسایی</span>
                <input type="file" name="id_card_image" />
              </label>
            </div>
          )}

          <label className="form-label">
            <span>صفحه رسمی اینستاگرام برای فروشگاه فعال است ؟ </span>
            <select name="has_instagram" value={formState.has_instagram} onChange={handleSelectChange}>
              <option value="">انتخاب کنید</option>
              <option value="yes">بله</option>
              <option value="no">خیر</option>
            </select>
          </label>
          {formState.has_instagram === 'yes' && (
            <div className="conditional-section">
              <label className="form-label">
                <span>آدرس اینستاگرام</span>
                <input type="text" name="instagram_url" />
              </label>
            </div>
          )}

          <label className="form-label">
            <span>وب‌سایت اختصاصی فروشگاه راه‌اندازی شده است ؟</span>
            <select name="has_website" value={formState.has_website} onChange={handleSelectChange}>
              <option value="">انتخاب کنید</option>
              <option value="yes">بله</option>
              <option value="no">خیر</option>
            </select>
          </label>
          {formState.has_website === 'yes' && (
            <div className="conditional-section">
              <label className="form-label">
                <span>آدرس وب‌سایت</span>
                <input type="url" name="website_url" />
              </label>
            </div>
          )}

          <label className="form-label">
            <span>امکان پرداخت با اسنپ‌پی در فروشگاه فراهم است ؟ </span>
            <select name="has_snappay" value={formState.has_snappay} onChange={handleSelectChange}>
              <option value="">انتخاب کنید</option>
              <option value="has">دارد</option>
              <option value="none">ندارد</option>
            </select>
          </label>
          
          <label className="form-label">
            <span>بگ فروشگاهی اختصاصی جهت مشتریان تهیه شده</span>
            <select name="has_shop_bag" value={formState.has_shop_bag} onChange={handleSelectChange}>
              <option value="">انتخاب کنید</option>
              <option value="yes">بله</option>
              <option value="no">خیر</option>
            </select>
          </label>
          {formState.has_shop_bag === 'yes' && (
            <div className="conditional-section">
              <label className="form-label">
                <span>آپلود تصویر بگ فروشگاهی</span>
                <input type="file" name="shop_bag_image" />
              </label>
            </div>
          )}
          
     <label className="form-label">
  <span>باشگاه مشتریان برای فروشگاه فعال شده است ؟</span>
  <select name="has_loyalty" value={formState.has_loyalty} onChange={handleSelectChange}>
    <option value="">انتخاب کنید</option>
    <option value="yes">بله</option>
    <option value="no">خیر</option>
  </select>
</label>
{formState.has_loyalty === 'yes' && (
  <div className="conditional-section">
    <label className="form-label">
      <span>شرح نحوه عضویت</span>
      <textarea name="loyalty_description" />
    </label>
    <label className="form-label">
      <span>باشگاه مشتریان اختصاصی فروشگاه است یا بندرعباس مال؟</span>
      <select name="loyalty_type" value={formState.loyalty_type} onChange={handleSelectChange}>
        <option value="">انتخاب کنید</option>
        <option value="store">اختصاصی فروشگاه</option>
        <option value="mall">مجتمع بندرعباس مال</option>
      </select>
    </label>
  </div>
)
}

          <label className="form-label">
            <span>تنوع کالاهای قابل عرضه‌شده در فروشگاه چیست؟</span>
            <input type="text" name="product_variety" placeholder='مثال: پوشاک، کفش، کلاه' />
          </label>
          <label className="form-label">
            <span>آیا فروش آنلاین در فروشگاه وجود دارد؟</span>
            <select name="has_shop_bag" value={formState.has_shop_bag} onChange={handleSelectChange}>
              <option value="">انتخاب کنید</option>
              <option value="yes">بله</option>
              <option value="no">خیر</option>
            </select>
          </label> 
          <label className="form-label">
            <span>آیا بسته بندی مخصوص برای انلاین شاپ خود دارید؟</span>
            <input type="text" name="packaging" />
          </label>

          <label className="form-label">
            <span>روش ارسال سفارش‌ها چگونه است؟</span>
            <select name="delivery_method">
              <option value="">انتخاب کنید</option>
              <option value="snapp">اسنپ</option>
              <option value="post">پست</option>
              <option value="other">سایر</option>
            </select>
          </label>

        <label className="form-label">
          
  <span>اتصال اینترنت در فروشگاه برقرار است</span>
  <select name="has_internet" value={formState.has_internet} onChange={handleSelectChange}>
    <option value="">انتخاب کنید</option>
    <option value="has">دارد</option>
    <option value="none">ندارد</option>
  </select>
</label>
{formState.has_internet === 'has' && (
  <div className="conditional-section">
    <label className="form-label">
      <span>تاریخ شروع اینترنت</span>
      <input type="date" name="internet_start" placeholder="مثال : 1404/04/04" />
    </label>
    <label className="form-label">
      <span>تاریخ پایان اینترنت</span>
      <input type="date" name="internet_end" placeholder="مثال : 1404/04/04" />
    </label>
    <label className="form-label">
      <span>اینترنت اختصاصی فروشگاه است یا مجتمع بندرعباس مال؟</span>
      <select name="internet_type" value={formState.internet_type} onChange={handleSelectChange}>
        <option value="">انتخاب کنید</option>
        <option value="store">اختصاصی فروشگاه</option>
        <option value="mall">مجتمع بندرعباس مال</option>
      </select>
    </label>
  </div>
)} 

        </div>

        <button type="submit" className="submit-button form-button">
          ارسال فرم
        </button>
      </form>
    </div>
  );
};

export default RegisterUnit;