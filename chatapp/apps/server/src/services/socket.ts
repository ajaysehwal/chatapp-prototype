import { Server } from "socket.io";
import Redis from "ioredis";
import prismaClient from "./prisma";
import {produceMesasage} from "./kafka"
const pub=new Redis(
    {
        host:'redis-1d9a097b-ajaysehwal000-0acb.a.aivencloud.com',
        port:11603,
        username:'default',
        password:'AVNS_WVikzbhthlR8HZoS4pe'

    }
) //Publisher;
const sub=new Redis(
    {
        host:'redis-1d9a097b-ajaysehwal000-0acb.a.aivencloud.com',
        port:11603,
        username:'default',
        password:'AVNS_WVikzbhthlR8HZoS4pe'

    }
) //Subscribe;
class SocketService{
    private _io: Server;
    constructor(){
     console.log("Init Socket Services...");
     this._io=new Server({
        cors:{
            allowedHeaders:['*'],
            origin:'*',
        }
     }); 
     sub.subscribe("MESSAGES")
    }
    public initListeners(){
        const io=this.io;
        console.log("Init Socket Listeners...");
        io.on('connect',(socket)=>{
            console.log(`New Socket Connected`,socket.id)
        socket.on('event:message',async({message}:{message:string})=>{
            console.log("New Message Rec.",message);
            //publish this message to redis
            await pub.publish('MESSAGES',JSON.stringify({message}));

        })
    })
    sub.on('message',async(channel,message)=>{
        if(channel=="MESSAGES"){
            io.emit('message',message)
            // await  prismaClient.message.create({
            //     data:{
            //         text:message,
            //     }
            // })
           await produceMesasage(message)
           console.log("Message Produced to Kafka Broker")
        }
    })
    }
    get io(){
        return this._io;
    }
}

export default SocketService;