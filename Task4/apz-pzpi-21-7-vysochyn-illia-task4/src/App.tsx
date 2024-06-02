import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/auth/Login.tsx";
import Registration from "./pages/auth/Registration.tsx";
import Header from "./components/Header.tsx";
import Account from "./pages/auth/Account.tsx";
import axios from "axios";
import {useEffect, useState} from "react";
import {UserData} from "./interfaces/UserData.ts";
import Active from "./pages/Booking/Active.tsx";
import History from "./pages/Booking/History.tsx";
import Home from "./pages/Home.tsx";
import AdminPanel from "./pages/AdminPanel.tsx";
import AdminClusters from "./components/AdminClusters.tsx";
import AdminStorages from "./components/AdminStorages.tsx";
import AdminStaff from "./components/AdminStaff.tsx";
import AdminMain from "./components/AdminMain.tsx";
import localization from "./static/localization.ts";
import ClusterPage from "./pages/ClusterPage.tsx";



const App = () => {
    const [userData, setUserData] = useState<UserData>({email: "", role: "", username:"", balance:""});
    const [jwt,setJwt] = useState(localStorage["jwt"]);
    const [language, setLanguage] = useState(localStorage.getItem('language') || 'EN');
    const texts = localization[language as keyof typeof localization];
    const getUserData = async () => {
        let jwt = localStorage["jwt"];
        if (!jwt) {
            return;
        }
        setJwt(jwt);
        const res = await axios.get("http://localhost:5000/user/", {
            headers: {Authorization: "Bearer " + jwt}
        });
        setUserData(res.data);
    }
    useEffect(()=>{
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
        getUserData();
    },[])
    return (
        <BrowserRouter>
            <div className="flex  flex-col min-h-screen bg-gray-100">
                <Header userDataProp={userData} texts={texts} setLanguage={setLanguage}/>
                <main className="flex-grow flex justify-center items-start ">
                    <Routes>
                        <Route path="/" element={<Home  texts={texts} jwt={jwt}/>} />
                        <Route path="/login" element={<Login  texts={texts}/>} />
                        <Route path="/registration" element={<Registration  texts={texts}/>} />
                        <Route path="/active" element={<Active texts={texts}/>} />
                        <Route path="/history" element={<History  texts={texts}/>} />
                        <Route path="/account" element={<Account  userData={userData} texts={texts}/>} />
                        <Route path="/admin" element={<AdminPanel />} >
                            <Route path="clusters" element={<AdminClusters jwt={jwt}  texts={texts}/>} />
                            <Route path="storages" element={<AdminStorages jwt={jwt}  texts={texts}/>} />
                            <Route path="main" element={<AdminMain jwt={jwt}  texts={texts}/>} />
                            <Route path="staff" element={<AdminStaff jwt={jwt}  texts={texts}/>} />
                        </Route>
                        <Route path="/cluster/:clusterId" element={<ClusterPage texts={texts}  jwt={jwt}/>} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
};

export default App
