import { createContext} from 'react';
import serverEndpoint from '../config';
import { io } from "socket.io-client";
let setSocket=()=>{
    //Setting the socket
}
export default createContext({socket:io(`${serverEndpoint}`), setSocket});
