import Filter from '@/components/Filter'
import ProductList from '@/components/ProductList'
import { wixClientServer } from '@/lib/wixClientServer';
import Image from 'next/image'
import { Suspense } from 'react';


const ListPage =async ({searchParams}:{searchParams:any}) => {

  const wixClient = await wixClientServer();

  const cat = await wixClient.collections.getCollectionBySlug(
    searchParams.cat || "all-products"
  );
    //  console.log(cat);

  return (
    <div className='px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative'>
        <div className="px-4 hidden bg-pink-50 sm:flex justify-between h-64 ">
              <div className="flex w-2/3 justify-center flex-col gap-8 items-center">
                  <h1 className="text-4xl font-semibold leading-[48px] text-gray-700">
                        Grab up to 50% off on <br/>
                        Selected Products
                  </h1>
                  <button type='submit' className='bg-lama rounded-3xl text-white w-max text-sm  px-5    py-3  '
                  >Buy Now</button>

              </div>
              <div className="relative w-1/3">
                  <Image alt='product' src="/woman.png" fill className='object-cover' />
              </div>
        </div>
          <Filter/>
          <h1 className="mt-12 text-xl font-semibold">
              {cat?.collection?.name} For You!
          </h1>

           <Suspense fallback={"loading"} >
            <ProductList searchParams={searchParams}    categoryId={cat.collection?._id || "00000000-000000-000000-000000000001"}
/>
           </Suspense>
    </div>
  )
}

export default ListPage