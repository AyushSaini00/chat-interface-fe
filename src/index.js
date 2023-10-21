import {
  createNewDateNode,
  createNewTextMessage,
  createNewTextWithImageMessage,
} from "./dom";
import "./modal";
import "./messageInput";
import "../styles/common.css";
import "../styles/style.css";
import USERS from "../data/user";
import {
  getItemFromLocalStorage,
  isToday,
  setItemToLocalStorage,
} from "./utils";

// const header = document.querySelector(".header");
const chatElem = document.querySelector(".chat");
const toggleProfileBtn = document.querySelector(".toggle-profile-btn");

// state
const receiverUserId = toggleProfileBtn.getAttribute("data-current-user");
const senderUserId = Object.keys(USERS).find((uid) => uid !== receiverUserId);

// toggle user profile using the top right button between sender and receiver
const setUserProfile = (user = {}) => {
  const userName = document.querySelectorAll(".user-name");
  const profileImage = document.querySelectorAll(".profile-image");

  userName.forEach((un) => {
    un.textContent = user.name;
  });
  profileImage.forEach((pi) => {
    pi.src = user.profileImageSrc;
  });
  document.body.style.backgroundImage = `url("${user.bgImageSrc}")`;
};

toggleProfileBtn.addEventListener("click", (evt) => {
  const currentUser = evt.currentTarget.dataset.currentUser;
  const nextUser = Object.keys(USERS).find((u) => u !== currentUser);

  setUserProfile(USERS[nextUser]);
  const allSenderMessages = document.querySelectorAll(
    `[data-type="sender"].text-message-wrapper`
  );
  const allReceiverMessages = document.querySelectorAll(
    `[data-type="receiver"].text-message-wrapper`
  );
  allSenderMessages.forEach((msg) => msg.setAttribute("data-type", "receiver"));
  allReceiverMessages.forEach((msg) => msg.setAttribute("data-type", "sender"));

  evt.currentTarget.setAttribute("data-current-user", nextUser);
});

const renderChats = (chats) => {
  chats.forEach((chat) => {
    const { text, createdAt, from, to, image } = chat;
    const type = from === senderUserId ? "sender" : "receiver";

    const localDate = isToday(createdAt)
      ? "Today"
      : new Date(createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });

    if (
      ![...document.querySelectorAll(`[data-date-node-time="${localDate}"]`)]
        .length
    )
      createNewDateNode(chatElem, localDate);

    if (image) {
      //render image with text message
      createNewTextWithImageMessage(
        chatElem,
        text,
        {
          src: image,
        },
        type
      );
    } else {
      createNewTextMessage(chatElem, text, type);
    }
  });
};

//initializes the app
const init = () => {
  setUserProfile(USERS["priya"]);
  // init chat window with previous chats from localstorage
  const chats = getItemFromLocalStorage("chats") || [];
  if (!chats.length) {
    setItemToLocalStorage("chats", []);
  } else {
    renderChats(chats);
  }
};

(() => {
  init();
})();
