import React,{ useEffect, useState} from 'react';
import '../css/codeEditor.css'
// import {useState} from 'react';
import serverEndPoint from '../config'
// import * as Y from 'yjs'
// import { WebsocketProvider } from 'y-websocket'

const CodeEditor=(props)=>{

    let [repo, setRepo]=useState("");                       //Repository URL
    let [isSet, setRepoSet]=useState(false);                //Is the repository for the room set.
    let {user,room,socket}=props                            //Props from the parent component
    let [repoChoice, setRepoChoice]=useState('import');     //Import of create a new repository -- 'import' import from github; 'create' create a new repo
    let {repo_access_granted}=props                         //
    let [isGitAuth, setGitAuth]=useState(false);            //User's permission to access their git files
    let [repoListShow, setListShow]=useState(false);        //Toggle button to show repo list
    let [repoList,setRepoList]=useState([]);


    useEffect(()=>{
        if(repo_access_granted==='true'){        //If the redirected resouce returns with granted request
            setGitAuth(true)
            let getList=async()=>{
                let repoList=await getReposInfo()
            }
            getList()
        }

    },[repo_access_granted])


    let getGitRepos=()=>{
        
        window.open(`${serverEndPoint}/git/oauth/repos?roomId=${props.roomId}`,`_self`);       //Send oauth request to server
    }

    //Get repository list from the server
    let getReposInfo=async()=>{
        let repos=await fetch(`${serverEndPoint}/git/repos`,{
            method:"get",
            credentials:"include"
        });
        repos=await repos.json()
        setRepoList(repos.repos)
    }

    //Get the repository contents from the server
    let getRepoContent=async()=>{

    }

    //Get the list of repos from the user's github and display for selection
    let repoDisplayFromGit=()=>{
        if(isGitAuth===false){
            return(
                <div className="container-lg" onClick={(e)=>{getGitRepos(e)}} style={{cursor:"pointer"}}>
                    <div className="d-flex flex-row  codeEditorRepoImport">
                        <div className="col-1">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className=""><g clipPath="url(#clip0)"><path fillRule="evenodd" clipRule="evenodd" d="M8 0C12.4184 0 16 3.67194 16 8.20234C16 11.8255 13.7104 14.8992 10.5336 15.9848C10.128 16.0656 9.984 15.8094 9.984 15.591C9.984 15.3206 9.9936 14.4374 9.9936 13.3398C9.9936 12.575 9.7376 12.0759 9.4504 11.8215C11.232 11.6183 13.104 10.9246 13.104 7.77422C13.104 6.87822 12.7936 6.14706 12.28 5.57266C12.3632 5.36546 12.6376 4.53116 12.2016 3.40156C12.2016 3.40156 11.5312 3.18178 10.004 4.24258C9.35149 4.0607 8.67738 3.96769 8 3.96641C7.32314 3.96763 6.64956 4.06064 5.9976 4.24258C4.4688 3.18178 3.7968 3.40156 3.7968 3.40156C3.3624 4.53116 3.6368 5.36546 3.7192 5.57266C3.208 6.14706 2.8952 6.87822 2.8952 7.77422C2.8952 10.9166 4.7632 11.6209 6.54 11.8281C6.3112 12.0329 6.104 12.3942 6.032 12.9246C5.576 13.1342 4.4176 13.497 3.704 12.2434C3.704 12.2434 3.2808 11.4553 2.4776 11.3977C2.4776 11.3977 1.6976 11.3873 2.4232 11.8961C2.4232 11.8961 2.9472 12.1481 3.3112 13.0961C3.3112 13.0961 3.7808 14.5601 6.0064 14.0641C6.0104 14.7497 6.0176 15.3958 6.0176 15.591C6.0176 15.8078 5.8704 16.0615 5.4712 15.9855C2.292 14.9015 0 11.8263 0 8.20234C0 3.67194 3.5824 0 8 0"></path></g><defs><clipPath id="clip0"><rect width="16" height="16"></rect></clipPath></defs></svg>
                        </div>
                        <div className="col-11">
                            <span className="">Import repo from Github</span>
                        </div>
                    </div>
                </div>
            )
        }
        else if(isGitAuth===true){
            return(
                <div className="container-lg" onClick={(e)=>{}} style={{cursor:"pointer"}} >

                    <div className="codeEditorRepoListView d-flex flex-column">
                        <div className="col d-flex flex-row pl-2 pr-2 justify-content-between" onClick={()=>{setListShow(!repoListShow)}}>
                                <span className="">Choose a repo from the list</span>
                                <img  src='/icons/drop-down-arrow.png' style={{width:"16px", height:"16px"}} alt=""></img>
                        </div>
                        {repoListShow===true?
                            <div className="mt-3 col d-flex flex-column">
                                <div  style={{overflowY:"scroll",height:"150px"}} >
                                {repoList.map((repo,id)=>{
                                    return(
                                        <div className="col mt-1 mb-1 pt-1" style={{borderTop:"1px solid #0b0e11", textAlign:"center"}}  onClick={(e)=>{getRepoContent(id)}}>
                                            {repo.name}
                                        </div>
                                    )
                                })}
                                </div>
                            </div>
                        :""}
                    </div>
                </div>
            )
        }
    }
    let repoImport=()=>{
        let choiceStyle={color:"black",backgroundColor:"#242c37"},defStyle={color:"black", backgroundColor:"#242c37"}       //Default button styles
        if(repoChoice==='import')
            choiceStyle={backgroundColor:"black", color:"#242c37"}
        else
            defStyle={backgroundColor:"black", color:"#242c37"}
       
        if(isSet===false && user._id===room['host'])
            return(     
                    <div className="codeEditorRepoSetWrapper">
                        <div className="codeEditorRepoSetDisplay">
                            <h5 style={{textAlign:"center", color:"#fd4d4d"}}>Select a repo or create one from github</h5>
                            <div className="mt-5 pb-3 codeEditorRepoChoice d-flex flex-row  justify-items-between">
                                <div className="col-4 pr-2 codeEditorRepoChoiceBtn">
                                    <div className="d-flex flex-column justify-content-center">
                                        <button className="col codeEditorRepoChoiceBtnInd" style={choiceStyle}>
                                            Import repo
                                        </button>
                                        <button className="mt-3 col codeEditorRepoChoiceBtnInd" style={defStyle}>
                                            Create repo
                                        </button>
                                    </div>
                                </div>
                                <div className="col-8" >
                                    {repoChoice==="import"?
                                        <div >
                                            {repoDisplayFromGit()}
                                        </div>
                                        :
                                        <div>
                                            
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
            )
        else return <div></div>
    }
    return (
            <React.Fragment>
                {repoImport()}
            </React.Fragment>
    )
}
export default CodeEditor;