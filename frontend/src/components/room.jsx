import React ,{ useContext } from 'react';
import { useState, useEffect } from 'react';
import serverEndpoint from '../config';
import { io } from "socket.io-client";
import { useHistory , useLocation, useParams} from "react-router-dom";
import topbar from 'topbar'
import UserContext from '../contextProvider/userContext'
import SocketContext from '../contextProvider/socketContext'        //Main socket of the user

const Room=(props)=>{
    // let {user, setUser, loggedin, logOutUser }=useContext(UserContext)
    let history=useHistory(), {id: roomId}=useParams(), location=useLocation()
    let {socket, useSocket}=useContext(SocketContext)       //Common user socket
    let [room,setRoom]=useState()

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
    }


    useEffect(()=>{
        let getRoomInfo=async()=>{
            try{
                let st=location.state
                if(st===undefined || st["status"]===undefined){     //When user joins through the link
                    
                    let addParticipant=await fetch(`${serverEndpoint}/room/participant`,{
                        method:"put",
                        credentials:"include",
                        headers:{'Content-Type':'application/json'},
                        body:JSON.stringify({
                            id:`${roomId}`,
                            socket:`${socket.id}`
                        })
                    })
                    let {status}=addParticipant
                    addParticipant=await addParticipant.json()
                    console.log(addParticipant['msg'])
                    if(status===401){
                        setLoading(false)
                        history.push({
                            pathname:'/',
                            state:{msg: addParticipant['msg']+" Log in to join the room."}
                        })
                    }
                    else if(status===404){
                        setLoading(false)
                        history.push({
                            pathname:'/',
                            state:{msgLoggedin: addParticipant['msg']+" Join an existing room."}
                        })
                    }
                    else if(status===403){
                        setLoading(false)
                        history.push({
                            pathname:'/',
                            state:{msgLoggedin: addParticipant['msg']+" It is a private room. Cannot be joined using link"}
                        })
                    }
                }
                else if(st["status"]===200){}         //When user joined through form submission
            }
            catch(e){}

            //When joining through form and to get the details of the room once joined
            let resp=await fetch(`${serverEndpoint}/room/${roomId}`,{
                method:"get",
                credentials:"include"
            })
            let {status}=resp       //Response Status
            resp=await resp.json()
            if(status===401){      //Unauthorized
                setLoading(false)
                history.push({
                    pathname:'/',
                    state:{msg: resp['msg']+" Log in to join the room."}
                })
            }   
            else if(status===404){
                setLoading(false)
                history.push({
                    pathname:'/',
                    state:{msg: resp['msg']+" Join an existing room."}
                })
            }
            setRoom(resp.room)  
            setLoading(false)
        }
        // socket
        getRoomInfo()
    // eslint-disable-next-line
    },[])

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