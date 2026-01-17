import { Fragment } from 'react';
import { format } from 'date-fns';

export default function DesktopHistoryView({ table, datesArr }) {
  const formatDay = (date) => {
    return format(date, 'd LLLL');
  };

  return (
    <div className="table-row-group" dir="ltr">
      <div className="table-row text-base font-semibold">
        {datesArr &&
          datesArr.map((date, i) => (
            <Fragment key={i}>
              <div className="table-cell md:text-lg md:px-2 lg:text-lg lg:px-3">
                <p className="text-lg font-bold border-b-2 md:text-lg lg:text-xl">
                  {formatDay(date)}
                </p>

                {table &&
                  table[i].map((employee, employeeIndex) => {
                    if (table[i].length - 2 <= employeeIndex && table[i].length > 1) {
                      return (
                        <div className="desktopview__employee" key={employee._id}>
                          <p>{employee.username}</p>
                          <p className="mt-auto ml-1 text-sm">Evening</p>
                        </div>
                      );
                    }

                    if (table[i].length - 4 <= employeeIndex && table[i].length > 2) {
                      return (
                        <div className="desktopview__employee" key={employee._id}>
                          <p>{employee.username}</p>
                          <p className="mt-auto ml-1 text-sm">Mid</p>
                        </div>
                      );
                    }

                    return (
                      <div className="desktopview__employee" key={employee._id}>
                        <p>{employee.username}</p>
                      </div>
                    );
                  })}
              </div>
            </Fragment>
          ))}
      </div>
    </div>
  );
}
