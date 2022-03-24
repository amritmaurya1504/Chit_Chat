import userReducers from "./userReducer";
import selectedChatsReducer from "./selectedChatsReducer"
import chatReducer from "./chatReducer"
import notificatioReducer from "./notificatioReducer"


import { combineReducers } from "redux";

const rootReducer = combineReducers({
   user : userReducers , selectedChats : selectedChatsReducer, chats : chatReducer, notification : notificatioReducer
})

export default rootReducer;