class MessageInputComponent extends HTMLElement {
  constructor() {
    super();
    const template = document.getElementById("message-input-template");
    this.innerHTML = template.innerHTML;

    if (this.dataset.inputFor === "add-image-model") {
      const btn = this.querySelector(".add-image-button");
      btn.classList.add("hidden");
    }
  }

  connectedCallback() {}
}

customElements.define("message-input", MessageInputComponent);
