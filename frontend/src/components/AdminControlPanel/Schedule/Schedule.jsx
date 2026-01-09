import { useState, useEffect } from 'react';
import axios from 'axios';
import { format, addDays, eachDayOfInterval, nextSunday, isFriday } from 'date-fns';
import chunk from 'lodash/chunk';
import sampleSize from 'lodash/sampleSize';
import ScheduleDesktopView from './ScheduleDesktopView';
import ScheduleMobileView from './ScheduleMobileView';
import { useUserContext } from '../../useUserContext';
import { useUsersContext } from '../useUsersContext';
import _ from 'lodash';
import Msg from './../../general/Msg';
import Swal from 'sweetalert2';
import { Alert } from '@mantine/core';
import { FiAlertCircle } from 'react-icons/fi';

const Schedule = () => {
  const { user } = useUserContext();
  const { users, refreshAllUsers } = useUsersContext();
  const [status, setStatus] = useState(null);
  const [button, setButton] = useState(true);
  const [datesArr, setDatesArr] = useState(null);
  const [table, setTable] = useState(null);
  const [sunday, setSunday] = useState(null);
  const [monday, setMonday] = useState(null);
  const [tuesday, setTuesday] = useState(null);
  const [wednesday, setWednesday] = useState(null);
  const [thursday, setThursday] = useState(null);
  const [friday, setFriday] = useState(null);

  useEffect(() => {
    refreshAllUsers();
    const currentDate = new Date();
    const start = nextSunday(currentDate);
    const end = addDays(start, 5);
    setDatesArr(eachDayOfInterval({ start, end }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleSchedule = async (e) => {
    e.preventDefault();
    const employees = Object.assign([], users);
    employees.forEach((employee, index) => {
      delete employee.hash;
      delete employee.salt;
      if (employee.admin) {
        employees.splice(index, 1);
      }
    });

    const schedule = [];

    for (let i = 0; i < datesArr.length; i++) {
      const morningShift = _.shuffle([...employees]);
      const formattedDate = format(datesArr[i], 'dd-MM-yyyy');

      morningShift.forEach((employee) => {
        employee.blockedDates.forEach((blockedDate) => {
          if (blockedDate.date === formattedDate && blockedDate.approved) {
            morningShift.splice(morningShift.indexOf(employee), 1);
          }
        });
      });

      const luckyEmployees = sampleSize(morningShift, 4);
      luckyEmployees.forEach((employee) => {
        morningShift.splice(morningShift.indexOf(employee), 1);
      });

      const employeeSplit = chunk(luckyEmployees, 2);
      const [middleShift, eveningShift] = employeeSplit;

      let newShift = [];
      if (!isFriday(datesArr[i])) {
        newShift = [...morningShift, ...middleShift, ...eveningShift];
      } else {
        const fridayShift = _.sample(morningShift);
        newShift = [fridayShift];
      }
      schedule[i] = newShift;
    }

    const scheduleUID = schedule.map((day, dayIndex) =>
      day.map((employeeData, employeeIndex) => ({
        ...employeeData,
        id: `${dayIndex}-${employeeIndex}`,
      }))
    );

    setTable(scheduleUID);
    setSunday(scheduleUID[0]);
    setMonday(scheduleUID[1]);
    setTuesday(scheduleUID[2]);
    setWednesday(scheduleUID[3]);
    setThursday(scheduleUID[4]);
    setFriday(scheduleUID[5]);
  };

  const uploadSchedule = async (e) => {
    e.preventDefault();
    setButton(false);
    setTimeout(() => setButton(true), 3000);

    const savedSchedule = [sunday, monday, tuesday, wednesday, thursday, friday];
    const savedBy = user.username;

    const badShifts = [];
    savedSchedule.map((day, dayIndex) => {
      if (dayIndex < 5) {
        day.map((user, userIndex) => {
          if (day.length - 4 <= userIndex) {
            badShifts.push(user);
          }
        });
      }
    });

    const sortedBadShifts = chunk(badShifts, 4);
    let middleShift = [];
    let eveningShift = [];
    sortedBadShifts.map((day) =>
      day.map((user, userIndex) => {
        if (userIndex < 2) middleShift.push(user.username);
        else eveningShift.push(user.username);
      })
    );

    const findBadShifts = (shiftArray) => {
      let users = [];
      [...new Set(shiftArray)].forEach((person) => {
        let count = shiftArray.filter((x) => x === person).length;
        if (count > 1) users.push(person);
      });
      return users || null;
    };

    const warnMiddle = findBadShifts(middleShift);
    const warnEvening = findBadShifts(eveningShift);

    const handleWarningText = () => {
      let text = ``;
      if (warnMiddle.length > 0) {
        text += `<div class="mb-3"><p class="font-medium">Two or more middle shifts:</p>${warnMiddle.join(
          ', '
        )}</div>`;
      }
      if (warnEvening.length > 0) {
        text += `<div class="mb-3"><p class="font-medium">Two or more evening shifts:</p>${warnEvening.join(
          ', '
        )}</div>`;
      }
      text += `<div class="flex-grow border-t my-2 border-gray-200"><p>Continue?</p></div>`;
      return text || null;
    };

    if (warnMiddle.length > 0 || warnEvening.length > 0) {
      Swal.fire({
        html: handleWarningText(),
        title: 'Warning!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, shifts are correct',
      }).then((result) => {
        if (result.isConfirmed) {
          axios.post('/postSchedule', { savedSchedule, savedBy }).then((response) => {
            if (response.data === 'Success') {
              setStatus({ OK: true, bolded: 'Done!', msg: 'Schedule uploaded successfully' });
            } else {
              setStatus({ OK: false, bolded: 'Error!', msg: 'Schedule failed to upload' });
            }
          });
          Swal.fire('Schedule uploaded successfully!', 'Everyone can now view it on the homepage', 'success');
        } else setButton(true);
      });
    } else {
      const response = await axios.post('/postSchedule', { savedSchedule, savedBy });
      if (response.data === 'Success') {
        Swal.fire('Schedule uploaded successfully!', 'Everyone can now view it on the homepage', 'success');
      } else setStatus({ OK: false, bolded: 'Error!', msg: 'Schedule failed to upload' });
    }
  };

  const reHandleSchedule = (e) => {
    Swal.fire({
      title: 'Continue?',
      text: 'All changes will be lost and cannot be recovered!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Prepare new schedule',
    }).then((result) => {
      if (result.isConfirmed) handleSchedule(e);
    });
  };

  const formatDay = (date) => {
    return format(date, 'd LLLL');
  };

  const days = { sunday, monday, tuesday, wednesday, thursday, friday, setSunday, setMonday, setTuesday, setWednesday, setThursday, setFriday };

  return (
    <>
      <div>
        <div className="grid mt-5 place-items-center">
          <div className="flex justify-between w-11/12 lg:w-4/6 flex-end">
            <h1 className="text-3xl font-semibold">Create New Work Schedule</h1>
          </div>
        </div>

        <div className="flex lg:grid lg:place-items-center md:grid md:place-items-center ">
          {users && users.length <= 6 && (
            <div className="flex justify-center mt-5">
              <Alert icon={<FiAlertCircle />} title="Warning" color="yellow">
                <p>Few users are registered on the site.</p>
                <p>
                  With fewer than 4 users (non-admins), automatic scheduling may not work properly.
                </p>
              </Alert>
            </div>
          )}

          <div className="hidden w-full mt-10 md:block md:w-5/6 lg:w-4/6">
            {table ? (
              <div className="text-xl">
                <div className="grid grid-cols-6 font-bold">
                  {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((dayName, i) => (
                    <div key={i} className="p-2 border-b">
                      {dayName} <span className="block text-sm font-normal">{formatDay(datesArr[i])}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <h3 className="text-lg text-center">Click "Prepare Schedule" to create a new work schedule.</h3>
            )}

            <ScheduleDesktopView table={table} setTable={setTable} datesArr={datesArr} {...days} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex justify-center my-5">
          {!table && (
            <button onClick={handleSchedule} className="px-4 py-3 text-lg font-semibold text-white rounded-full bg-sky-600 focus:outline-none focus:ring focus:ring-blue-300 hover:bg-sky-700">
              Prepare Schedule
            </button>
          )}
          {table && (
            <button onClick={reHandleSchedule} className="px-4 py-3 text-lg font-semibold text-white rounded-full bg-sky-600 focus:outline-none focus:ring focus:ring-blue-300 hover:bg-sky-700">
              Prepare Schedule {table && 'again'} ⌘
            </button>
          )}
        </form>

        {table && (
          <form onSubmit={uploadSchedule} className="flex justify-center mt-5 mb-20">
            <div className="grid place-items-center">
              {button ? (
                <button type="submit" className="px-4 py-3 text-lg font-semibold text-white bg-green-600 rounded-full focus:outline-none focus:ring focus:ring-green-300 hover:bg-green-700">
                  Upload Schedule
                </button>
              ) : (
                <button className="px-4 py-3 text-lg font-semibold text-white bg-gray-600 rounded-full focus:ring hover:cursor-no-drop" disabled>
                  Upload Schedule
                </button>
              )}
              {status?.OK === false && <Msg bolded={status.bolded} msg={status.msg} OK={status.OK} />}
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default Schedule;
