import { format } from 'date-fns';
import { enGB } from 'date-fns/locale';

export default function MobileView({ table, datesArr }) {
  const formatDay = (date) => {
    return format(date, 'EEEE d LLLL', { locale: enGB });
  };

  return (
    <div className="table w-full md:hidden after:mt-10">
      {table ? (
        datesArr.map((date, i) => (
          <div key={i} className="w-7/12 mx-auto text-3xl my-14">
            <div className="font-bold">
              <div className="border-b-2">
                <span className="block text-lg font-normal break-words">
                  {formatDay(date)}
                </span>
              </div>
            </div>

            {table[i].map((employee, employeeIndex) => {
              if (table[i].length - 2 <= employeeIndex && table[i].length > 1) {
                return (
                  <div className="mobileview__employee" key={employee._id}>
                    <p>{employee.username}</p>
                    <p className="mt-auto ml-1 text-sm">Evening</p>
                  </div>
                );
              }

              if (table[i].length - 4 <= employeeIndex && table[i].length > 2) {
                return (
                  <div className="mobileview__employee" key={employee._id}>
                    <p>{employee.username}</p>
                    <p className="mt-auto ml-1 text-sm">Mid</p>
                  </div>
                );
              }

              return (
                <div className="mobileview__employee" key={employee._id}>
                  <p>{employee.username}</p>
                </div>
              );
            })}
          </div>
        ))
      ) : (
        <h1 className="text-2xl font-medium text-center my-28 text-slate-800">
          Schedule not published
        </h1>
      )}
    </div>
  );
}
