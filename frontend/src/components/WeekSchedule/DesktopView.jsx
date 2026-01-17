import { Fragment } from 'react';

export default function DesktopView({ table, datesArr }) {
  return (
    <div className="table-row-group">
      <div className="table-row text-xl font-semibold">
        {datesArr &&
          datesArr.map((_, i) => (
            <Fragment key={i}>
              <div className="table-cell">
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
