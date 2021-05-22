import React from 'react';
import AceEditor from "react-ace";
import { useState, useEffect } from 'react'

import {
  BrowserRouter as Router,
  Link,
  Switch,
  Route
} from 'react-router-dom'

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-javascript";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/ext-language_tools"
import io from 'socket.io-client'



const App=()=>{

  return (
    <Router>
      <div className="mt-5 d-flex flex-lg-row flex-column">
          <div className="col-lg-2 col-12 mt-5">
              <div className="d-flex flex-lg-column flex-row justify-content-md-center align-items-center">
                <Link to='/room/1' className="">
                  <button className="w-100 btn btn-dark m-5 ">
                    Room 1
                  </button>
                </Link>
                <Link to='/room/2' className="">
                  <button className="w-100 btn btn-dark m-5" >
                    Room 2
                  </button>
                </Link>
                <Link to='/room/3' className="">
                  <button className="w-100 btn btn-dark m-5" >
                    Room 3
                  </button>
                </Link>
              </div>
          </div>
          <Switch>
          {/* {roomNo!==0?
          <Editor room={roomNo} socket={io(endPoint)}></Editor>
          :""} */}
            <Route exact path='/room/:id' component={(props)=><Editor {...props} key={props.match.id}></Editor>}></Route>
          </Switch>
      </div>
    </Router>
  )
}


const Editor=({location,match})=>{


  let [editorText,setEditorText]=useState("")
  let endPt=""
  if(window.location.host==="localhost:3000") endPt="http://localhost:9000"
  else if(window.location.host==="192.168.0.13:3000") endPt="http://192.168.0.13:9000"

  // endPt="https://floating-tor-72233.herokuapp.com"
//  console.log(endPt)
  let [endPoint]=useState(endPt)
  let [socket]=useState(io(endPoint))
  let [room,setRoom]=useState(0)
  let [isSharing,setSharing]=useState(false)
  let [isScreenCap,setScreenCap]=useState(false)


  let theme=""
  if(room===1) theme="monokai" 
  else if(room===2) theme="xcode"
  else if(room===3) theme="solarized_dark"


  let screenShare=async()=>{
    let captureStream = null;
    try {
      captureStream = await navigator.mediaDevices.getDisplayMedia({video: {
        cursor: "always"
      },
      audio: false});
    } catch(err) {
      console.error("Error: " + err);
    }
    return captureStream;
  }

  let displayVideo=async()=>{

    let vid=await screenShare()
    setSharing(true)
    // socket.emit('')
    // let videoElem=document.getElementById("videoElementSrc")
    // videoElem.srcObject =vid
    // vid.ondatavailable=(e)=>{
    //   socket.emit('shareVideo',{
    //     room:`${room}`,
    //     video:e.data
    //   })
    // }
  }

  useEffect(()=>{
   
    socket.on('resetEditor',val=>{
        setEditorText(val.value)
    })

    socket.on('setVideo',async(video)=>{

      if(isSharing===true){
        await stopVideo()
      }
      setScreenCap(true)
      let videoElem=document.getElementById("videoElementSrc")
      videoElem.srcObject =video

    })

    return ()=>{
      socket.emit('closeConnection',{room:`${room}`})
    }
// eslint-disable-next-line
  },[])


  useEffect(()=>{
    socket.emit('closeConnection',{room:`${room}`})
    setRoom(match.params.id)
    socket.emit('joinRoom',{room:`${match.params.id}`})
    socket.on('initialiseEditor',val=>{
      setEditorText(val.value)
    })
  // eslint-disable-next-line
  },[match.params.id])


      
  let setEditor=(value)=>{
      setEditorText(value)
      socket.emit('setEditor',{value:value,room:`${room}`})
  }


  let stopVideo=async()=>{
    let videoElem=document.getElementById("videoElementSrc")
    let tracks = videoElem.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    videoElem.srcObject = null;
    setSharing(false)
  }

  return(
    <div className="col-lg-10 col-12 mt-5 d-flex flex-lg-row flex-column">
        <div className="col-lg-6 justify-content-center row ">

          <AceEditor
            name={`trialEditor:${room}`}
            theme={theme}
            mode="javascript"
            fontSize={20}
            showGutter={true}
            value={`${editorText}`}
            highlightActiveLine={true}
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
            }}
            onInput={(e)=>{console.log(e)}}
            debounceChangePeriod={500}
            width={'800px'}
            onChange={(value,e)=>{setEditor(value)} }
          >
          </AceEditor>

          {isSharing===false?
                <button className="btn btn-dark mt-5 w-50 mb-5" onClick={async()=>{await displayVideo()}}>Share your screen</button>
                :
                <button className="btn btn-dark mt-5 w-50 mb-5" onClick={async()=>{await stopVideo()}}>Stop sharing screen</button>
                }

  
        </div>
        <div className="col-lg-6 justify-content-center row" style={{maxWidth:"100%"}} >
          <video id="videoElementSrc" autoPlay>

          </video>
        </div>
    </div>

       

  )


}

export default App;