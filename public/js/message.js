const now = new Date();
let hours = now.getHours();
let mins = now.getMinutes();
let dateTimeFormat = now.getHours() <= 12 ? 'AM' : 'PM';

const hisMessage = document.querySelector('.middle-content');

function handleEvent(error, data) {
  if (error) {
    console.log(error);
    return alert(error);
  }
  console.log(data);
};

function sendMessage() {
  let message = document.querySelector('#message-to-send').value;
  message = message.trim();
  if (message) {
    socket.emit('sendingMessage', {
      message,
      token
    }, handleEvent);

    document.querySelector('#message-to-send').value = '';
    hisMessage.scrollTop = hisMessage.scrollHeight;
  }
};

function runScript(event) {
  if (event.which == 13 || event.keyCode == 13) {
    sendMessage()
  }
};


const btnSend = document.querySelector('.msg_send_btn');
btnSend.addEventListener('click', sendMessage);

socket.on('loadingMessages', function (data) {
  while (hisMessage.firstChild) {
    hisMessage.removeChild(hisMessage.firstChild);
  };
  const { messages } = data;
  for (let item of messages) {
    hours = new Date(item.createdAt).getHours();
    if (hours < 10) {
      hours = '0' + hours;
    }
    mins = new Date(item.createdAt).getMinutes();
    if (mins < 10) {
      mins = '0' + mins;
    }
    if (item.author._id === data.user) {
      hisMessage.insertAdjacentHTML('beforeend', `<div class="me">
        <span>${item.author.fullName.first}</span>
        <div class="chat-content">${item.messages}</div>
        <small>${hours}:${mins}</small>
        </div>`);
    } else {
      hisMessage.insertAdjacentHTML('beforeend', `<div class="fr">
        <span>${item.author.fullName.first}</span>
        <div class="chat-content">${item.messages}</div>
        <small>${hours}:${mins}</small>
        </div>`);
    }
  }
  hisMessage.scrollTop = hisMessage.scrollHeight;
});

socket.on('sendingMessage', function (data) {
  if (data.token !== token) {
    hisMessage.insertAdjacentHTML('beforeend', `<div class="fr">
    <span>${data.payload.fullName.first}</span>
    <div class="chat-content">${data.message}</div>
    <small>${hours}:${mins}</small>
  </div>`);
  } else {
    hisMessage.insertAdjacentHTML('beforeend', `<div class="me">
    <span>${data.payload.fullName.first}</span>
    <div class="chat-content">${data.message}</div>
    <small>${hours}:${mins}</small>
  </div>`);
  }
  hisMessage.scrollTop = hisMessage.scrollHeight;
});