import React, { useEffect, useState } from 'react'
import { Box, Text } from "@chakra-ui/layout"
import { Tooltip } from "@chakra-ui/tooltip";
import { Button } from "@chakra-ui/button";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from '@chakra-ui/react'
import { useSelector } from 'react-redux';
import { useDisclosure } from "@chakra-ui/hooks";
import { MDBTypography } from 'mdb-react-ui-kit';
import EmailIcon from '@mui/icons-material/Email';
import { MDBBtn } from 'mdb-react-ui-kit';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useHistory } from 'react-router-dom';
import { logout, setSelectedChat, setChats, delSelectedChat, delChats, setNotification } from '../redux/actions';
import { useDispatch } from 'react-redux';
import { Input } from "@chakra-ui/input";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import ChatLoading from "./ChatLoading";
import UserListItem from "./UserListItem"
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import { Progress } from '@chakra-ui/react'
import { getSender } from '../config/ChatsLogic';
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';

import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Image,
} from '@chakra-ui/react'

import {
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
} from "@chakra-ui/menu";

const url = "http://localhost:8000";

const SideBar = () => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const {
        isOpen: isOpenDrawer,
        onOpen: onOpenDrawer,
        onClose: onCloseDrawer
    } = useDisclosure()
    const user = useSelector(state => state.user);
    const notification = useSelector(state => state.notification);
    const chats = useSelector(state => state.chats);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

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

    const accessChat = async (userId) => {

        console.log(userId);

        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: "Bearer " + JSON.parse(localStorage.getItem("jwt")),
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) dispatch(setChats([data, ...chats]));
            dispatch(setSelectedChat(data));
            console.log(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast.error('Failed to create chat!', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'colored'
            });
            setLoadingChat(false)
        }


    }

    return (
        <>
            <ToastContainer />
            <Box
                d="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"

            >
                <div className='d-flex justify-content-between align-items-center'>
                    <img className='m-2 ms-3 image-logo' src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1647776238/chit_orbtgh.png" alt="" />
                    <Tooltip label="Search Users to chat" hasArrow placement="bottom-end" bg='rgb(56, 90, 100)'>
                        <Button onClick={onOpenDrawer} variant="ghost">
                            <i className="fas fa-search"></i>
                            <Text d={{ base: "none", md: "flex" }} px={4}>
                                Search User
                            </Text>
                        </Button>
                    </Tooltip>

                </div>


                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon className='' fonstSize="2xl" w={7} h={7} m={1} />
                        </MenuButton>
                        <MenuList>
                            <small className='p-3'> {!notification.length && "No new messages."}</small>
                            <small>
                                {notification.map((notif) => (
                                    <MenuItem
                                        key={notif._id}
                                        onClick={() => {
                                            dispatch(setSelectedChat(notif.chat))
                                            dispatch(setNotification(notification.filter((n) => n !== notif)))
                                        }}
                                    >
                                        {notif.chat.isGroupChat
                                            ? `New Message in ${notif.chat.chatName}`
                                            : `New Message from ${getSender(user, notif.chat.users)}`}
                                    </MenuItem>
                                ))}
                            </small>
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton className='ms-2' as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user && user.name} src={user && user.pic} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={onOpen}><i class="fa fa-user me-3" aria-hidden="true"></i> Profile</MenuItem>
                            <MenuItem onClick={() => {
                                dispatch(logout())
                                localStorage.removeItem("userInfo");
                                localStorage.removeItem("jwt");
                                localStorage.removeItem("chats");
                                dispatch(delSelectedChat())
                                dispatch(delChats())
                                history.push("/loged-out");
                            }}><i class="fas fa-sign-out-alt me-3"></i>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            <Drawer
                isOpen={isOpenDrawer}
                placement='left'
                onClose={onCloseDrawer}

            >

                <DrawerOverlay />
                <DrawerContent>
                    {loadingChat && (<Progress size='xs' height='5px' colorScheme='yellow' isIndeterminate />)}
                    <DrawerHeader>
                        <div className='d-flex justify-content-start align-items-center'>
                            <img className='m-2 ms-3 image-logo2' src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1647776238/chit_orbtgh.png" alt="" />
                            <p className="fs-5 fw-normal">Search Users</p>
                        </div>
                    </DrawerHeader>

                    <DrawerBody>
                        <Box d="flex" pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                            />

                        </Box>
                        {loading ? <ChatLoading /> :
                            (
                                searchResult?.map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => accessChat(user._id)}
                                    />
                                ))
                            )
                        }


                    </DrawerBody>

                    {/* <DrawerFooter>
                        <Button variant='outline' mr={3} onClick={onCloseDrawer}>
                            Cancel
                        </Button>
                        <Button colorScheme='blue'>Save</Button>
                    </DrawerFooter> */}
                </DrawerContent>
            </Drawer>
            <Modal size="lg" isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent h="450px">
                    <ModalHeader className='d-flex justify-content-start align-items-center'>
                        {/* <div></div> */}
                        <img className='m-2 ms-3 image-logo2' src="https://res.cloudinary.com/amritrajmaurya/image/upload/v1647776238/chit_orbtgh.png" alt="" />
                        <h1 className="display-6">Profile</h1>
                        <small className='ms-2 fw-light'>Credentials</small>
                    </ModalHeader>
                    <ModalBody>

                        <Image
                            className='popup_img'
                            borderRadius="full"
                            boxSize="120px"
                            src={user.pic}
                            alt={user.name}
                        />
                        <MDBTypography note noteColor='success' className='mt-2 mb-2'>
                            <strong> <PersonOutlineIcon /> [Name] :</strong> {user.name}
                        </MDBTypography>
                        <MDBTypography note noteColor='warning' className='mb-2'>
                            <strong> <EmailIcon /> [Email] :</strong> {user.email}
                        </MDBTypography>
                        <MDBBtn color='danger' className='mt-3' onClick={onClose}>Close</MDBBtn>
                        <br />
                        <small className='footer'>Developed by © <a className='footerLink' href="https://amritraj.live" target="_blank">Amrit Raj</a> 2022.</small>
                    </ModalBody>

                </ModalContent>
            </Modal>
        </>
    )
}

export default SideBar