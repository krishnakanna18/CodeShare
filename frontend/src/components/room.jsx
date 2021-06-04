import React ,{ useContext } from 'react';
import { useState, useEffect } from 'react';
import serverEndpoint from '../config';
import { io } from "socket.io-client";
import '../css/room.css'
import queryString from 'query-string';
import { useHistory , useLocation, useParams} from "react-router-dom";
import topbar from 'topbar'
import CodeEditor from './codeEditor'
import UserContext from '../contextProvider/userContext'
import SocketContext from '../contextProvider/socketContext'        //Main socket of the user


const Room=(props)=>{
    let {user, loggedin}=useContext(UserContext)
    let history=useHistory(), {id: roomId}=useParams(), location=useLocation()
    let {socket, useSocket}=useContext(SocketContext)       //Common user socket
    let [room,setRoom]=useState()                           //Room information to be stored and set
    let [isLoading, setLoading]=useState(true);
    
    let search = window.location.search;
    let {repo_access_granted} = queryString.parse(search);

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

    // //To display error messages.
    // let showModalErr=(msg)=>{
    //     var locModal = document.getElementById('locModalErr');
    //     // var locModalLabel = document.getElementById('locModalLabelErr');
    //     var btnclose = document.getElementById('w-change-close-err');
    //     var top=document.getElementById("mainPageWrapperErr");

    //     // console.log(locModalLabel)
    //     // locModalLabel.innerText=msg
    //     locModal.style.display = "block";
    //     locModal.style.paddingRight = "17px";
    //     locModal.className="modal fade show";
    //     top.classList.add("enableOverlay");
        
    //     //hide the modal
    //     btnclose.addEventListener('click', (e) => {
    //         locModal.style.display = "none";
    //         locModal.className="modal fade";
    //         // locModalLabel.innerText=""
    //         top.classList.remove("enableOverlay") 
    //     });
    // }

    //Display modal with error messages
    // let modalDisplayErr=()=>{
    //     return(
         
    //     )
    // }

    useEffect(()=>{
        (async()=>{
            try{
                let st=location.state
                //When user joins through the link
                if(st===undefined || st["status"]===undefined){   

                    socket.emit('joinRoom',{participant:user._id, id:`${roomId}`},(roomId,status)=>{
                        let errMsg=""
                        console.log(status)
                        setLoading(false)
                        if(status===401){
                            errMsg="You're not logged in. Log in to join room."
                            history.push({
                                pathname:'/',
                            })
                        }
                        else if(status===404){
                            errMsg="Join an existing room."
                            history.push({
                                pathname:'/',
                            })
                        }
                        else if(status===403){
                            errMsg=" It is a private room. Cannot be joined using link"
                            history.push({
                                pathname:'/',
                            })
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
                history.push({
                    pathname:'/',
                    state:{msg: resp['msg']+" Join an existing room."}
                })
            }
            setRoom(resp.room)  
            setLoading(false)
        })()
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



    return(
            <React.Fragment>
                {isLoading===true?
                    <div>
                        {topbar.show()}
                    </div>    
                :
                
                <div className='meet'>
                    {topbar.hide()}
                    <div className='logo-container roomPageContainer'>
                        {/* <img src={logo} alt='logo' width='70' height='66'/>  */}
                        {/* <h1>Ola</h1> */}
                    </div>
                    <div className='useroptions-container roomPageContainer'></div>
                    <div className='communication-container roomPageContainer'>
                        <div className="com-navbar roomPageContainer">
                            <button ><img src="/homeLogo.png" alt='video' width='40' height='40' /></button>
                            <button><img src="/homeLogo.png" alt='chat' width='40' height='40' /></button>
                            <button><img src="/homeLogo.png" alt='user' width='40' height='40' /></button>
                        </div>
                        <div className="com-overview roomPageContainer">
                            {/* {
                                com === 0?(
                                    <div className='VideoArea'></div>
                                ):
                                ( 
                                    com===1?
                                    <div className="ChatArea"><Chat messages={messages} name={name} message={message} setMessage={setMessage} sendMessage={sendMessage}/></div>
                                    :<div className="ParticipantsArea"><Participant users={usersInRoom}/></div>
                                )
                            } */}
                        </div>
                    </div>
                    <div className='workspace-container roomPageContainer'>
                        <div className="inner-workspace ">
                            {/* {
                                page === 0?(
                                    <div className='codeArea'>
                                        <div className='directory-container'></div>
                                        <div className='code-container'></div>
                                        <div className='terminal-container'></div>
                                    </div>
                                ):
                                ( 
                                    page===1?
                                    <div className="DocEditing"><TextEditor wrapperRef={wrapperRef}/></div>
                                    :<div className="WhiteBoard"><Container image={image} socket={socket} ctx={ctx} setctx={setctx} timeout={timeout} settimeOut={settimeOut}/></div>
                                )
                            } */}
                            {/* Code editor component. Socket is provided to be mapped with the y */}
                            {room!==undefined && room!==null?
                            <CodeEditor user={user} room={room} socket={socket} roomId={`${roomId}`} repo_access_granted={repo_access_granted}></CodeEditor>       
                            :""}
                        </div>
                    </div> 
                    
                    <div className='com-features-container roomPageContainer'>
                        {/* <button onClick={()=>setmicon(!micon)}>{micon?<img src={unmute} alt='video' width='40' height='40' />:<img src={mute} alt='video' width='40' height='40' />}</button>
                        <button onClick={leaveMeet}><img src={endCall} alt='video' width='40' height='40' /></button>
                        <button onClick={()=>setcamon(!camon)}>{camon?<img src={videoOn} alt='video' width='40' height='40' />:<img src={videoOff} alt='video' width='40' height='40' />}</button> */}
                    </div>
                 </div>
                }
                
            </React.Fragment>
    )
}
export default Room;