import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Msg from '../../../general/Msg';
import Button from './Button';
import axios from 'axios';
import { HashLoader } from 'react-spinners';
import { useUsersContext } from './../../useUsersContext';

export default function UserInfoModal({
  user,
  isOpen,
  closeModal,
  modalData,
  setModalData,
  requestStatus,
  setReqStatus,
}) {
  const { refreshAllUsers } = useUsersContext();

  const saveUser = async () => {
    delete modalData.hash;
    delete modalData.salt;
    delete modalData.blockedDates;

    const response = await axios.post('/update-user', { modalData });

    if (response.data === 'Success') {
      setReqStatus({
        bold: 'Success!',
        msg: 'User details updated successfully',
        OK: true,
      });
      await refreshAllUsers();
    } else if (response.data === 'NoChangesMade') {
      setReqStatus({
        bold: 'Success!',
        msg: 'User details updated successfully',
        OK: true,
      });
    } else if (response.data === 'UsernameTaken') {
      setReqStatus({
        bold: 'Error',
        msg: 'Username already exists',
        OK: false,
      });
    } else if (response.data === 'UsernameIsEmpty') {
      setReqStatus({
        bold: 'Error',
        msg: 'Username cannot be empty',
        OK: false,
      });
    } else {
      setReqStatus({
        bold: 'Error',
        msg: 'Please try again later',
        OK: false,
      });
    }

    refreshAllUsers();
  };

  const deleteUser = async () => {
    const { _id } = user;
    const response = await axios.post('/delete-user', { _id });

    if (response.data === 'RequestDeletionSuccess') {
      setReqStatus({
        bold: 'Success!',
        msg: 'User deleted successfully',
        OK: true,
      });
    } else {
      setReqStatus({
        bold: 'Error',
        msg: 'Please try again later',
        OK: false,
      });
    }
  };

  const genPassword = () => {
    const password = Array(4)
      .fill('0123456789')
      .map((x) => x[Math.floor(Math.random() * x.length)])
      .join('');

    setModalData({ ...modalData, password });
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto bg-black bg-opacity-40"
        onClose={closeModal}
      >
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
              <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
                Edit User
              </Dialog.Title>

              <div className="mt-2">
                {modalData ? (
                  <>
                    <div className="my-5 modal__section">
                      <p className="font-medium">Username</p>
                      <input
                        className="border-2"
                        type="text"
                        value={modalData.username}
                        onChange={(e) => {
                          const text = e.target.value;
                          if (text.length <= 10) {
                            setModalData({ ...modalData, username: text });
                          }
                        }}
                      />
                    </div>

                    <div className="my-5 modal__section">
                      <p className="font-medium">Password</p>
                      <input
                        type="text"
                        placeholder="(Optional) New password"
                        className="border-2"
                        value={modalData.password || ''}
                        onChange={(e) =>
                          setModalData({ ...modalData, password: e.target.value })
                        }
                      />
                      <button
                        className="p-1 mx-2 bg-gray-300 rounded-xl hover:bg-gray-400"
                        onClick={genPassword}
                      >
                        Random Password
                      </button>

                      <div className="mt-5">
                        <p className="text-sm text-gray-500">
                          * To change user role (admin or regular user), please request it
                          separately.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center py-10">
                    <HashLoader className="content-center" size={40} />
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Button name="Close" color="blue" onClick={closeModal} />
                <Button name="Delete" color="red" onClick={deleteUser} />
                <Button name="Save" color="green" onClick={saveUser} />
                {requestStatus && (
                  <Msg
                    bolded={requestStatus.bold}
                    msg={requestStatus.msg}
                    OK={requestStatus.OK}
                  />
                )}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
