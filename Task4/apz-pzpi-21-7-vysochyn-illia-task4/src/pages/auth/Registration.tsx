import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {useState} from "react";

const Registration: React.FC<{ texts: any }> = ({ texts }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [pas1, setPas1] = useState("");
    const [pas2, setPas2] = useState("");
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    function registrationRequest() {
        if(pas1==pas2)
        axios.post("http://localhost:5000/user/registration", {
            email: email,
            username: username,
            password: pas1
        }).then(() => {
            navigate('/login');
        }).catch(err=>{
            console.log(err)
            alert(err.response.data.message)
        })
    }

    return (
        <div className="flex flex-col justify-center">
            <div id="main" className="h-full flex flex-1 flex-col justify-center">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight">
                        {texts.createAccount}
                    </h2>
                </div>

                <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-4" action="#" method="POST" onSubmit={(e) => {
                        e.preventDefault();
                        registrationRequest();
                    }}>
                        <div>
                            <label htmlFor="username" className="block text-xl font-medium">
                                {texts.username}
                            </label>
                            <div className="mt-2">
                                <input
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                    }}
                                    name="username"
                                    type="text"
                                    value={username}
                                    required
                                    className="ring-slate-700 block w-full rounded-md text-black text-xl border-0 py-1.5 px-3 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xl "
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-xl font-medium">
                                {texts.email}
                            </label>
                            <div className="mt-2">
                                <input onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                       id="email"
                                       name="email"
                                       type="email"
                                       required
                                       className="ring-slate-700 block w-full text-xl rounded-md border-0 py-1.5 px-3 text-black shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xl"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xl font-medium">
                                {texts.password}
                            </label>
                            <div className="mt-2 relative">
                                <input onChange={(e) => {
                                    setPas1(e.target.value);
                                }}
                                       id="password"
                                       name="password"
                                       type={showPassword1 ? 'text' : 'password'}
                                       required
                                       className=" ring-slate-700 block w-full text-xl rounded-md border-0 py-1.5 px-3 text-black shadow-sm ring-1 ring-inset  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xl"
                                />
                                <button
                                    className={"text-xl m-[1px] absolute right-0 top-0 flex items-center justify-center rounded-xl h-[34px] w-[34px] "}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowPassword1(!showPassword1);
                                    }}>
                                    {showPassword1 ?
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth="1.5" stroke="black" className=" w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                               strokeWidth="1.5" stroke="white" className=" w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    }
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="password-repeat"
                                   className="block text-xl font-medium ">
                                {texts.repeatPassword}
                            </label>
                            <div className="mt-2 relative">
                                <input onChange={(e) => {
                                    setPas2(e.target.value);
                                }}
                                       id="password-repeat"
                                       name="password-repeat"
                                       type={showPassword2 ? 'text' : 'password'}
                                       required
                                       className="ring-slate-700 block text-xl w-full rounded-md border-0 py-1.5 px-3 text-black shadow-sm ring-1 ring-inset  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xl"
                                />
                                <button
                                    className={"m-[1px] text-xl absolute right-0 top-0 flex items-center justify-center rounded-xl h-[34px] w-[34px] "}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShowPassword2(!showPassword2);
                                    }}>
                                    {showPassword2 ?
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             strokeWidth="1.5" stroke="black" className=" w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                               strokeWidth="1.5" stroke="black" className=" w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l-3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    }
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-xl font-semibold shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                {texts.submit}
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 mb-5 text-center text-sm text-gray-500">
                        {texts.alreadyHaveAccount}
                        <Link to="/login" className="font-semibold text-l text-indigo-600 hover:text-indigo-500"> {texts.login}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;