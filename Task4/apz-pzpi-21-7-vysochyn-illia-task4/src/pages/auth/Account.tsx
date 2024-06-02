import axios from "axios";
import {useState} from "react";
import {UserData} from "../../interfaces/UserData.ts";

const Account: React.FC<{ userData: UserData, texts: any }> = ({ userData, texts }) => {
    const [replenishAmount, setReplenishAmount] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleReplenish = async () => {
        try {
            const jwt = localStorage.getItem('jwt');
            await axios.patch(
                'http://localhost:5000/user/replenish/',
                { amount: replenishAmount },
                {
                    headers: { Authorization: `Bearer ${jwt}` },
                }
            );
            setShowModal(false);
            window.location.reload()
        } catch (error:any) {
            console.error('Error replenishing balance:', error);
            alert(error.response.data.message);
        }
    };

    return (
        <div className="container flex flex-col items-center justify-center mx-auto p-4">
            <h2 className="text-4xl text-center font-extrabold mb-8 text-gray-900">{texts.account}</h2>
            <div className="mb-2 min-w-80 text-center bg-white p-6 rounded-lg shadow-md">
                <label className="block text-gray-600 text-lg font-semibold mb-2">{texts.username}</label>
                <p className="text-gray-800 text-xl">{userData?.username}</p>
            </div>
            <div className="mb-2 min-w-80 text-center bg-white p-6 rounded-lg shadow-md">
                <label className="block text-gray-600 text-lg font-semibold mb-2">{texts.email}</label>
                <p className="text-gray-800 text-xl">{userData?.email}</p>
            </div>
            <div className="mb-6 min-w-80 text-center bg-white p-6 rounded-lg shadow-md">
                <label className="block text-gray-600 text-lg font-semibold mb-2">{texts.balance}</label>
                <p className="text-gray-800 text-xl">{userData?.balance}</p>
            </div>
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
            >
                {texts.replenishBalance}
            </button>
            {showModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div
                        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
                        <div
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">{texts.replenishBalance}</h3>
                                        <div className="mt-2">
                                            <input
                                                type="number"
                                                value={replenishAmount}
                                                min={0}
                                                onChange={(e) => setReplenishAmount(e.target.value)}
                                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                                placeholder={texts.enterAmount}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={handleReplenish}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    {texts.replenish}
                                </button>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                >
                                    {texts.cancel}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Account;