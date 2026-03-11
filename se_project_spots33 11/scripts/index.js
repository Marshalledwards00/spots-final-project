import "./index.css";
import { settings, enableValidation, disableButton, enableButton, resetValidation } from "../scripts/validation.js";
import closeIconPath from "../images/x4.svg";

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"
  },
  {
    name: "A very long bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"
  }
];


const modalOpenedClass = 'modal_is-opened';

function closeOnEscape(evt) {
  if (evt.key === 'Escape') {
    const openedModal = document.querySelector(`.${modalOpenedClass}`);
    closeModal(openedModal);
  }
}

function openModal(modal) {
  if (!modal) return;
  modal.__opener = document.activeElement;
  modal.classList.add(modalOpenedClass);
  setTimeout(function () {
    focusFirstDescendant(modal);
    trapFocus(modal);
    document.addEventListener('keydown', closeOnEscape);
  }, 0);
}

function closeModal(modal) {
  if (!modal) return;
  removeTrap(modal);
  modal.classList.remove(modalOpenedClass);
  document.removeEventListener('keydown', closeOnEscape);
  try {
    if (modal.__opener && typeof modal.__opener.focus === 'function') modal.__opener.focus();
  } catch (e) {
  }
}

function getFocusableElements(container) {
  return container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
}

function focusFirstDescendant(container) {
  const elems = getFocusableElements(container);
  if (elems.length) elems[0].focus();
}

function trapFocus(modal) {
  if (!modal) return;
  function handleKey(e) {
    if (e.key !== 'Tab') return;
    const focusables = Array.from(getFocusableElements(modal)).filter(el => el.offsetParent !== null);
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }
  modal.__trapHandler = handleKey;
  modal.addEventListener('keydown', handleKey);
}

function removeTrap(modal) {
  if (!modal || !modal.__trapHandler) return;
  modal.removeEventListener('keydown', modal.__trapHandler);
  delete modal.__trapHandler;
}

const editProfileBtn = document.querySelector('.profile__edit-btn');
const editProfileModal = document.getElementById('edit-profile-modal');
const editProfileForm = editProfileModal ? editProfileModal.querySelector('.modal__form') : null;
const editProfileNameInput = editProfileForm ? editProfileForm.querySelector('#profile-name') : null;
const editProfileAboutInput = editProfileForm ? editProfileForm.querySelector('#profile-description') : null;
const editProfileSaveBtn = editProfileForm ? editProfileForm.querySelector('.modal__save-btn') : null;
const profileNameEl = document.querySelector('.profile__name');
const profileDescriptionEl = document.querySelector('.profile__description');

const newPostBtn = document.querySelector('.profile__add-btn');
const newPostModal = document.getElementById('new-post-modal');
const newPostForm = newPostModal ? newPostModal.querySelector('.modal__form') : null;
const newPostTitleInput = newPostForm ? newPostForm.querySelector('#post-title') : null;
const newPostImageInput = newPostForm ? newPostForm.querySelector('#post-image') : null;
const newPostSaveBtn = newPostForm ? newPostForm.querySelector('.modal__save-btn') : null;

const cardTemplate = document.getElementById('card-template') ? document.getElementById('card-template').content : null;
const cardsList = document.querySelector('.cards__list');

const imagePreviewModal = document.getElementById('image-preview-modal');
const previewImage = imagePreviewModal ? imagePreviewModal.querySelector('.modal__image') : null;
const previewCaption = imagePreviewModal ? imagePreviewModal.querySelector('.modal__caption') : null;

(function checkCloseIconFallback() {
  try {
    const img = new Image();
    img.onload = function () {
    };
    img.onerror = function () {
      document.querySelectorAll('.modal__close').forEach(function (btn) {
        btn.classList.add('modal__close--text');
      });
    };
    img.src = closeIconPath;
  } catch (e) {
    document.querySelectorAll('.modal__close').forEach(function (btn) {
      btn.classList.add('modal__close--text');
    });
  }
})();

if (editProfileBtn && editProfileModal) {
  editProfileBtn.addEventListener('click', function () {
    if (editProfileNameInput && profileNameEl) editProfileNameInput.value = profileNameEl.textContent.trim();
    if (editProfileAboutInput && profileDescriptionEl) editProfileAboutInput.value = profileDescriptionEl.textContent.trim();
    resetValidation(editProfileForm, [editProfileNameInput, editProfileAboutInput], null, settings);
    enableButton(editProfileSaveBtn, settings);
    openModal(editProfileModal);
  });
}

if (editProfileForm && profileNameEl && profileDescriptionEl) {
  editProfileForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    if (editProfileNameInput) profileNameEl.textContent = editProfileNameInput.value;
    if (editProfileAboutInput) profileDescriptionEl.textContent = editProfileAboutInput.value;
    closeModal(editProfileModal);
  });
}

if (newPostBtn && newPostModal) {
  newPostBtn.addEventListener('click', function () {
    openModal(newPostModal);
  });
}

function getCardElement(data) {
  if (!cardTemplate) return null;
  const fragment = cardTemplate.cloneNode(true);
  const cardElement = fragment.querySelector('.card');
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardTitle.textContent = data.name;

  const likeButton = cardElement.querySelector('.card__like-button');
  if (likeButton) {
    likeButton.setAttribute('aria-pressed', 'false');
    likeButton.addEventListener('click', function () {
      likeButton.classList.toggle('card__like-button_active');
      likeButton.setAttribute('aria-pressed', likeButton.classList.contains('card__like-button_active'));
    });
  }

  const deleteButton = cardElement.querySelector('.card__delete-button');
  if (deleteButton) {
    deleteButton.addEventListener('click', function () {
      cardElement.remove();
    });
  }

  if (cardImage && imagePreviewModal && previewImage && previewCaption) {
    cardImage.tabIndex = 0;
    const openPreview = function () {
      previewImage.src = data.link;
      previewImage.alt = data.name;
      previewCaption.textContent = data.name;
      openModal(imagePreviewModal);
    };
    cardImage.addEventListener('click', openPreview);
    cardImage.addEventListener('keydown', function (evt) {
      if (evt.key === 'Enter' || evt.key === ' ') {
        evt.preventDefault();
        openPreview();
      }
    });
  }

  return cardElement;
}

if (Array.isArray(initialCards) && cardsList) {
  initialCards.forEach(function (item) {
    const el = getCardElement(item);
    if (el) cardsList.append(el);
  });
}

if (newPostForm) {
  newPostForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    const title = newPostTitleInput ? newPostTitleInput.value.trim() : '';
    const image = newPostImageInput ? newPostImageInput.value.trim() : '';
    if (title && image) {
      const newCard = getCardElement({ name: title, link: image });
      if (newCard && cardsList) cardsList.prepend(newCard);
      newPostForm.reset();
      closeModal(newPostModal);
      disableButton(newPostSaveBtn, settings);
    }
  });
}

const modals = document.querySelectorAll('.modal');
modals.forEach((modal) => {
  modal.addEventListener('mousedown', (evt) => {
    if (evt.target.classList.contains(modalOpenedClass)) {
      closeModal(modal);
    }
  });
  modal.addEventListener('click', (evt) => {
    if (evt.target.classList.contains('modal__close')) {
      closeModal(modal);
    }
  });
});

enableValidation(settings);
