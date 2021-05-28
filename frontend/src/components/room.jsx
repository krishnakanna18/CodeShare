import React from 'react';
import { useState, useEffect } from 'react';
import serverEndpoint from '../config';
import { io } from "socket.io-client";
import { useHistory } from "react-router-dom";
import topbar from 'topbar'

const Room=(props)=>{

    let loadTopBar=()=>{

        topbar.config({
            autoRun      : true,
            barThickness : 3,
            barColors    : {
                '0'      : 'rgba(26,  188, 156, .9)',
                '.25'    : 'rgba(52,  152, 219, .9)',
                '.50'    : 'rgba(241, 196, 15,  .9)',
                '.75'    : 'rgba(230, 126, 34,  .9)',
                '1.0'    : 'rgba(211, 84,  0,   .9)'
            },
            shadowBlur   : 10,
            shadowColor  : 'rgba(0,   0,   0,   .6)'
          })
         setInterval(()=>{
             setLoading(false)
         },10000) 
    }

    //
    useEffect(()=>{
            loadTopBar()
    },[props])


    let [isLoading, setLoading]=useState(true);

    return(
       <div>
           {isLoading===true?
            <div>
                {topbar.show()}
            </div>    
           :
           <div>
                {topbar.hide()}
           </div>
           }
       </div>
    )

}

export default Room;