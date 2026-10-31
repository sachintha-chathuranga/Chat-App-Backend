import Message from './Message';
import User from './User';

// A user can send many messages
User.hasMany(Message, {
	foreignKey: 'sender_id',
	as: 'sentMessages',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// Each message has one sender
Message.belongsTo(User, {
	foreignKey: 'sender_id',
	as: 'sender',
});

// A user can receive many messages
User.hasMany(Message, {
	foreignKey: 'receiver_id',
	as: 'receivedMessages',
	onDelete: 'CASCADE',
	onUpdate: 'CASCADE',
});

// Each message has one receiver
Message.belongsTo(User, {
	foreignKey: 'receiver_id',
	as: 'receiver',
});

export default {User, Message};
