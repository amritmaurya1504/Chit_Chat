import React, { useEffect, useState } from 'react'
// import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom';
import SideBar from "../components/SideBar"
import MyChat from "../components/MyChat"
import ChatBox from "../components/ChatBox"
import { Box } from "@chakra-ui/layout"
import { useSelector } from "react-redux";

const ChatPage = () => {

  const [fetchAgain, setFetchAgain] = useState(false)
  const user = useSelector(state => state.user);
  const history = useHistory()
  useEffect(() => {
    document.title = "ChitChat | Home"
    const usersData = JSON.parse(localStorage.getItem("userInfo"))
    if (!usersData) {
      history.push("/login");
    }
    
  }, [])

  return (
    <div style={{
      width: "100%",
      backgroundColor: "#ededed"
    }}>
      {user && <SideBar />}

      <Box
        d="flex" justifyContent="space-between" w="100%" h="91.3vh" p="10px"
      >
        {user && <MyChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </Box>

    </div>
  )
}

export default ChatPage