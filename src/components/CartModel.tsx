"use client"

import Image from "next/image";
import { useCartStroe } from '@/hooks/useCartStore';
import { media as wixMedia } from "@wix/sdk";
import { useWixClient } from "@/hooks/useWixClient";

const CartModel = () => {
// const cartItems=true;

   const {cart,removeItem,isLoading}= useCartStroe();

 const wixClient=useWixClient()
console.log(cart);

  return (
    <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgba(0,0,0,0.2)] bg-white
     top-12 right-0 flex flex-col gap-6 z-20 ">
        {!cart.lineItems ? <div className="">Cart is Empty</div> :
   <>
   <div className="text-xl">Shopping Cart</div>
      <div className="flex flex-col gap-8">
        {/* item */}
     { cart.lineItems.map((item) => (

       <div key={item._id} className="flex gap-4 "> 
       {item.image &&  <Image 
         src={wixMedia.getScaledToFillImageUrl(item.image,72,96,{})}
         alt="product"
         width={72}
         height={92}
         className="object-cover rounded-md"
         />}
          <div className="flex flex-col gap-4 justify-between w-full ">
          <div className="">
          <div className="flex items-center justify-between gap-8 ">
              <h3 className="font-semibold">{item.productName?.original}</h3>
              <div className="p-1 bg-gray-50 rounded-sm">
              {item.quantity && item.quantity > 1 && (
                          <div className="text-xs text-green-500">
                            {item.quantity} x{" "}
                          </div>
                        )}
                       
                ${item.price?.amount}</div>
            </div>
            <div className="text-sm text-gray-500  ">
              {item.availability?.status}
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <div className="text-gray-500">Qty. {item.quantity}</div>
            <div className="text-blue-500  " style={{cursor:isLoading?"not-allowd":"pointer"}}
             onClick={()=> removeItem(wixClient,item._id!) }>Remove</div>
          </div>
          </div>
        
         </div>   ))   
          }
        
      </div>

      {/* bottom */}
      <div className="">
        <div className="flex  justify-between items-center font-semibold">
            <span>SubTotal</span>
            <span>${cart.subtotal.amount}</span>
        </div>
        <p className="text-gray-500  text-sm my-2  ">Lorem ipsum kdflm lklkk ut 
        .</p>
          <div className="flex justify-between text-sm
          ">
              <button type="submit" className="rounded-md py-3 px-4 ring-1 ring-gray-300">View Cart</button>
              <button type="submit" className="rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75 " disabled={isLoading}>Checkout</button>
          </div>
      </div>
   </>

         }
    </div>
  )
}

export default CartModel