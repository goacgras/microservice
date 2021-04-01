interface ModalProps {
    title: string;
    confirmText: string;
    closeModal: () => void;
    modalAction: () => void;
}

const Modal: React.FC<ModalProps> = ({
    title,
    confirmText,
    children,
    closeModal,
    modalAction,
}) => {
    return (
        <>
            <div className='fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none'>
                <div className='relative w-auto max-w-sm mx-auto my-6 '>
                    {/*content*/}
                    <div className='relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none'>
                        {/*header*/}
                        <div className='flex items-center justify-center p-5 border-b border-gray-300 border-solid rounded-t'>
                            <h3 className='text-3xl font-semibold'>{title}</h3>
                        </div>
                        {/*body*/}
                        <div className='relative flex-auto p-5'>{children}</div>
                        {/*footer*/}
                        <div className='flex items-center justify-end p-6 border-t border-gray-300 border-solid rounded-b'>
                            <button
                                className='px-6 py-2 mb-1 mr-1 text-sm font-bold text-red-500 uppercase outline-none background-transparent focus:outline-none'
                                type='button'
                                style={{ transition: "all .15s ease" }}
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className='px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase bg-green-500 rounded shadow outline-none active:bg-green-600 hover:shadow-lg focus:outline-none'
                                type='submit'
                                style={{ transition: "all .15s ease" }}
                                onClick={modalAction}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='fixed inset-0 z-40 bg-black opacity-25'></div>
        </>
    );
};

export default Modal;
