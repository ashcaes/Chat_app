const socket = io();

//dom elements

const form = document.querySelector("#message-form");
const loc = document.querySelector("#send-location");
const input = form.querySelector('input[name="message"]');
const button = form.querySelector(".demo");
const messages = document.querySelector(".chat__messages");
const sidebar = document.querySelector(".chat__sidebar");

//auto scroll function
const autoscroll = () => {
  // new message element
  const newMessage = messages.lastElementChild;

  //height of the new message
  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseFloat(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;

  // visible height
  const visibleHeight = messages.offsetHeight;

  //height of messages container
  const containerHeight = messages.scrollHeight;

  //How far have I scrolled?
  const scrollOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

//mustache templates

const msgTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector(
  "#location-message-template"
).innerHTML;

const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

socket.on("Message", (message) => {
  const html = Mustache.render(msgTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("locationMessage", (coords) => {
  console.log(coords);
  const html = Mustache.render(locationTemplate, {
    username: coords.username,
    url: coords.loc,
    createdAt: moment(coords.createdAt).format("h:mm a"),
  });
  messages.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

//Getting the room relevant data

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });

  sidebar.innerHTML = html;
});

//QS options

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// the chat form

form.addEventListener("submit", (e) => {
  e.preventDefault();

  button.setAttribute("disabled", "disabled");

  const msg = e.target.elements.message.value;

  socket.emit("SendMessage", msg, (check) => {
    button.removeAttribute("disabled");

    input.value = "";
    input.focus();

    if (check) {
      return console.log(check);
    }
    console.log("message was delivered successfully");
  });
});

loc.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser");
  }
  loc.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "Location",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        console.log("location shared");
        loc.removeAttribute("disabled");
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});
