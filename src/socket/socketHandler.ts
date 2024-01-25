import { dataSource } from "../configs/dbConfig";
import { Message } from "../entity/Message";

// server/src/socketHandler.js
module.exports = (io, socket) => {
	// A map to keep track of online users
	let onlineUsers = {};
 
	// Event when a user goes online
	socket.on('online', (userId) => {
	    onlineUsers[userId] = socket.id;
	    io.emit('userStatusUpdate', { userId, isOnline: true });
	});

	socket.on('sendMessage',async (message) => {
		//save message to db
		console.log(message);

		const messageRepository = dataSource.getRepository(Message);
		const savedMessage = messageRepository.create({ message_text: message.message_text, chat: { id: message.chat_id }, representative: null });
		await messageRepository.save(savedMessage);

		io.emit('receiveMessage', message);
	 });
 
	// Event when a user goes offline
	socket.on('disconnect', () => {
	    const userId = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
	    if (userId) {
		   delete onlineUsers[userId];
		   io.emit('userStatusUpdate', { userId, isOnline: false });
	    }
	});
 };
 