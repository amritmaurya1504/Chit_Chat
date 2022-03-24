import React from 'react'
import { getSender } from '../config/ChatsLogic'

const ChatList = ({ chats, loggedUser }) => {
    return (
        <>
            {
                chats.map(chat => {
                    return (
                        <div>
                            {chat.chatName}
                        </div>
                       
                )
            })
         }
        </>
    )
}

export default ChatList