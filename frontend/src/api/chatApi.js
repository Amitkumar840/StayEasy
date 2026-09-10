import api from "./axios";


export const sendMessage = (message) => {
    return api.post("/chat/send", {
        message
    });
}