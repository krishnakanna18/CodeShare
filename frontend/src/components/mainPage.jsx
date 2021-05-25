import React from 'react';
import { useState, useEffect } from 'react';
import serverEndpoint from '../config'
import '../css/mainPage.css'

const MainPage=(props)=>{

    useEffect(()=>{
        console.log(props)
    },[props])

    return (
        <React.Fragment>
        <div>
            <div className="container-lg homePageTopBar mt-2 d-flex flex-row align-items-center justify-content-around">

                <div className="container-lg col-sm-3">
                    <div className="d-flex flex-row align-items-center homePageTopBarLogoWrapper">
                        <img src="icons/code.svg" className="homePageTopBarLogo"  alt="" />
                        <h3  className="homePageTopBarName" style={{color:"#FD4D4D"}}>Meet2Code</h3>
                    </div>
                </div>

                <div className="container-lg col-sm-6 col-12">
                    <div className=" d-flex flex-row align-items-center justify-content-center homePageSearchBar">
                        <div className="col-2">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="#5d7290" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#sm-solid-search_svg__clip0)" fill-rule="evenodd" clip-rule="evenodd"><path d="M7.212 1.803a5.409 5.409 0 100 10.818 5.409 5.409 0 000-10.818zM0 7.212a7.212 7.212 0 1114.424 0A7.212 7.212 0 010 7.212z"></path><path d="M11.03 11.03a.901.901 0 011.275 0l3.43 3.432a.902.902 0 01-1.274 1.275l-3.431-3.431a.901.901 0 010-1.275z"></path></g><defs><clipPath id="sm-solid-search_svg__clip0"><path d="M0 0h16v16H0z"></path></clipPath></defs></svg>
                        </div>
                        <div className="col-10">
                            <input placeholder="Search for public rooms or users" className="homePageSearchBarInput" style={{outline:"none"}}>
                            </input>
                        </div>
                    </div>
                </div>

                <div className="col-sm-3 container-lg">
                    
                    <div className="col-sm-3 col-0">
                        <img src={`${props.user.avatar}`} className="homePageUserDP"></img>
                    </div>
                </div>
               
            </div>
        </div>
        </React.Fragment>
    )
}

export default MainPage;