import "./index.css";
import {
  enableValidation,
  settings,
  disableButton,
  resetValidation,
} from "../scripts/valadation.js";
import { setButtonText, setDeleteBtnText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "72fba6f0-9246-4fa8-93f3-898fa1384ea9",
    "Content-Type": "application/json",
  },
});

api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    console.log("Avatar URL:", userInfo.avatar);
    userAvatar.src = userInfo.avatar;
    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.prepend(cardElement);
    });
  })
  .catch(console.error);

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileModalPost = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const userAvatar = document.querySelector(".profile__avatar");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileFormElement = editProfileModal.querySelector(".modal__form");
const editModalCloseButton =
  editProfileModal.querySelector(".modal__close-btn");
const editModalNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editModalDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

// Avatar form elements
const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteModalForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteModalCancelBtn = deleteModal.querySelector(
  ".modal__submit-btn.modal__submit-btn_cancel"
);

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const exitingPreviewModalImageEl =
  previewModal.querySelector(".modal__close-btn");

const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard, selectedCardId;

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const activePopup = document.querySelector(".modal_opened");
    closeModal(activePopup);
  }
}

function handleOverlay(evt) {
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.currentTarget);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("mousedown", handleOverlay);
  document.addEventListener("keyup", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("mousedown", handleOverlay);
  document.removeEventListener("keyup", handleEscape);
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const newCardData = {
    name: cardNameInput.value,
    link: cardLinkInput.value,
  };

  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .postNewCard(newCardData)
    .then((card) => {
      const cardElement = getCardElement(card);
      cardsList.prepend(cardElement);
      closeModal(cardModal);
      cardForm.reset();
      disableButton(cardSubmitBtn, settings);
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
      submitBtn.textContent = "Save";
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();

  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      userAvatar.src = data.avatar;
      closeModal(avatarModal);
      avatarForm.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonText(submitBtn, false, "Save", "Saving...");
      submitBtn.textContent = "Save";
    });
}

function getCardElement(data) {
  console.log("Data in getCardElement:", data);
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  cardLikeBtn.addEventListener("click", (evt) => {
    const isLiked = cardLikeBtn.classList.contains("card__like-btn_liked");

    api
      .handleLikeStatus(data._id, isLiked)
      .then(() => {
        cardLikeBtn.classList.toggle("card__like-btn_liked");
        // Optional: Update any other UI elements, like the like counter
      })
      .catch(console.error);
  });

  cardDeleteBtn.addEventListener("click", () => {
    console.log("Card data when delete clicked:", data);
    console.log("Card ID being selected:", data._id);
    selectedCardId = data._id;
    selectedCard = cardElement;
    openModal(deleteModal);
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
  });

  return cardElement;
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  setButtonText(submitBtn, true, "Save", "Saving...");

  api
    .editUserInfo(editModalNameInput.value, editModalDescriptionInput.value)
    .then((data) => {
      profileName.textContent = data.name;
      profileDescription.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch(console.error)
    .finally(() => {
      // TODO - Call the setButtonText instead
      setButtonText(submitBtn, false, "Save", "Saving...");
      submitBtn.textContent = "Save";
    });
}

// TODO - Implement loading text for all other form submissions

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  openModal(editProfileModal);
  resetValidation(
    editProfileModal,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
});
editModalCloseButton.addEventListener("click", () => {
  closeModal(editProfileModal);
});

exitingPreviewModalImageEl.addEventListener("click", () => {
  closeModal(previewModal);
});

profileModalPost.addEventListener("click", () => {
  openModal(cardModal);
});
cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

// TODO - Select avatar modal button at top of the page
// TODO -
avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

deleteModalForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  console.log("Attempting to delete card with ID:", selectedCardId);

  const submitDelBtn = evt.submitter;
  submitDelBtn.textContent = "Deleting...";

  api
    .deleteCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch(console.error)
    .finally(() => {
      // TODO - Call the setButtonText instead
      setDeleteBtnText(submitDelBtn, false, "Delete", "Deleting...");
      submitDelBtn.textContent = "Delete";
    });
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

editProfileFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);

enableValidation(settings);
