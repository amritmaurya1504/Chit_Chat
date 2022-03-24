const notificatioReducer = (state = [], action) => {
    switch (action.type) {
        case "SET_NOTIFICATION":
            const { data } = action.payload;
            return data;
        default: return state;
    }
}

export default notificatioReducer;