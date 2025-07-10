const socketIO = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
let io;

function initalizeSocket(server) {
    io = socketIO(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
           const { userId, userType } = data;

            console.log(`User ${userId} joined ${userType}`);

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });


socket.on('update-Location-captain', async (data) => {
    const { userId, location } = data;

    if(!location || !location.lat || !location.lng) {
        return socket.emit('error', { message: 'Invalid location data' });
    }

    await captainModel.findByIdAndUpdate(userId, { 
        location:{
            lat: location.lat,
            lng: location.lng
        }
    });
});

        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {

  console.log(`Sending message to socketId: ${socketId}`, messageObject);

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.error("Socket.io is not initialized.");
  }
};

module.exports = { initalizeSocket, sendMessageToSocketId };