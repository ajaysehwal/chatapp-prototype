import { Kafka, Producer} from "kafkajs";
import path from "path";
import fs from "fs";
import prismaClient from "./prisma";
const kafka=new Kafka({
    brokers:['kafka-f7014c2-ajaysehwal000-0acb.a.aivencloud.com:11616'],
    ssl:{
        ca:[fs.readFileSync(path.resolve('./ca.pem'),'utf-8')]
    },
    sasl:{ 
        username:'avnadmin',
        password:'AVNS_XP9P7CEeJirruSNr7hN',
        mechanism:"plain"
    }
})
let producer:null | Producer=null;
export async function createProducer(){
    if(producer)return producer
    const _producer=kafka.producer();
    await _producer.connect();
    producer=_producer;
    return producer;
}
export  async function produceMesasage(message:string){
 const producer=await createProducer();
  await  producer.send({
        messages:[{key:`message-${Date.now()}`,value:message}],
        topic:"MESSAGES",
    })
    return true
}
export async function startMessageConsumer(){
    console.log("Consumer is running.....");
    const consumer=kafka.consumer({
        groupId:"default",
    })
    await consumer.connect();
    await consumer.subscribe({topic:"MESSAGES",fromBeginning:true});
    await consumer.run({
        autoCommit:true,
        eachMessage:async ({message,pause})=>{
            console.log(`New Message Recvied`);
            if(!message.value) return;
            try{
                await prismaClient.message.create({
                    data:{
                        text:message.value?.toString(),
                    }
                })
            }catch(err){
                console.log("Something is wrong");
                pause();
                setTimeout(()=>{
                       consumer.resume([{topic:"MESSAGES"}])
                },60*1000)
            }
           
        }
    })
}
export default kafka;