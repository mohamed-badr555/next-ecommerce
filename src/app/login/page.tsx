"use client"

import { useWixClient } from "@/hooks/useWixClient"
import { LoginState } from "@wix/sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";
import  Cookies  from 'js-cookie';


enum Mode{
  LOGIN="LOGIN",
  REGISTER="REGISTER",
  RESET_PASSWORD="RESET PASSWORD",
  EMAIL_VERIFICATION="EMAIL VERIFICATION",
}



const LoginPage = () => {
  const router =useRouter() 
  const wixClient = useWixClient();
  const isLoggedIn=wixClient.auth.loggedIn();
  if(isLoggedIn){
    router.push('/');
  }
  const [mode, setMode] = useState(Mode.LOGIN)

  const [username,setUsername]=useState("")
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [emailCode,setEmailCode]=useState("")
  const [isLoading,setIsLoading]=useState(false)
  const [error,setError]=useState("")
  const [message,setMessage]=useState("")
  const formTitle= mode === Mode.LOGIN ? "Log in" :mode ===Mode.REGISTER?"Register":
    mode===Mode.RESET_PASSWORD?"Reset Your Password":"Verify Your Email";
  const buttonTitle= mode===Mode.LOGIN ? "Login":mode===Mode.REGISTER?"Register":
  mode===Mode.RESET_PASSWORD?"Rest":"Verify";

    const handleSubmit= async (e:React.FormEvent)=>{
      e.preventDefault();
      setIsLoading(true);
      setError("");
      try{
          let response;
        switch(mode){
            case Mode.LOGIN:
            response = await wixClient.auth.login({
              email,
                password,
            })
            break;
            case Mode.REGISTER:
            response = await wixClient.auth.register({
              email,
                password,
                profile: { nickname: username },
            })
            break;
            case Mode.RESET_PASSWORD:
          response = await wixClient.auth.sendPasswordResetEmail(
            email,
            window.location.href
          );
          setMessage("Password reset email sent. Please check your e-mail.");
          break;
            case Mode.EMAIL_VERIFICATION:
              response = await wixClient.auth.processVerification({
                verificationCode: emailCode,
              });
              break;
              
            default:
              break;

        }
        
      switch (response?.loginState) {
        case LoginState.SUCCESS:
          setMessage("Successful! You are being redirected.");
          const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
            response.data.sessionToken!
          );

          Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
            expires: 2,
          });
          wixClient.auth.setTokens(tokens);
          router.push("/");
          break;
          case LoginState.FAILURE:
            if (
              response.errorCode === "invalidEmail" ||
              response.errorCode === "invalidPassword"
            ) {
              setError("Invalid email or password!");
            } else if (response.errorCode === "emailAlreadyExists") {
              setError("Email already exists!");
            } else if (response.errorCode === "resetPassword") {
              setError("You need to reset your password!");
            } else {
              setError("Something went wrong!");
            }
          case LoginState.EMAIL_VERIFICATION_REQUIRED:
            setMode(Mode.EMAIL_VERIFICATION);
          case LoginState.OWNER_APPROVAL_REQUIRED:
            setMessage("Your account is pending approval");
        default:
          break;
      }
      }catch(err){
        // console.log(err);
        setError("Something went wrong!");
        
      }finally{
        setIsLoading(false);
      }
    
    }



  return (
    <div className="h-[calc(100vh-80px)] px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex items-center justify-center  " >
        <form className="flex flex-col gap-8 " onSubmit={handleSubmit} >
           <h1 className="text-2xl " > {formTitle}</h1>
           {mode ===Mode.REGISTER ?(
              <div className="flex flex-col gap-2">
                <label htmlFor="username" className="text-sm text-gray-700" >Username</label>
                <input type="text" name="username"
                 placeholder="Enter yout name"
                  className="ring-2 outline-none ring-gray-300 rounded-md p-4 "  onChange={(e) => setUsername(e.target.value)} />
              </div>
           ) : null }

           {mode !== Mode.EMAIL_VERIFICATION ?(
                  <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-sm text-gray-700">E-mail</label>
                  <input   onChange={(e) => setEmail(e.target.value)} type="email" name="email"  placeholder="Enter yout email"  className="ring-2 outline-none ring-gray-300 rounded-md p-4 " />
                </div>
           ):(
            <div className="flex flex-col gap-2">
            <label htmlFor="emailCode" className="text-sm text-gray-700">Verification Code</label>
            <input  onChange={(e) => setEmailCode(e.target.value)} type="text" name="emailCode" placeholder="Code " className="ring-2 outline-none ring-gray-300 rounded-md p-4 " />
          </div>
           )}
            {mode ===Mode.LOGIN || mode=== Mode.REGISTER ?(
                  <div className="flex flex-col gap-2">
                  <label htmlFor="password" className="text-sm text-gray-700">Password</label>
                  <input   onChange={(e) => setPassword(e.target.value)} type="password" name="password" placeholder="Enter your password " className="ring-2 outline-none ring-gray-300 rounded-md p-4 " />
                </div>
            ):null}
          {mode === Mode.LOGIN &&(
            <div onClick={()=> setMode(Mode.RESET_PASSWORD)} className="text-sm underline cursor-pointer">
             Forgot Password? 
            </div>
          )}
          <button  className="bg-lama text-white p-2 rounded-md disabled:bg-pink-200 disabled:cursor-not-allowed">
              {isLoading ? "Loading..." : buttonTitle}
          </button>
              {error && <div className="text-red-600">{error}</div> }
          {mode=== Mode.LOGIN &&(
            <div className="text-sm underline cursor-pointer" onClick={()=> setMode(Mode.REGISTER)}>
                  {"Don't"} have an account?
            </div>
          ) }
          {mode=== Mode.REGISTER &&(
            <div className="text-sm underline cursor-pointer" onClick={()=> setMode(Mode.LOGIN)}>
                 have an account?
            </div>
          ) }
          {mode=== Mode.RESET_PASSWORD &&(
            <div className="text-sm underline cursor-pointer" onClick={()=> setMode(Mode.LOGIN)}>
                 Go back to Login
            </div>
          ) }
          {message && <div className="text-green-600 text-sm">{message}</div> }
        </form>
    </div>
  )
}

export default LoginPage