export const setUserDetails = (data) => {
    return {
        type: "SET_USER",
        payload: {
            data: data
        }
    }
}

export const logout = () => {
    return {
        type: "LOGOUT_USER",
    }
}

export const setSelectedChat = (data) => {
    return {
        type : "SET_SELECTED_CHATS",
        payload : {
            data : data
        }
    }
}
export const delSelectedChat = () => {
    return {
        type : "DEL_SCHAT",
    }
}
export const setChats = (data) => {
    return {
        type : "SET_CHATS",
        payload : {
            data : data
        }
    }
}
export const delChats = () => {
    return {
        type : "DEL_CHAT",
    }
}

export const setNotification = (data) => {
    return {
        type : "SET_NOTIFICATION",
        payload : {
            data : data
        }
    }
}