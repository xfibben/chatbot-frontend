'use client'
import {useRouter} from "next/navigation";

export default function Menu(){

    const router=useRouter();

    return(
        <div className={'flex w-full'}>
            <button className={'p-2 m-5 bg-red-500 rounded-xl'} onClick={()=>router.push('/')}>
                <p>Home</p>
            </button>
            <button className={'p-2 m-5 bg-red-500 rounded-xl'}onClick={()=>router.push('/70005')}>
                <p>70005</p>
            </button>


        </div>
    )
}