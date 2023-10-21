import USERS from "../data/user";
import { createNewTextMessage, createNewTextWithImageMessage } from "./dom";
import { closeModal } from "./modal";
import { getItemFromLocalStorage, setItemToLocalStorage } from "./utils";

//selectors
const toggleProfileBtn = document.querySelector(".toggle-profile-btn");
const chatElem = document.querySelector(".chat");

const messageInputForms = document.querySelectorAll(
  ".message-input-element-wrapper"
);
const messageInputElements = document.querySelectorAll(
  ".message-input-element"
);
// const sendMessageButtons = document.querySelectorAll(".send-message-button");
const messageInputFiles = document.querySelectorAll(".message-input-file");

const addImageButton = document.querySelector(".add-image-button");
const addImageModal = document.querySelector(".add-image-modal");
const selectedImageElem = document.querySelector(".selected-image");

//event handlers
const handleMessageInputHandler = (evt) => {
  const msg = evt.target.value;
  const form = evt.target.form;
  const sendMessageButton = form.querySelector(".send-message-button");
  const messageInputElement = form.querySelector(".message-input-element");

  if (msg.length > 0) {
    sendMessageButton.style.display = "block";
    messageInputElement.style.width = "calc(100% - 50px)";
  } else {
    sendMessageButton.style.display = "none";
    messageInputElement.style.width = "calc(100% - 24px)";
  }
};

const handleMessageInputFormSubmit = (evt) => {
  evt.preventDefault();

  const form = evt.target;
  const messageInputElement = form.querySelector(".message-input-element");

  const msg = messageInputElement.value;
  if (!msg) return;

  const createdAt = new Date().toISOString();
  const toUser = toggleProfileBtn.getAttribute("data-current-user");
  const fromUser = Object.keys(USERS).find((u) => u !== toUser);

  const isAddImageModalForm =
    form.getAttribute("data-form") === "add-image-modal";

  if (isAddImageModalForm) {
    createNewTextWithImageMessage(
      chatElem,
      msg,
      { src: selectedImageElem.src },
      "sender",
      true
    );
  } else {
    createNewTextMessage(chatElem, msg, "sender", true);
  }

  let chats = getItemFromLocalStorage("chats");
  chats.push({
    text: msg,
    createdAt,
    from: fromUser,
    to: toUser,
    ...(isAddImageModalForm && { image: selectedImageElem.src }),
  });
  setItemToLocalStorage("chats", chats);

  if (isAddImageModalForm) {
    closeModal({}, ".add-image-modal");
  }

  const els = document.querySelectorAll(".text-message-wrapper");
  const el = els[els.length - 1];

  el.scrollIntoView({
    behavior: "smooth",
    block: "end",
    inline: "nearest",
  });

  // mimicing api call
  setTimeout(() => {
    const textElem = el.querySelector(".text-message");
    textElem.classList.remove("sending");
    messageInputElement.value = "";
    messageInputElement.focus();
  }, 500);
};

const handleAddImageButtonClickHandler = (evt) => {
  const form = evt.currentTarget.form;
  const messageInputFile = form.querySelector(".message-input-file");
  messageInputFile.click();
};

const handleMessageInputFileChangeHandler = (evt) => {
  const selectedFile = evt.currentTarget.files[0];
  addImageModal.classList.remove("hidden");
  selectedImageElem.src = URL.createObjectURL(selectedFile);
};

//listeners
messageInputElements.forEach((messageInputElement) => {
  messageInputElement.addEventListener("input", handleMessageInputHandler);
});
messageInputForms.forEach((messageInputForm) => {
  messageInputForm.addEventListener("submit", handleMessageInputFormSubmit);
});
addImageButton.addEventListener("click", handleAddImageButtonClickHandler);
messageInputFiles.forEach((messageInputFile) => {
  messageInputFile.addEventListener(
    "change",
    handleMessageInputFileChangeHandler
  );
});
