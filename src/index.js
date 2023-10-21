import {
  createNewDateNode,
  createNewTextMessage,
  createNewTextWithImageMessage,
} from "./dom";
import "./messageInputComponent";
import "../styles/common.css";
import "../styles/style.css";
import USERS from "../data/user";
import {
  getItemFromLocalStorage,
  isToday,
  setItemToLocalStorage,
} from "./utils";

const chatElem = document.querySelector(".chat");
const messageInputElementWrapper = document.querySelector(
  ".message-input-element-wrapper"
);
const messageInputFile = document.querySelector(".message-input-file");
const messageInputElement = document.querySelector(".message-input-element");
const addImageButton = document.querySelector(".add-image-button");
const sendMessageButton = document.querySelector(".send-message-button");

const addImageModal = document.querySelector(".add-image-modal");
const selectedImageElem = document.querySelector(".selected-image");
const closeModalButtons = document.querySelectorAll(".close-modal");
const toggleProfileBtn = document.querySelector(".toggle-profile-btn");

// state
const receiverUserId = toggleProfileBtn.getAttribute("data-current-user");
const senderUserId = Object.keys(USERS).find((uid) => uid !== receiverUserId);

messageInputElement.addEventListener("input", (evt) => {
  const msg = evt.target.value;

  if (msg.length > 0) {
    sendMessageButton.style.display = "block";
    messageInputElement.style.width = "calc(100% - 50px)";
  } else {
    sendMessageButton.style.display = "none";
    messageInputElement.style.width = "calc(100% - 24px)";
  }
});

messageInputElementWrapper.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const createdAt = new Date().toISOString();

  const msg = messageInputElement.value;
  createNewTextMessage(chatElem, msg);

  const toUser = toggleProfileBtn.getAttribute("data-current-user");
  const fromUser = Object.keys(USERS).find((u) => u !== toUser);
  let chats = getItemFromLocalStorage("chats");

  chats.push({
    text: msg,
    createdAt,
    from: fromUser,
    to: toUser,
  });

  setItemToLocalStorage("chats", chats);

  messageInputElement.value = "";
  messageInputElement.focus();

  const els = document.querySelectorAll(".text-message-wrapper");
  const el = els[els.length - 1];

  el.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });
});

addImageButton.addEventListener("click", (evt) => {
  messageInputFile.click();
});
messageInputFile.addEventListener("change", (evt) => {
  const selectedFile = messageInputFile.files[0];
  addImageModal.classList.remove("hidden");

  selectedImageElem.src = URL.createObjectURL(selectedFile);
});

closeModalButtons.forEach((closeModalBtn) => {
  closeModalBtn.addEventListener("click", (evt) => {
    const modalClass = evt.currentTarget.getAttribute("data-modal");
    const modal = document.querySelector(modalClass);
    modal.classList.add("hidden");
  });
});

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
  const chats = getItemFromLocalStorage("chats");
  if (!chats) {
    setItemToLocalStorage("chats", []);
  } else {
    renderChats(chats);
  }
};

(() => {
  init();
})();
