import dotenv from "dotenv"
dotenv.config()

export default {
  TOKEN: process.env.TOKEN || "",
  MONGO_DB: process.env.MONGO_DB || "",
  CLIENT_ID: process.env.CLIENT_ID || "",
  Prefix: "z",
  OWNERS: ["922120042651451423"],
  SUPPORT_SERVER: "",
  Channels: {
    CommandLogs: "1041589448523128874",
    CommandErrorLogs: "1041589448523128874"
  },

  Activity: {
    name: "yoo",
    type: 3
  },
  Status: "dnd",
  
  Settings: {
    CommandLogs: true,
    CommandErrorLogs: true,
  }
}

