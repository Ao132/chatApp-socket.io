const socket = io("http://localhost:3000");

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

  socket.emit("chatMsg", chatInput.value);
  chatInput.value = "";
}

socket.on("reply", (msg) => {
  const item = document.createElement("li");
  if (msg.senderId === socket.id) {
    item.classList.add("message-right");
    item.textContent = "You: " + msg.msg;
  } else {
    item.classList.add("message-left");
    item.textContent = "Sender: " + msg.msg;
  }
  messageContainer.appendChild(item);
});
