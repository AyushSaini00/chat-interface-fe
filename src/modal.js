const closeModalButtons = document.querySelectorAll(".close-modal");

export const closeModal = (evt, modalClass) => {
  const modalSelector = modalClass
    ? modalClass
    : evt.currentTarget.getAttribute("data-modal");
  const modal = document.querySelector(modalSelector);
  modal.classList.add("hidden");
};

closeModalButtons.forEach((closeModalBtn) => {
  closeModalBtn.addEventListener("click", (evt) => {
    closeModal(evt);
  });
});
