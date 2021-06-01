import React ,{ useContext } from 'react';
import { useState, useEffect } from 'react';
import serverEndpoint from '../config';
import { io } from "socket.io-client";
import '../css/room.css'
import { useHistory , useLocation, useParams} from "react-router-dom";
import topbar from 'topbar'
import UserContext from '../contextProvider/userContext'
import SocketContext from '../contextProvider/socketContext'        //Main socket of the user

const Room=(props)=>{
    let {user, loggedin}=useContext(UserContext)
    let history=useHistory(), {id: roomId}=useParams(), location=useLocation()
    let {socket, useSocket}=useContext(SocketContext)       //Common user socket
    let [room,setRoom]=useState()                           //Room information to be stored and set


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

    //To display error messages.
    let showModalErr=(msg)=>{
        var locModal = document.getElementById('locModalErr');
        // var locModalLabel = document.getElementById('locModalLabelErr');
        var btnclose = document.getElementById('w-change-close-err');
        var top=document.getElementById("mainPageWrapperErr");

        // console.log(locModalLabel)
        // locModalLabel.innerText=msg
        locModal.style.display = "block";
        locModal.style.paddingRight = "17px";
        locModal.className="modal fade show";
        top.classList.add("enableOverlay");
        
        //hide the modal
        btnclose.addEventListener('click', (e) => {
            locModal.style.display = "none";
            locModal.className="modal fade";
            // locModalLabel.innerText=""
            top.classList.remove("enableOverlay") 
        });
    }

    //Display modal with error messages
    // let modalDisplayErr=()=>{
    //     return(
         
    //     )
    // }

    useEffect(()=>{
        console.log("Rendered")
        let getRoomInfo=async()=>{
            try{
                let st=location.state
                //When user joins through the link
                if(st===undefined || st["status"]===undefined){   

                    socket.emit('joinRoom',{participant:user._id, id:`${roomId}`},(roomId,status)=>{
                        let errMsg=""
                        if(status===401)
                            errMsg="You're not logged in. Log in to join room."
                        else if(status===404)
                            errMsg="Join an existing room."
                        else if(status===403)
                            errMsg=" It is a private room. Cannot be joined using link"

                        setLoading(false)
                        if(errMsg.length>0){
                            console.log(errMsg)
                            var locModal = document.getElementById('locModalErr');
                            console.log(locModal)
                            showModalErr(errMsg)
                            setTimeout(()=>{
                                console.log("After 10 seconds")
                                let btnclose = document.getElementById('w-change-close-err');
                                if(btnclose!==undefined && btnclose!==null){
                                    btnclose.click()
                                }
                                history.push({
                                    pathname:'/',
                                })
                            },10000)   
                        }     
                    })
                }

                // else if(st["status"]===200){}         //When user joined through form submission
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
        getRoomInfo()

        // socket event to get room information
        socket.on('newUserJoined',(args)=>{
            console.log(args)
            setRoom(args.updatedRoom)
        })

    // eslint-disable-next-line
    },[])


    //When the user context value changes
    useEffect(()=>{
        console.log(user,loggedin)
    },[user,loggedin])


    useEffect(()=>{
        // console.log(room," has changed.")
    },[room])

    let [isLoading, setLoading]=useState(true);


    return(
            <React.Fragment>
                <div className="modalAlreadyJoined">
                    <div className="modal fade modalAlreadyJoined p-5" id="locModalErr" tabIndex="-1" role="dialog" aria-labelledby="locModalLabelErr"
                        aria-hidden="true">
                        <div className="modal-dialog modalAlreadyJoined" role="document">
                            <div className="modal-content modalAlreadyJoined">
                                <div className="modal-header modalAlreadyJoined justify-content-center" style={{border:"none"}}>
                                    <h5 className="modal-title modalAlreadyJoined" id="locModalLabelErr"></h5>
                                    <span className="mt-3" style={{color:"white"}} >You'll be redirect to the main page in a short while.</span>
                                </div>
                                <div className="modal-footer modalAlreadyJoined justify-content-center" style={{border:"none"}}>
                                    <button id="w-change-close-err" type="button" className="btn btn-secondary">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>           
                <div  id="mainPageWrapperErr">
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
            </React.Fragment>
    )
}
export default Room;