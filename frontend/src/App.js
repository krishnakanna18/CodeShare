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
      <div className="container mt-5 d-flex flex-lg-row flex-column">
          <div className="col-lg-6 col-12 mt-5">
              <div className="d-flex flex-column container justify-content-md-center align-items-center">
                <Link to='/room/1'>
                  <button className="w-100 btn btn-dark m-5">
                    Room 1
                  </button>
                </Link>
                <Link to='/room/2'>
                  <button className="w-100 btn btn-dark m-5" >
                    Room 2
                  </button>
                </Link>
                <Link to='/room/3'>
                  <button className="w-100 btn btn-dark m-5" >
                    Room 3
                  </button>
                </Link>
              </div>
          </div>
          <div className="col-lg-6 col-12 mt-5">
              <Switch>
              {/* {roomNo!==0?
              <Editor room={roomNo} socket={io(endPoint)}></Editor>
              :""} */}
                <Route exact path='/room/:id' component={(props)=><Editor {...props} key={props.match.id}></Editor>}></Route>
              </Switch>
          </div>
      </div>
    </Router>
  )
}


const Editor=({location,match})=>{


  let [editorText,setEditorText]=useState("")
  let endPt=""
  if(window.location.host==="localhost:3000") endPt="http://localhost:9000"
  else if(window.location.host==="192.168.0.13:3000") endPt="http://192.168.0.13:9000"

  endPt="https://floating-tor-72233.herokuapp.com"
 
  let [endPoint]=useState(endPt)
  let [socket]=useState(io(endPoint))
  let [room,setRoom]=useState(0)


  let theme=""
  if(room===1) theme="monokai" 
  else if(room===2) theme="xcode"
  else if(room===3) theme="solarized_dark"

  useEffect(()=>{
   
    socket.on('resetEditor',val=>{
        setEditorText(val.value)
    })

    return ()=>{
      socket.emit('closeConnection',{room:`${room}`})
    }
// eslint-disable-next-line
  },[])


  useEffect(()=>{
    socket.emit('closeConnection',{room:`${room}`})
    console.log("Fired match change->",match.params.id)
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

  return(
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
            debounceChangePeriod={500}
            width={'800px'}
            onChange={(value,e)=>{setEditor(value)} }
          >
          </AceEditor>
  )


}

export default App;