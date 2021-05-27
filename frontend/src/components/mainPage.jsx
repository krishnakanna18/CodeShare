import React from 'react';
import { useState, useEffect } from 'react';
import serverEndpoint from '../config'
import '../css/mainPage.css'
import { io } from "socket.io-client";
import { useHistory } from "react-router-dom";


const MainPage=(props)=>{

    let [ddst,setddst]=useState(false);
    let [prShowJoin,setprShowJoin]=useState(false);
    let [prShowCreate,setprShowCreate]=useState(false);
    let [joinShow,setJoinShow]=useState(false);
    let [createShow,setCreateShow]=useState(false);
    let [socket,setSocket]=useState(io(`${serverEndpoint}`))

    let history=useHistory()

    useEffect(()=>{
        console.log(props)
    },[props])

    useEffect(()=>{

        let doc=document.getElementById("profileDropdown-content")
        if(ddst===true)
            doc.style.display="block"
        else 
            doc.style.display="none"
    },[ddst])


    let toggleDropDown=()=>{
        setddst(!ddst)
    }

    let logOutUser=()=>{
        props.logOutUser()
    }

    let showPwd=(type)=>{
        let option;
        if(type==="create")
            option=document.getElementById("mainPageCreateRoomFormType")
        else if(type==="join")
            option=document.getElementById("mainPageJoinRoomFormType")
        if(option!==undefined && option!==null){
            if(type==="create"){
                if(option.value==="private")
                    setprShowCreate(true);
                else
                    setprShowCreate(false);
            }
            else if(type==="join"){
                if(option.value==="private")
                    setprShowJoin(true);
                else
                    setprShowJoin(false);
            }
        }
    }

    let toggleOpen=(type)=>{
        let form;
        if(type==="create"){
            let createForm=document.getElementById("mainPageCreateRoomPadding")
            if(createShow===true)
                createForm.style.padding="20px"
            else
                createForm.style.padding="40px"
            setCreateShow(!createShow)
        }
        else if(type==="join"){
            let joinForm=document.getElementById("mainPageJoinRoomPadding")
            if(joinShow===true)
                joinForm.style.padding="20px"
            else
                joinForm.style.padding="40px"
            setJoinShow(!joinShow)
        }

    }
    let createRoom=async(formData)=>{

        let body={}
        for(let pair of formData)
            body[`${pair[0]}`]=pair[1]

        socket.emit('createRoom',{...body},(roomId)=>{
            if(roomId!==undefined && roomId!==null){
                console.log(roomId);
                history.push(`/room/${roomId}`)
            }
            else{
                //Display Creation of room failed
            }
        })

        // let resp=await fetch(`${serverEndpoint}/room`,{
        //     method:"post",
        //     credentials:"include",
        //     headers:{'Content-Type':'application/json'},
        //     body:JSON.stringify(body)
        // })
        // resp=await resp.json()
    }


    return (
        <React.Fragment>
        <div>
            <div className="container-lg homePageTopBar mt-2 d-flex flex-sm-row align-items-center justify-content-center-sm justify-content-end" >

                <div className="container-lg col-sm-3 col-0">
                    <div className="d-flex flex-row align-items-center homePageTopBarLogoWrapper">
                        <img src="homeLogo.png" className="homePageTopBarLogo"  alt="" style={{borderRadius:"50%"}}/>
                        <h3  className="homePageTopBarName" style={{color:"#FD4D4D"}}>Meet2Code</h3>
                    </div>
                </div>

                <div className="container-lg col-sm-6 col-11 homePageTopBarInputWrapper">
                    <div className=" d-flex flex-row align-items-center justify-content-start homePageSearchBar">
                        <div className="col-2"  style={{textAlign:"center"}}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="#5d7290" xmlns="http://www.w3.org/2000/svg"><g clipPath="url(#sm-solid-search_svg__clip0)" fillRule="evenodd" clipRule="evenodd"><path d="M7.212 1.803a5.409 5.409 0 100 10.818 5.409 5.409 0 000-10.818zM0 7.212a7.212 7.212 0 1114.424 0A7.212 7.212 0 010 7.212z"></path><path d="M11.03 11.03a.901.901 0 011.275 0l3.43 3.432a.902.902 0 01-1.274 1.275l-3.431-3.431a.901.901 0 010-1.275z"></path></g><defs><clipPath id="sm-solid-search_svg__clip0"><path d="M0 0h16v16H0z"></path></clipPath></defs></svg>
                        </div>
                        <div className="col-10">
                            <input placeholder="Search for public rooms or users" className="homePageSearchBarInput" style={{outline:"none"}}>
                            </input>
                        </div>
                    </div>
                </div>


                <div className="col-sm-3 col-1 container-lg justify-content-center profileDropdown" style={{textAlign:"center", cursor:"pointer"}}>
                    
                    <div className="profileDropdown"  onClick={()=>{toggleDropDown()}}>
                        <img src={`${props.user.imageUrl}`} className="homePageUserDP " ></img>
                        <div className="profileDropdown-content mt-2" id="profileDropdown-content">
                            <div className="profileDropdown-content-list d-flex flex-column ">
                                <div className="col d-flex flex-row align-items-center justify-content-around">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="white" xmlns="http://www.w3.org/2000/svg" className="col-2 justify-content-center"><path d="M8 8c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.65 0-8 1.35-8 4v2h16v-2c0-2.65-5.35-4-8-4z"></path></svg>
                                <div className="col=10">{props.user.login}</div>
                                </div>
                            </div>
                            <div className="logOutButton" style={{textAlign:"left"}} onClick={logOutUser}>
                                <span style={{paddingLeft:"25px"}}>Log Out</span>
                            </div>
                        </div>
                    </div>
                </div>
               
            </div>
        </div>

        {/* Start a room or join a room */}
        <div>
            <div className="mainPageCreateorJoinRoom container d-flex flex-lg-row flex-column align-items-start">
                <div className="col-lg-6 col-12" >
                    <div className="container-lg mainPageCreateRoom" id="mainPageCreateRoomPadding">
                        <div className="d-flex flex-column">
                            <div className="mainPageCreateRoomHeaderOff d-flex flex-row justify-content-between align-items-center" onClick={(e)=>{toggleOpen("create")}} style={{cursor:"pointer"}}>
                                <span className="col-5">New Room</span>
                                <img className="col-2" src='./icons/drop-down.png' style={{width:"16px", height:"16px"}}
                                
                                ></img>
                            </div>
                            {createShow===true?
                            <div id="mainPageCreateRoomToggler" >
                                <div className="mainPageCreateRoomDesc">
                                    Fill the following fields to start a new room
                                </div>
                                <div className="mainPageCreateRoomForm"> 
                                    <form  id="mainPageCreateRoomForm">
                                        <div className="d-flex flex-column">
                                            <div className="d-flex flex-row justify-content-between align-items-center">
                                                <div className="col-8 mainPageCreateRoomFormName">
                                                    <input className="" autoComplete="off" name="name" placeholder="Room name" maxLength="20"></input>
                                                </div>
                                                <div className="col-3 mainPageCreateRoomFormTypeWrapper">
                                                    <select className="mainPageCreateRoomFormType" name="type" id="mainPageCreateRoomFormType" onClick={(e)=>{showPwd("create")}}>
                                                        <option value="public">Public</option>
                                                        <option value="private">Private</option>
                                                    </select>
                                                </div>
                                            </div>

                                        {prShowCreate===true?
                                        <div className="col-5 mt-3 mainPageCreateRoomFormPassword">
                                                <input className="" type="password" name="password" placeholder="Room Password">
                                                </input>
                                            </div>:""}

                                            <div className="col-12 mt-3">
                                                <textarea name="description" className="mainPageCreateRoomFormText" rows="3" maxLength="600" placeholder="Room Description"></textarea>
                                            </div>
                                            <div className="mt-3 col-6">
                                                <button className="mainPageCreateRoomFormSubmit" type="submit"
                                                onClick={async(e)=>{
                                                    e.preventDefault()
                                                    const formData = new FormData(document.getElementById('mainPageCreateRoomForm'));
                                                    await createRoom(formData)
                                                }}
                                                >
                                                    Create Room
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            :""}
                        </div>
                    </div>
                </div>
       
                <div className="mt-lg-0 mt-3 col-lg-6 col-12" >
                    <div className="container-lg mainPageCreateRoom" id="mainPageJoinRoomPadding">
                        <div className="d-flex flex-column">
                            <div className="mainPageCreateRoomHeader d-flex flex-row justify-content-between align-items-center" onClick={(e)=>{toggleOpen("join")}} style={{cursor:"pointer"}}>
                                <span className="col-5">Join a Room</span>
                                <img className="col-2" src='./icons/drop-down.png' style={{width:"16px", height:"16px"}} 
                                
                                ></img>
                            </div>
                            {joinShow===true?
                            <div id="mainPageJoinRoomToggler">
                                <div className="mainPageCreateRoomDesc">
                                    Enter the name of the room and password for private rooms.
                                </div>
                                <div className="mainPageCreateRoomForm"> 
                                    <form  id="mainPageJoinRoomForm">
                                        <div className="d-flex flex-column">
                                                <div className="d-flex flex-row justify-content-between align-items-center">
                                                    <div className="col-8 mainPageCreateRoomFormName">
                                                        <input className="" autoComplete="off" name="name" placeholder="Room Id"></input>
                                                    </div>
                                                    <div className="col-3 mainPageCreateRoomFormTypeWrapper">
                                                        <select className="mainPageCreateRoomFormType" name="type" id="mainPageJoinRoomFormType" onClick={(e)=>{showPwd("join")}}>
                                                            <option value="public">Public</option>
                                                            <option value="private">Private</option>
                                                        </select>
                                                    </div>
                                                </div>

                                            {prShowJoin===true?
                                            <div className="col-5 mt-3 mainPageCreateRoomFormPassword">
                                                    <input className="" type="password" name="password" placeholder="Room Password">
                                                    </input>
                                                </div>:""}
                                            <div className="mt-3 col-6">
                                                <button className="mainPageCreateRoomFormSubmit" type="submit"
                                                onClick={async(e)=>{
                                                    e.preventDefault()
                                                    const formData = new FormData(document.getElementById('mainPageJoinRoomForm'));
                                                    console.log(...formData)
                                                    // await createRoom(formData)
                                                }}
                                                >
                                                    Join Room
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            :""}
                        </div>
                    </div>
                </div>
            </div>

        </div>
        </React.Fragment>
    )
}

export default MainPage;