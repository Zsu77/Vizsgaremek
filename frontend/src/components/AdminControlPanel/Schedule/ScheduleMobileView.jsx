import React from 'react';

export default function ScheduleMobileView({ table, formatDay, datesArr }) {
  return (
    <div className="table md:hidden w-full mt-10 md:w-9/12 lg:w-8/12 mb-10" dir="ltr">
      {table ? (
        datesArr.map((date, i) => {
          return (
            <div
              key={i}
              className="text-2xl w-7/12 mt-3 mx-auto rounded bg-tran"
            >
              <div className="font-bold">
                <div className="border-b-2">
                  {formatDay(date)}
                </div>
              </div>

              {table[i].morning.map((employee) => (
                <div key={employee._id} className="font-semibold text-lg">
                  <p>{employee.username}</p>
                </div>
              ))}

              {table[i].middle.map((employee) => (
                <div key={employee._id} className="font-semibold text-lg">
                  <p>
                    {employee.username}
                    <span className="font-semibold text-xs"> (Mid)</span>
                  </p>
                </div>
              ))}

              {table[i].evening.map((employee) => (
                <div key={employee._id} className="font-semibold text-lg">
                  <p>
                    {employee.username}
                    <span className="font-semibold text-xs"> (Evening)</span>
                  </p>
                </div>
              ))}
            </div>
          );
        })
      ) : (
        <h3 className="text-center text-lg">
          Click “Generate Schedule” to create a new work schedule.
        </h3>
      )}
    </div>
  );
}
