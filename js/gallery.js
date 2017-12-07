'use strict';

(function () {
  var picturesList = document.querySelector('.pictures');

  var fragment = document.createDocumentFragment();

  for (var j = 0; j < window.data.length; j++) {
    fragment.appendChild(window.picture.renderPhoto(window.data[j]));
  }

  picturesList.appendChild(fragment);

  var pictureItems = document.querySelectorAll('.picture');
  var galleryOverlayClose = document.querySelector('.gallery-overlay-close');

  for (var i = 0; i < pictureItems.length; i++) {
    pictureItems[i].addEventListener('click', function (evt) {
      evt.preventDefault();
      var usedPicture = evt.target.parentNode;
      window.preview.renderGalleryPhoto(usedPicture);
      window.preview.openPopup();
    });

    pictureItems[i].addEventListener('keydown', function (evt) {
      if (evt.keyCode === window.preview.ENTER_KEYCODE) {
        evt.preventDefault();
        var usedPicture2 = evt.target;
        window.preview.renderGalleryPhoto(usedPicture2);
        window.preview.openPopup();
      }
    });
  }

  galleryOverlayClose.addEventListener('click', function () {
      window.preview.closePopup();
  });

  galleryOverlayClose.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.preview.ENTER_KEYCODE) {
      window.preview.closePopup();
    }
  });
})();
