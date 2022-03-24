import React from 'react'
import ScrollableFeed from 'react-scrollable-feed'
import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from "../config/ChatsLogic"

import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import { useSelector } from "react-redux"

const ScrollableChat = ({ messages }) => {
    const user = useSelector(state => state.user)
    return (
        <div>
            <ScrollableFeed>
                {messages && messages.map((m, i) => {
                    return (
                        <div style={{ display: "flex" }} key={m._id}>
                            {(isSameSender(messages, m, i) ||
                                isLastMessage(messages, i)) && (
                                    <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                                        <Avatar
                                            mt="7px"
                                            mr={1}
                                            size="sm"
                                            cursor="pointer"
                                            name={m.sender.name}
                                            src={m.sender.pic}
                                        />
                                    </Tooltip>
                                )}
                            <span
                                style={{
                                    backgroundColor: `${m.sender._id === user._id ? "#fff" : "rgb(255, 79, 90)"
                                        }`,
                                    color: `${m.sender._id === user._id ? "#000" : "#fff"
                                        }`,
                                    marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                    marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                                    borderRadius: "20px",
                                    padding: "5px 15px",
                                    maxWidth: "75%",
                                    fontSize : "14px"
                                }}
                            >
                                {m.content}
                            </span>
                        </div>
                    )
                })}
            </ScrollableFeed>
        </div>
    )
}

export default ScrollableChat