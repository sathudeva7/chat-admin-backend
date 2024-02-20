import { dataSource } from "../configs/dbConfig";
import { Message } from "../entity/Message";

// server/src/socketHandler.js
module.exports = (io, socket) => {
	const chatId = socket.handshake.query.chat_id;

	// Join the socket to a room based on chatId
	socket.join(chatId);

	socket.on('sendMessage', async (message) => {

		const messageRepository = dataSource.getRepository(Message);

		const savedMessage = messageRepository.create({ message_text: message.message_text, chat: { id: message.chat_id }, from_customer: message.from_customer });
		await messageRepository.save(savedMessage);

		io.to(chatId).emit('receiveMessage', message);

	});

	socket.on('isOnline', async (data) => {
		io.to(chatId).emit('receiveOnline', data);
	})

	socket.on('isAgentOnline', async (data) => {
		io.to(chatId).emit('receiveAgentOnline', data);
	})

	// Event when a user goes offline
	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
};
