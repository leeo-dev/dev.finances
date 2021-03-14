const Modal = {
  open() { // Abrir modal
    document.querySelector(".modal-overlay").classList.add("active");
  },
  close() {
    document.querySelector(".modal-overlay").classList.remove("active");
  }
}

document.querySelector(".button.new").addEventListener("click", Modal.open);
document.querySelector(".button.cancel").addEventListener("click", Modal.close);
