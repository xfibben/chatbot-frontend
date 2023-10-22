'use client'
import {useEffect, useState} from "react";

export default function Suma(x,y){

const [resp,setResp]=useState(0)
    useEffect(()=>{
         setResp(x+y);
    })
    return(
        <div>
            {resp}
        </div>
    )
}