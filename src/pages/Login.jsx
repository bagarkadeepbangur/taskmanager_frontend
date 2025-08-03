import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate,useLocation } from "react-router-dom";
import { toast } from "sonner";
import Button from "../components/Button";
import Loading from "../components/Loading";
import Textbox from "../components/Textbox";
import { useLoginMutation } from "../redux/slices/api/authApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { useRef,useEffect } from "react";
import CryptoJS from 'crypto-js';

const Login = () => {
  console.log("Login called")
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (data) => {
    try {
      const res = await login(data).unwrap();

      dispatch(setCredentials(res));
      // console.log(JSON.parse(localStorage.getItem("userInfo"))._id)
      const redirectTo = new URLSearchParams(window.location.search).get('redirect')||null;
      // console.log("RedirectUrl-->",redirectTo)
      sessionStorage.setItem("hasRedirected", "false");
      if(redirectTo){
        localStorage.setItem("redirectUrl",redirectTo)
        const encrypted = encryptPayload(JSON.parse(localStorage.getItem("userInfo")));
        const encoded = encodeURIComponent(encrypted);
        window.location.href =redirectTo+`?token=${encoded}`;
      }else{
        navigate("/");
      }
      // window.location.reload();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  function encryptPayload(data) {
    // console.log("Data-->",data,import.meta.env.VITE_APP_ENCRYPT_KEY)
    const secret = import.meta.env.VITE_APP_ENCRYPT_KEY//"74f32b18988211ff3ce7e1206c5df9811ba7ee25ec828ca4381e68ce802e1e1e";
    const key = CryptoJS.enc.Hex.parse(secret);
    const iv = CryptoJS.lib.WordArray.random(16);
  
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
  
    const ivBase64 = CryptoJS.enc.Base64.stringify(iv);
    const cipherBase64 = encrypted.toString();
  
    return `${ivBase64}:${cipherBase64}`;
  }
  const handleSignUp = async (data) => {
    try {
      // const res = await login(data).unwrap();

      // dispatch(setCredentials(res));
      navigate("/forgetPassword");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  const hasNavigated = useRef(false);
  useEffect(() => {
    if (!user || hasNavigated.current) return;
    const redirectTo = localStorage.getItem("redirectUrl")||null;
    // console.log("RedirectUrl use effect-->",localStorage.getItem("redirectUrl"),user)
    // if(user){
      const encrypted = encryptPayload(user);
      const encoded = encodeURIComponent(encrypted);
    // }
    hasNavigated.current = true;
    const hasRedirected = sessionStorage.getItem("hasRedirected") === "true";
    // console.log("hasRedirected",hasRedirected)
    if (hasRedirected) return;
    sessionStorage.setItem("hasRedirected", "true");
    if (redirectTo) {
      const isExternal = redirectTo.startsWith("https");
      const cleanedURL = location.pathname;
      window.history.replaceState({}, "", cleanedURL);
      // console.log(redirectTo,isExternal)
      if (isExternal) {
        window.location.href = localStorage.getItem("redirectUrl")+`?token=${encoded}`;
      } else {
        navigate(localStorage.getItem("redirectUrl")+`?token=${encoded}`, { replace: true });
      }
    }else{
      user && navigate("/dashboard", { replace: true });
    }
  }, [user]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6] dark:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#302943] via-slate-900 to-black'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base dark:border-gray-700 dark:text-blue-400 border-gray-300 text-gray-600'>
              Manage all your task in one place!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center dark:text-gray-400 text-blue-700'>
              <span>Cloud-based</span>
              <span>Task Manager</span>
            </p>

            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>

        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(handleLogin)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white dark:bg-slate-900 px-10 pt-14 pb-14'
          >
            <div>
              <p className='text-blue-600 text-3xl font-bold text-center'>
                Welcome back!
              </p>
              <p className='text-center text-base text-gray-700 dark:text-gray-500'>
                Keep all your credetials safe!
              </p>
            </div>
            <div className='flex flex-col gap-y-5'>
              <Textbox
                placeholder='you@example.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full rounded-full'
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder='password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded-full'
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password?.message : ""}
              />
              <span className='text-sm text-gray-600 hover:underline cursor-pointer' onClick={handleSignUp}>
                Forget Password?
              </span>
            </div>
            {isLoading ? (
              <Loading />
            ) : (
              <Button
                type='submit'
                label='Log in'
                className='w-full h-10 bg-blue-700 text-white rounded-full'
              />
            )}
            {/* <p className='text-center text-base text-gray-700 dark:text-gray-500'>Not Registered?<span className='text-sm text-gray-600 hover:underline cursor-pointer' onClick={handleSignUp}>&nbsp;Sign Up</span></p> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;