import { io } from "socket.io-client";


const socket = io();
console.log(socket.id);

socket.on("connect", () => {
    console.log("connect", socket.connected); // true
});

socket.on("disconnect", () => {
    console.log("disconnect", socket.id); // false
});


export { socket };
