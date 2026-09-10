import api from "./axios";


export const getRooms = ()=>{

    return api.get("/rooms");

}



export const getRoomById = (id)=>{

    return api.get(`/rooms/${id}`);

}



export const createRoom = (data)=>{

    return api.post("/rooms",data);

}