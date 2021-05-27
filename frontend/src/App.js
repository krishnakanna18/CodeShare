import React from 'react';
import { useState, useEffect } from 'react';
import serverEndpoint from './config'
import MainPage from './components/mainPage'
import Login from './components/login'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

const App=()=>{

  let [user,setUser]=useState({});
  let [loggedin,setLoggedin]=useState(false);
  let [loading,setLoading]=useState(true);    //Loading Screen wait until user info fetched from server

  useEffect(()=>{

    async function getInfo(){
      let loginfo=await fetch(`${serverEndpoint}/oauth/isloggedin`,{
        method:"GET",
        credentials:"include"
      })

      loginfo=await loginfo.json()
      if(loginfo.loggedin===true){

        console.log(loginfo)
        setUser(loginfo.user)
        setLoggedin(true);
        setLoading(false);
      }
      else{
        console.log("Destoryed",loginfo);
        setLoading(false);
      }
    }
    getInfo()
  // eslint-disable-next-line
  },[])


  let logOutUser=async()=>{

    fetch(`${serverEndpoint}/oauth/logout`,{
      method:"post",
      credentials:"include"
    })
    .then(resp=>{
      if(resp.status===200){
        setUser({})
        setLoggedin(false)
      }
    })
  }

  const renderHome=()=>{      //Decides which component to run

    console.log(loading)
    if(loading===true)
      return <div></div>

    if(loggedin===false){
      return <Login ></Login>
    }
    else{
      return  <MainPage user={{...user}} loggedin={loggedin} logOutUser={logOutUser}></MainPage>
    }
  }

  return (  
    <React.Fragment>
      <Router>
        <Switch>
            <Route exact path='/'>
              {renderHome()}
            </Route> 
            <Route exact path='/room/:id' component={()=>{
              return <div>Room</div>
            }}>
              
            </Route>
        </Switch>
      </Router>
      
    </React.Fragment>
);
}

export default App;