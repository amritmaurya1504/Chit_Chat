import React from 'react'
import { useSelector } from 'react-redux'
import { Box } from "@chakra-ui/layout"
import SingleChat from "./SingleChat"

const ChatBox = ({ fetchAgain, setFetchAgain }) => {

  const selectedChat = useSelector(state => state.selectedChats)

  return (
    <>
      <Box
        d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
        alignItems="center"
        flexDir="column"
        p={3}
        bg="white"
        w={{ base: "100%", md: "68%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </>
  )
}

export default ChatBox