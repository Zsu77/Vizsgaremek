import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { useUserContext } from '../../useUserContext';
import { PencilAltIcon } from '@heroicons/react/outline';
import Msg from '../../general/Msg';
import axios from 'axios';
import { HashLoader } from 'react-spinners';

export default function Modal({ dateID }) {
  const { user, refresh } = useUserContext();
  const [modalData, setModalData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [requestStatus, setReqStatus] = useState(null);

  const closeModal = async () => {
    setIsOpen(false);
    setModalData(null);
  };

  const DeleteRequest = async () => {
    const response = await axios.post('/delete-request', {
      employeeID: user.id,
      dateID,
    });

    if (response.data.msg === 'RequestDeletionSuccess') {
      setReqStatus({
        bold: 'OK!',
        msg: '',
        OK: true,
      });
      refresh();
    } else {
      setReqStatus({
        bold: 'Error',
        msg: 'Please try again later',
        OK: false,
      });
    }
  };

  const openModal = async () => {
    setIsOpen(true);
    const response = await axios.get('/api/request-info', {
      params: { employeeID: user.id, dateID },
    });
    setModalData(...response.data);
  };

  return (
    <>
      <div onClick={openModal} className="flex p-0.5 mt-2 select-none cursor-pointer">
        <PencilAltIcon className="w-[1.45rem] m-0.5" />
        <p className="font-medium underline">More...</p>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
          <div className="min-h-screen px-4 text-center bg-black bg-opacity-40">
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
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-right align-middle transition-all transform bg-white rounded-lg shadow-xl">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Request Details
                </Dialog.Title>

                <div className="mt-2">
                  {modalData && (
                    <>
                      <div>
                        <p className="font-medium">Date</p>
                        <p>{modalData.date}</p>
                      </div>

                      <div>
                        <p className="font-medium">Reason</p>
                        {modalData.comment ? <p>{modalData.comment}</p> : <p>—</p>}
                      </div>

                      <div>
                        <p className="font-medium">Status</p>
                        <p>{modalData.approved ? 'Approved' : 'Not approved'}</p>
                      </div>
                    </>
                  )}

                  {!modalData && (
                    <div className="flex justify-center py-10">
                      <HashLoader size={40} />
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 rounded-md hover:bg-blue-200"
                    onClick={closeModal}
                  >
                    Close
                  </button>

                  <button
                    type="button"
                    className="inline-flex justify-center mr-1.5 px-4 py-2 text-sm font-medium text-red-900 bg-blue-100 rounded-md hover:bg-red-200"
                    onClick={DeleteRequest}
                  >
                    Delete
                  </button>

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
    </>
  );
}
