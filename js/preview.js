'use strict';

(function () {
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var pictureItems = document.querySelectorAll('.picture');
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.preview = {
    onPopupEscPress: function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        window.preview.closePopup();
      }
    },
    openPopup: function () {
      galleryOverlay.classList.remove('hidden');
      document.addEventListener('keydown', window.preview.onPopupEscPress);
    },
    closePopup: function () {
      galleryOverlay.classList.add('hidden');
      document.removeEventListener('keydown', window.preview.onPopupEscPress);
    },
    renderGalleryPhoto: function (usedPicture) {
      galleryOverlay.querySelector('.gallery-overlay-image').src = usedPicture.querySelector('img').src;
      galleryOverlay.querySelector('.likes-count').textContent = usedPicture.querySelector('.picture-likes').textContent;
      galleryOverlay.querySelector('.comments-count').textContent = '1';
    },
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13
  };
})();
