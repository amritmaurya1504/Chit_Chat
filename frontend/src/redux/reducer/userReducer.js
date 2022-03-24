const userReducers = (state = null, action) => {
    switch (action.type) {
        case "SET_USER":
            const { data } = action.payload;
            return data;
        case "LOGOUT_USER":
            return null;
        default: return state;
    }
}

export default userReducers;