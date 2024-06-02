import {useEffect, useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {UserData} from "../interfaces/UserData.ts";
import LanguageSelector from "./LanguageSelector.tsx";

const Header: React.FC<{ userDataProp: UserData; texts: any; setLanguage: (language: string) => void }> = ({ userDataProp, texts, setLanguage }) => {
    const [activeTab, setActiveTab] = useState("");
    const [userGreetings, setUserGreetings] = useState<string>("")
    const location = useLocation();

    const handleExitAccount = () => {
        localStorage.clear();
    }
    const handleDragOverExit = () => {
        setUserGreetings(texts.exitPrompt);
    }
    const handleDragEndExit = () => {
        setUserGreetings(`${texts.hello} ${userDataProp?.username}`);
    }
    useEffect(() => {
        setActiveTab(location.pathname.split("/")[1])
        setUserGreetings(`${texts.hello} ${userDataProp.username}`);
    }, [location, userDataProp, texts]);
    return (
        <div className="flex justify-between items-center p-2.5 bg-gray-300 w-full">
            <div className="no-underline text-5xl font-bold text-darkkhaki cursor-pointer">
                <Link to="/">
                    <label>{texts.appName}</label>
                </Link>
            </div>
            <div>
                <Link to="/active">
                    <label className={`ml-2.5 text-2xl cursor-pointer p-5 hover:text-darkslategrey ${
                        activeTab === 'active' ? 'text-wheat font-bold' : 'text-gray-500'
                    }`}>{texts.activeRentals}</label>
                </Link>
                <Link to="/history">
                    <label className={`ml-2.5 text-2xl cursor-pointer p-5 hover:text-darkslategrey ${
                        activeTab === 'history' ? 'text-wheat font-bold' : 'text-gray-500'
                    }`}>{texts.bookingHistory}</label>
                </Link>
                <Link to="/account">
                    <label className={`ml-2.5 text-2xl cursor-pointer p-5 hover:text-darkslategrey ${
                        activeTab === 'account' ? 'text-wheat font-bold' : 'text-gray-500'
                    }`}>{texts.account}</label>
                </Link>
                {(userDataProp?.role === "admin" || userDataProp?.role === "staff") &&
                    <Link to="/admin">
                        <label className={`ml-2.5 text-2xl cursor-pointer p-5 hover:text-darkslategrey ${
                            activeTab === 'administration' ? 'text-wheat font-bold' : 'text-gray-500'
                        }`}>{texts.administration}</label>
                    </Link>}
                {userDataProp == undefined &&
                    <Link to="/login">
                        <label className={`ml-2.5 text-2xl cursor-pointer p-5 hover:text-darkslategrey ${
                            activeTab === 'login' || activeTab === 'registration' ? 'text-wheat font-bold' : 'text-gray-500'
                        }`}>{texts.authorization}</label>
                    </Link>}
                {userDataProp != undefined &&
                    <label className={`ml-2.5 text-2xl cursor-pointer p-5 hover:text-darkslategrey text-gray-500`} onMouseLeave={handleDragEndExit} onMouseOver={handleDragOverExit}
                           onClick={handleExitAccount}>{userGreetings}</label>}
                <LanguageSelector setLanguage={setLanguage} />
            </div>
        </div>
    );
};

export default Header;