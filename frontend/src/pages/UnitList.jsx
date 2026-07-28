import React, { useEffect, useState } from 'react';

const UnitList = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/register-unit/unit/get')
      .then((res) => res.json())
      .then((data) => {
        setUnits(data.units || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching units:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">در حال بارگذاری...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">لیست واحدهای ثبت‌شده</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg shadow">
          <thead className="bg-gray-100 text-right">
            <tr>
              <th className="px-4 py-2 border">#</th>
              <th className="px-4 py-2 border">نام واحد</th>
              <th className="px-4 py-2 border">شماره تماس</th>
              <th className="px-4 py-2 border">مدیر</th>
              <th className="px-4 py-2 border">ایمیل</th>
              <th className="px-4 py-2 border">پرسنل</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit, index) => (
              <tr key={unit._id} className="text-sm hover:bg-gray-50">
                <td className="px-4 py-2 border">{index + 1}</td>
                <td className="px-4 py-2 border">{unit.unit_name}</td>
                <td className="px-4 py-2 border">{unit.customer_contact}</td>
                <td className="px-4 py-2 border">{unit.manager_name}</td>
                <td className="px-4 py-2 border">{unit.manager_email}</td>
                <td className="px-4 py-2 border">
                  {unit.personnel && unit.personnel.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {unit.personnel.map((p, idx) => (
                        <li key={idx}>
                          {p.name} ({p.phone})
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-400">ندارد</span>
                  )}
                </td>
              </tr>
            ))}
            {units.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  هیچ واحدی ثبت نشده است.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnitList;
