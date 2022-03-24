const selectedChatsReducer = (state = null, action) => {
    switch (action.type) {
        case "SET_SELECTED_CHATS":
            const { data } = action.payload;
            return data;
        case "DEL_SCHAT":
            return null;
        default: return state;
    }
}

export default selectedChatsReducer;