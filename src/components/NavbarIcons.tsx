"use client"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import CartModel from "./CartModel";
import { useWixClient } from "@/hooks/useWixClient";
import  Cookies  from 'js-cookie';
import { useCartStroe } from "@/hooks/useCartStore";


const NavbarIcons = () => {
    const [isProfile, setIsProfile] = useState(false);
    const [isCartOpen, setIsCartOpen] =useState(false)
     const [isLoading, setIsLoading] =useState(false)
   const router = useRouter()
  //  const pathName=usePathname();
   const wixClient = useWixClient();
   const isLoggedIn=wixClient.auth.loggedIn();

    // const isLogged=false;
    const handleProfile=()=>{
                // setIsProfile(prev => !prev)
                if(!isLoggedIn){
                        router.push("/login")
                }else{

                  setIsProfile(prev => !prev)
                }
    }
  //login with wix
    // const wixClient= useWixClient();
    // const login = async ()=>{
    //   const loginRequestData = wixClient.auth.generateOAuthData(
    //     "http://localhost:3000",
        
    //   );
    //   console.log(loginRequestData);
    //   localStorage.setItem("uAthData",JSON.stringify(loginRequestData));
    //   const {authUrl} = await wixClient.auth.getAuthUrl(loginRequestData);
    //   window.location.href= authUrl;

    // }
      const handleLogout=async ()=>{
      setIsLoading(true);
      Cookies.remove("refreshToken")
      const {logoutUrl} = await wixClient.auth.logout(window.location.href)
          setIsLoading(false);
          setIsProfile(false)
          router.push(logoutUrl)
      }

      const {cart, counter,getCart}= useCartStroe();
      useEffect(() => {
     
       getCart(wixClient)
      }, [wixClient,getCart])

  return (
    <div className="flex items-center gap-4 xl:gap-8 relative">
           <Image src="/profile.png" alt="profile" width={22} height={22}
            className="cursor-pointer" 
            onClick={handleProfile} 
            // onClick={login}
            /> 
            {isProfile &&  <div className="absolute p-4 rounded-md top-12 left-0 text-sm bg-white shadow-[0_3px_10px_rgba(0,0,0,0.2)] z-20 ">
                <Link href="/"> Profile</Link>
                <div className="mt-2 cursor-pointer" onClick={handleLogout}>{isLoading?"Logging out":"Logout"}</div>
            </div> }
           <Image src="/notification.png" alt="profile" width={22} height={22}
            className="cursor-pointer" /> 
            <div className="relative cursor-pointer"   onClick={_ => setIsCartOpen(prev => !prev)}>

           <Image src="/cart.png" alt="profile" width={22} height={22}
          /> 
          <div className="absolute -top-4 -right-4 w-6 h-6 bg-lama text-white rounded-full text-sm flex items-center justify-center ">{counter}</div>
                
            </div>
                {isCartOpen && (
                    <CartModel/>
                )}
    </div>
  )
}

export default NavbarIcons