const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Get user name and room from URL
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//Join chatroom
socket.emit('joinRoom', {username, room});

//Get room and users
socket.on('roomUsers', ({room, users}) => {
    outputRoomName(name);
    outputUsers(users);
})

// Message
socket.on('message', message => {
    outPutMessage(message);

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    //Get message text
    const msg = e.target.elements.msg.value;
    //Emit message to server
    socket.emit('chatMessage', msg);

    //Clear input
    e.target.elements.msg.value='';
    e.target.focus();
});

// Output message DOM
function outPutMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRoomName(){
    roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}`
}