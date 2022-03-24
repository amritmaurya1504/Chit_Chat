import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { MDBBtn } from 'mdb-react-ui-kit';
import { Box, Text } from "@chakra-ui/layout"
import { ViewIcon } from "@chakra-ui/icons"
import { IconButton, Spinner, useToast, Tooltip, Button, Avatar } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import UserBadgeItem from './UserBadgeItem';
import UserListItem from "./UserListItem"
import axios from 'axios';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Picker from 'emoji-picker-react';
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
    Progress
} from '@chakra-ui/react'
import { delSelectedChat , setNotification } from "../redux/actions/index"
import { getSender, getPicture } from '../config/ChatsLogic';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDisclosure } from "@chakra-ui/hooks";
import { setSelectedChat } from '../redux/actions/index';
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client"
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
const url = "http://localhost:8000";
const ENDPOINT = "https://chitchat-web.herokuapp.com";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const dispatch = useDispatch()
    const selectedChat = useSelector(state => state.selectedChats)
    const notification = useSelector(state => state.notification);
    const user = useSelector(state => state.users)
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageLoading, setMessageloading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    useEffect(() => {
        const x = JSON.parse(localStorage.getItem("userInfo"))
        socket = io(ENDPOINT);
        socket.emit("setup", x);
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, [])

    const handleAlert = () => {
        toast.info('This feature is available soon!', {
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
    const handleRemove = async (user1) => {
        const loggedUser = JSON.parse(localStorage.getItem("userInfo"))

        if (selectedChat.groupAdmin._id !== loggedUser._id && user1._id !== loggedUser._id) {
            toast.warning("Only admins can remove someone!", {
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
            setLoading(true);
            const config = {
                headers: {
                    Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")),
                },
            };
            const { data } = await axios.put(
                `/api/chat/group-remove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );
            user1._id === loggedUser._id ? dispatch(delSelectedChat()) : dispatch(setSelectedChat(data));
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast.error("Error Occured!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
            setLoading(false);
        }
    }
    const handleAddUser = async (user1) => {
        // console.log(user1);
        const loggedUser = JSON.parse(localStorage.getItem("userInfo"))

        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast.warning("User Already in group!", {
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

        if (selectedChat.groupAdmin._id !== loggedUser._id) {
            toast.warning("Only admins can add someone!", {
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
            setLoading(true);
            const config = {
                headers: {
                    Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")),
                },
            };
            const { data } = await axios.put(
                `/api/chat/group-add`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            dispatch(setSelectedChat(data));
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast.error("Error Occured!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
            setLoading(false);
        }
    }
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
            setLoading(false);
            setSearchResult(data);

        } catch (error) {
            toast.error('Failed to load search result!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
            setLoading(false);
        }
    }
    const handleRename = async () => {
        if (!groupChatName) {
            toast.error('Please enter Group Name!', {
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

        try {
            setRenameLoading(true);

            const config = {
                headers: {
                    Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")),
                },
            };

            const { data } = await axios.put(`/api/chat/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatName,
            }, config);

            dispatch(setSelectedChat(data))
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
            setGroupChatName("")

        } catch (error) {
            toast.error('Error Occured!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
            setRenameLoading(false)
            setGroupChatName("")
        }


    }

    const handleLeave = (user) => {
        toast.info("For Now this feature is not available!", {
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
    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

    const sendMessage = async (e) => {
        if (e.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")),
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(`/api/message`, {
                    content: newMessage,
                    chatId: selectedChat._id
                }, config
                );
                // console.log(data);
                socket.emit("new message", data)
                setNewMessage("");
                setMessages([...messages, data]);
            } catch (error) {
                toast.error("Error Occured!", {
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
    }

    const fetchMessages = async (e) => {
        if (!selectedChat) return;

        setMessageloading(true)

        try {
            const config = {
                headers: {
                    Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")),
                },
            };
            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);


            setMessages(data);
            setMessageloading(false);
            socket.emit("join chat", selectedChat._id);


        } catch (error) {
            toast.error("Error Occured!", {
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

    useEffect(() => {
        fetchMessages();

        selectedChatCompare = selectedChat

    }, [selectedChat])


    useEffect(() => {
        socket.on('message recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                   dispatch(setNotification([newMessageRecieved, ...notification]));
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })

    return (
        <>
            <ToastContainer />
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        d="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            d={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => dispatch(delSelectedChat())}
                        />

                        {!selectedChat.isGroupChat ? (
                            <>
                                <div className='d-flex justify-content-start align-items-center'>

                                    <Avatar size="sm" cursor="pointer" src={getPicture(user, selectedChat.users)} />
                                    <p className="fw-bold fs-6 ms-2 font text-black-50">{getSender(user, selectedChat.users)}</p>
                                </div>
                                {
                                    <Tooltip label="View User Details" hasArrow placement="bottom-end" bg='rgb(56, 90, 100)'>
                                        <Button onClick={handleAlert}
                                        >
                                            <ViewIcon />
                                        </Button>
                                    </Tooltip>
                                }
                            </>

                        ) : (
                            <>
                                <div className='d-flex flex-column justify-content-start align-items-start'>
                                    <div className='d-flex justify-content-start align-items-center'>
                                        <Avatar size="sm" cursor="pointer" name={selectedChat.chatName} />
                                        <p className="fw-bold fs-6 ms-2 font text-black-50">{selectedChat.chatName}</p>
                                    </div>
                                    <div className='grpUser'>
                                        {selectedChat.users.map(name => {
                                            return (
                                                <small> {name.name},</small>
                                            )
                                        })}

                                    </div>
                                </div>
                                {
                                    <Tooltip label="View Group Details" hasArrow placement="bottom-end" bg='rgb(56, 90, 100)'>
                                        <Button onClick={onOpen}
                                        >
                                            <ViewIcon />
                                        </Button>
                                    </Tooltip>
                                }{
                                    <Modal isOpen={isOpen} onClose={onClose}>
                                        <ModalOverlay />
                                        <ModalContent h="650px">
                                            <ModalHeader className='d-flex justify-content-start align-items-center'>
                                                <img className='m-2 ms-3 image-logo2' src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1647776238/chit_orbtgh.png" alt="" />
                                                <h1 className="display-6">{selectedChat.chatName}</h1>
                                                <small className='ms-2 fw-light'>Credentials</small>
                                            </ModalHeader>

                                            <ModalBody>
                                                <Box>
                                                    {selectedChat.users.map(u => {
                                                        return (
                                                            <UserBadgeItem
                                                                key={u._id}
                                                                user={u}
                                                                handleFunction={() => handleRemove(u)}
                                                            />
                                                        )
                                                    })}
                                                </Box>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Chat Name"
                                                        mb={3}
                                                        onChange={(e) => setGroupChatName(e.target.value)}
                                                    />
                                                    <MDBBtn color='primary' onClick={handleRename}>{renameloading ? <Spinner /> : "Update"}</MDBBtn>
                                                </FormControl>
                                                <FormControl className='mt-3'>
                                                    <Input
                                                        placeholder="Add Users eg: John, Amrit, Jane"
                                                        mb={1}
                                                        onChange={(e) => handleSearch(e.target.value)}
                                                    />
                                                </FormControl>
                                                {loading ? (
                                                    <Spinner size="lg" />
                                                ) : (
                                                    searchResult?.slice(0, 3).map((user) => (
                                                        <UserListItem
                                                            key={user._id}
                                                            user={user}
                                                            handleFunction={() => handleAddUser(user)}
                                                        />
                                                    ))
                                                )}
                                            </ModalBody>

                                            <ModalFooter>
                                                <MDBBtn color='danger' onClick={() => handleLeave(user)}>Leave Group</MDBBtn>

                                            </ModalFooter>
                                        </ModalContent>
                                    </Modal>
                                }
                            </>
                        )}
                    </Text>

                    <Box
                        d="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {/* {Messagese Here}  */}
                        {messageLoading ? (
                            <Spinner
                                thickness='8px'
                                speed='0.65s'
                                emptyColor='rgb(56, 90, 100)'
                                color='rgb(255, 79, 90)'
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />

                        ) : (
                            <div>
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                        <FormControl
                            onKeyDown={sendMessage}
                            id="first-name"
                            isRequired
                            mt={3}
                        >
                            {istyping ? (
                                <div>
                                    <Lottie
                                        options={defaultOptions}
                                        // height={50}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    />

                                </div>
                            ) : (
                                <></>
                            )}
                            <div className='d-flex justify-content-start align-items-center'>
                                {/* {showPicker && <Picker className="picker"
                                    onEmojiClick={onEmojiClick}
                                    pickerStyle={{ width: '50%' }}
                                />} */}
                                <EmojiEmotionsIcon style={{ fontSize: "35px", color: "rgb(56, 90, 100)", cursor: "pointer" }} className="me-2" />
                                <Input
                                    variant="filled"
                                    bg="#fff"
                                    placeholder="Enter a message.."
                                    value={newMessage}
                                    onChange={typingHandler}
                                />

                            </div>
                        </FormControl>
                    </Box>
                </>
            ) : (
                // to get socket.io on same page
                <Box d="flex" alignItems="center" justifyContent="center" flexDir="column" h="100%">
                    <img className='chat_img' src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1647942292/Chat_ur83dh.jpg" alt="" />
                    <p className="fs-5 fw-bold">Welcome to ChitChat App</p>
                    <small>
                        Click on a user to start chatting
                    </small>
                    <MDBBtn color='danger' className='mt-3'>Get Started</MDBBtn>

                </Box>
            )}

        </>
    )
}

export default SingleChat