export const getSender = (loggedUser, users) => {
    // console.log(users[0]._id);
    // console.log(users[0].name);
    const x = JSON.parse(localStorage.getItem("userInfo"))
    // console.log(x._id);
    // console.log(x.name);
    if (users[0]._id === x._id) {
        const name = users[1].name;
        return name;
    } else {
        const name2 = users[0].name;
        return name2
    }

    // return (users[0]._id === loggedUser[0]._id ? users[1].name : users[0].name);
};
export const getPicture = (loggedUser, users) => {

    const x = JSON.parse(localStorage.getItem("userInfo"))
    // console.log(x._id);
    // console.log(x.pic);
    if (users[0]._id === x._id) {
        const pic = users[1].pic;
        return pic;
    } else {
        const pic2 = users[0].pic;
        return pic2
    }

    // return (users[0]._id === loggedUser[0]._id ? users[1].name : users[0].name);
};

export const isSameSender = (messages, m, i) => {
    const x = JSON.parse(localStorage.getItem("userInfo"))
    return (
        i < messages.length - 1 &&
        (messages[i + 1].sender._id !== m.sender._id ||
            messages[i + 1].sender._id === undefined) &&
        messages[i].sender._id !== x._id
    );
};

export const isLastMessage = (messages, i) => {
    const x = JSON.parse(localStorage.getItem("userInfo"))
    return (
        i === messages.length - 1 &&
        messages[messages.length - 1].sender._id !== x._id &&
        messages[messages.length - 1].sender._id
    );
};

export const isSameSenderMargin = (messages, m, i) => {
    // console.log(i === messages.length - 1);
    const x = JSON.parse(localStorage.getItem("userInfo"))
    if (
        i < messages.length - 1 &&
        messages[i + 1].sender._id === m.sender._id &&
        messages[i].sender._id !== x._id
    )
        return 33;
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender._id !== m.sender._id &&
            messages[i].sender._id !== x._id) ||
        (i === messages.length - 1 && messages[i].sender._id !== x._id)
    )
        return 0;
    else return "auto";
};

export const isSameUser = (messages, m, i) => {
    return i > 0 && messages[i - 1].sender._id === m.sender._id;
  };