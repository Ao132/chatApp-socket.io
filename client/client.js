const socket = io("http://localhost:3000");

let totalClients = document.getElementById("total-clients");

let chatInput = document.getElementById("chat-input");
let nameInput = document.getElementById("name-input");
let messageForm = document.getElementById("message-form");
let messageContainer = document.getElementById("message-container");

messageForm.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMsg();
});

function sendMsg() {
  if (chatInput.value === "") return;

  socket.emit("chatMsg", {
    msg: chatInput.value,
    date: new Date(),
    name: nameInput.value,
  });
  chatInput.value = "";
}

socket.on("reply", (msg) => {
  clearTyping();
  const message = document.createElement("li");
  if (msg.senderId === socket.id) {
    message.classList.add("message-right");
    message.textContent = `${msg.name}: ` + msg.msg;
  } else {
    message.classList.add("message-left");
    message.textContent = `${msg.name}: ` + msg.msg;
  }
  const timeStamp = document.createElement("span");
  timeStamp.classList.add("timestamp");
  timeStamp.textContent = `${moment(msg.date).format("ddd, hA")}`;

  message.appendChild(timeStamp);
  messageContainer.appendChild(message);
  scrollToBottom();
});

socket.on("total-clients", (data) => {
  totalClients.innerText = `Total Clients: ${data}`;
});
function scrollToBottom() {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
}
chatInput.addEventListener("input", (_) => {
  socket.emit("typing", {
    name: `${nameInput.value} is typing...`,
  });
});
chatInput.addEventListener("keyup", (_) => {
  setTimeout(() => {
    socket.emit("typing", {
      name: "",
    });
  },1000);
});
socket.on("user-typing", (data) => {
  clearTyping();
  let p = document.createElement("p");
  p.classList.add("feedback");
  p.innerHTML = `${data.name}`;
  messageContainer.appendChild(p);
});
function clearTyping() {
  document.querySelectorAll("p").forEach((element) => {
    element.parentNode.removeChild(element);
  });
}
