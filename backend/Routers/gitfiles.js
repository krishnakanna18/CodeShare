const express=require("express");
      router=express.Router();
      fetch=require("node-fetch");
      mongoose=require("mongoose");
      User=require("../Schemas/user");
      Room = require("../Schemas/room");

const { gitConfig , serverEndPoint, clientEndPoint} = require("../config");
//Recursively construct file structure
let parseFileStructure=(repo)=>{

    let root={children:{}}              //Root immediate children: 
    //Loop invariant -- when inserting x/y - x should already be in the object
    for(let child of repo){
        let path=child['path'].split('/');       //Heirachy of file names as array
        if(path.length===1){
            if(child['type']==='tree')
                root.children[path[0]]={children:{},...child}       //If 1st level children are not present add
            else
                root.children[path[0]]={...child}
        }
        else{
            let parent=root, i=0;
            for(i=0; i<path.length-1; i++)              //Find the immediate parent of the file
                parent=parent.children[path[i]];

             //Add file to the immediate parent
            if(child['type']==='tree')
                parent.children[path[i]]={children:{},...child}       
            else
                parent.children[path[i]]={...child}
        }
    }
    return root;
}

//Router to get additional permission for repository operations
router.get('/oauth/repos',async(req,res)=>{

    let {gitaccess}=req.session 
    if(gitaccess!==undefined && gitaccess!==null && gitaccess.fetched===true){      //If the resources are already fetched
        console.log("Present already")
        return res.redirect(`${clientEndPoint}/room/${req.session.roomId}?repo_access_granted=true`)
    }
    // else if(gitaccess===undefined || gitaccess===null){      //If query params not set from the server but directly
    //     console.log("Undefined incorrect request")
    //     return res.redirect(`${clientEndPoint}/room/${req.session.roomId}`)
    // }

    let roomId=req.query.roomId;
    req.session.roomId=roomId;
    return  res.redirect('https://github.com/login/oauth/authorize?client_id='+gitConfig.clientId+'&scope=public_repo&redirect_uri='+serverEndPoint+'/oauth/gitCallBack/getRepos');
})

//Router to get repo info
router.get('/repos',async(req,res)=>{

    let {gitaccess}=req.session             //Get user git auth details

   
    if(gitaccess.fetched===true){
        res.status(200).json({repos:gitaccess.repos})
        return
    }

    let resp=await fetch(`https://api.github.com/users/${gitaccess.login}/repos`)   //Get the repositories of the user
    resp=await resp.json()

    let repos=[]
    for(let repo of resp)
        repos.push({
            name:`${repo.name}`,
            html_url:`${repo.html_url}`,
            url:`${repo.url}`
        })

    req.session.gitaccess.fetched=true      //Repos are fetched from git
    req.session.gitaccess.repos=repos       //Set the fetched repos
    res.status(200).json({repos:repos})

})

//Get the recursive structure of a repository(names only)
//Only entry point after /repos
router.get('/repos/:repo/:roomId',async(req,res)=>{
    let {repo, roomId}=req.params
    let {gitaccess}=req.session 

    //Get recursive file structure
    repo=await fetch(`https://api.github.com/repos/${gitaccess.login}/${repo}/git/trees/master?recursive=1`)
    repo=await repo.json()
    repo=parseFileStructure(repo['tree'])       //Parse the file structure -- construct tree
    let newData=await Room.findByIdAndUpdate(roomId, {$set:{repoContent:repo}})
    res.status(200).json({repo:repo})
})


module.exports=router
