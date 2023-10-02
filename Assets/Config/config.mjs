import dotenv from "dotenv"
dotenv.config()

export default {
  TOKEN: process.env.TOKEN || "", // Bot token 
  MONGO_DB: process.env.MONGO_DB || "", // MongoDB (not required)
  CLIENT_ID: process.env.CLIENT_ID || "", // Bot ID
  Prefix: "z", // Bot Prefix 
  OWNERS: ["922120042651451423"], 
  SUPPORT_SERVER: "", // soon
  Channels: {
    CommandLogs: "1041589448523128874", // channel id where you want to Command Logs
    CommandErrorLogs: "1041589448523128874" // Channel Id
  },

  Activity: {
    name: "yoo", // status
    type: 3 // eg 1, 2, 3, 4
  },
  Status: "dnd", // dnd, online, idle, invisivble 
  
  Settings: { 
    CommandLogs: true, 
    CommandErrorLogs: true,
  }
}