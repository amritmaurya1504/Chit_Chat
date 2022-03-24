const chatReducer = (state = null, action) => {
    switch (action.type) {
        case "SET_CHATS":
            const { data } = action.payload;
            return data;
        case "DEL_CHAT":
            return null;
        default: return state;
    }
}

export default chatReducer;