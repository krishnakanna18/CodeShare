import React from 'react';
import { useState, useEffect } from 'react';
import serverEndpoint from './config'
import MainPage from './components/mainPage'
import Login from './components/login'
import Room from './components/room'
import UserContext from './contextProvider/userContext'
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

const App=(props)=>{

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
        setUser(loginfo.user)
        setLoggedin(true);
        setLoading(false);
      }
      else{
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

  const renderHome=(props)=>{      //Decides which component to run

    if(loading===true)
      return <div></div>

    if(loggedin===false){
      return <Login {...props}></Login>
    }
    else{
      return  <MainPage {...props}></MainPage>
    }
  }

  return (  
    <React.Fragment>
      <Router>
        {loading===false?
        <Switch>
          <UserContext.Provider value={{ user, loggedin , setUser, logOutUser}}>
              <Route exact path='/'>
                {renderHome(props)}
              </Route> 
              <Route exact path='/room/:id' component={(props)=>{
                       return <Room {...props} ></Room>
                  }
              }>
              </Route>
          </UserContext.Provider>
        </Switch>
        :""}
      </Router>
      
    </React.Fragment>
);
}

export default App;