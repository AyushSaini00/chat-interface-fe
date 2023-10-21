export const createNewTextMessage = (mountElem, text, type = "sender") => {
  const template = `
    <div data-type="${type}" class="text-message-wrapper">
        <div class="text-message">${text}</div>
    </div>
    `;
  mountElem.innerHTML += template;
};

export const createNewTextWithImageMessage = (
  mountElem,
  text,
  img,
  type = "sender"
) => {
  const { src, alt = "message image" } = img;
  const template = `
    <div data-type="${type}" class="text-message-wrapper">
        <div class="text-message-with-image">
        <div class="message-image-wrapper flex">
            <img
            class="message-image"
            src="${src}"
            alt="${alt}"
            />
        </div>
        <div class="text-message">${text}</div>
        </div>
    </div>
    `;
  mountElem.innerHTML += template;
};

export const createNewDateNode = (mountElem, date) => {
  const template = `
    <div data-date-node-time="${date}" class="time">${date}</div>
    `;
  mountElem.innerHTML += template;
};
