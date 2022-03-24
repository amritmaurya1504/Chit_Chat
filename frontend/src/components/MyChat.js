import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { setChats, setSelectedChat } from '../redux/actions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Text, Stack } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/button";
import ChatLoading from "./ChatLoading"
import { getSender, getPicture } from '../config/ChatsLogic';
import { Avatar } from '@chakra-ui/react'
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import { Tooltip } from "@chakra-ui/tooltip";
import { useDisclosure } from "@chakra-ui/hooks";
import UserListItem from './UserListItem';
import UserBadgeItem from './UserBadgeItem';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  FormControl,
  Input,
  Spinner,
  Progress
} from '@chakra-ui/react'
import ChatList from './ChatList';


const url = "http://localhost:8000"


const MyChat = ({ fetchAgain, setFetchAgain }) => {

  useEffect(() => {
    fetchChats();
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    // eslint-disable-next-line
  }, [fetchAgain]);

  const [loggedUser, setLoggedUser] = useState()
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const selectedChat = useSelector(state => state.selectedChats);
  const chats = useSelector(state => state.chats);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingTwo, setLoadingTwo] = useState(false);


  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")),
        },
      };
      const { data } = await axios.get(`/api/user/all-users?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error('Failed to load search results!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
      setLoading(false)
    }
  }
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.error('Please fill all the fields!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
      return;
    }

    try {
      setLoadingTwo(true)
      const config = {
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")),
        },
      };
      const { data } = await axios.post(
        `/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast.success('New Group Chat created!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
      setFetchAgain(!fetchAgain)
      setLoadingTwo(false)
    } catch (error) {
      toast.error('Failed to create group!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
    }

  }
  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  }

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.error('User Already added!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  const fetchChats = async () => {
    // console.log(user._id);
    try {
      const config = {
        headers: {
          Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")),
        },
      };

      const { data } = await axios.get(`/api/chat`, config);
      dispatch(setChats(data));
      // console.log(data);
    } catch (error) {
      toast.error('Failed to load chats!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'colored'
      });
    }
  };



  return (
    <>
      <ToastContainer />
      <Modal isOpen={isOpen} onClose={onClose}>
        {loadingTwo && <Progress size='xs' isIndeterminate />}
        <ModalOverlay />
        <ModalContent h="650px">
          <ModalHeader className='d-flex justify-content-start align-items-center'>
            {/* <div></div> */}
            <img className='m-2 ms-3 image-logo2' src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1647776238/chit_orbtgh.png" alt="" />
            <h1 className="display-6">Create</h1>
            <small className='ms-2 fw-light'>Group Chat</small>
          </ModalHeader>
          <ModalBody d="flex" flexDir="column">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Amrit, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {/* selected user */}
            <Box w="100%" d="flex" flexWrap="wrap">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

            {/* render serched user */}
            {loading ? (
              // <ChatLoading />
              <div className='m-5'>
                <Stack direction='row' spacing={4}>
                  <Spinner size='lg' />
                </Stack>
              </div>
            ) : (
              searchResult
                ?.slice(0, 3)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}

          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Create
            </Button>

          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box
        d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir="column"
        alignItems="center"
        p={3}
        bg="white"
        w={{ base: "100%", md: "31%" }}
        borderRadius="lg"
        borderWidth="1px"
      >
        <Box
          pb={3}
          px={3}
          d="flex"
          w="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <div className='d-flex justify-content-start align-items-center'>
            <Avatar size="sm" cursor="pointer" name={user && user.name} src={user && user.pic} />
            <p style={{
              color: "rgb(255, 79, 90)",

            }} className="ms-3">
              <Tooltip label="Chat" hasArrow placement="bottom-end" bg='rgb(56, 90, 100)'>
                <ChatIcon style={
                  {
                    fontSize: "35px"
                  }
                } />
              </Tooltip>
            </p>
          </div>
          {/* rgb(56, 90, 100) */}
          <Tooltip label="New Group Chat" hasArrow placement="bottom-end" bg='rgb(56, 90, 100)'>
            <Button onClick={onOpen}
            >
              <AddIcon />
            </Button>
          </Tooltip>
        </Box>
        <Box
          d="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chats ? (
            <Stack overflowY="scroll">
              {chats.map((chat) => (
                <div className='d-flex justify-content-start align-items-center' key={chat._id}>
                  {!chat.isGroupChat ? (<Avatar size="sm" cursor="pointer" name={!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName} src={getPicture(user, chat.users)} />) :
                    <Avatar size="sm" cursor="pointer" name={chat.chatName} src="" />}
                  {/* <Avatar size="sm" cursor="pointer" name={!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName} src="" /> */}
                  <Box
                    onClick={() => dispatch(setSelectedChat(chat))}
                    cursor="pointer"
                    bg={selectedChat === chat ? "rgb(255, 79, 90)" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius="lg"
                    key={chat._id}
                  >
                    {/* ? getSender(user, chat.users) */}
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(user, chat.users)
                        : chat.chatName}
                    </Text>
                    {chat.latestMessage && (
                      <Text fontSize="xs">
                        <b>{chat.latestMessage.sender.name} : </b>
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content}
                      </Text>
                    )}
                  </Box>
                </div>
              ))}
            </Stack>
          ) : (
            <ChatLoading />
          )}

        </Box>
      </Box>
    </>
  )
}

export default MyChat

