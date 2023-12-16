'use client'
import React from 'react'
import classes from "./page.module.css";
import { useSocket } from '../context/SocketProvider';
export default function Page() {
  const {sendMessage,messages}=useSocket();
  const [message,setMessage]=React.useState('');
  return (
    <>
     <div> 
      <h1>All Messages will appear here</h1>
     </div>
     <div>
      <input onChange={(e)=>setMessage(e.target.value)} className={classes['chat-input']} type="text" placeholder='Message...' />
      <button onClick={()=>sendMessage(message)} className={classes['button']}>Send</button>
     </div>
     <div>
      {messages.map((e)=>(
        <li>{e}</li>
      ))}
     </div>
    </>
  )
}
