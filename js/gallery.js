'use strict';

(function () {
  var galleryOverlayElement = document.querySelector('.gallery-overlay');
  var picturesList = document.querySelector('.pictures');
  var filterForm = document.querySelector('.filters');
  var pictureItems = document.querySelectorAll('.picture');

  function sortFilterLikes(pictures) {
    var sortedArray = pictures;
    sortedArray.sort(function (first, second) {
      return second.likes - first.likes;
    });
    return sortedArray;
  }

  function sortFilterComments(pictures) {
    var sortedArray = pictures;
    sortedArray.sort(function (first, second) {
      return second.comments.length - first.comments.length;
    });
    return sortedArray;
  }

  function sortFilterRandomize(pictures) {
    var sortedArray = pictures;
    sortedArray.sort(function () {
      return Math.random() - 0.5;
    });
    return sortedArray;
  }

  function changeFilterSort(pictures) {
    var filterSortElements = document.querySelectorAll('.filters input[type="radio"]');
    for (var i = 0; i < filterSortElements.length; i++) {
      if (filterSortElements[i].checked) {
        var filter = filterSortElements[i].value;
        var filterSort;

        switch (filter) {
          case 'recommend':
            filterSort = pictures;
            break;
          case 'popular':
            filterSort = sortFilterLikes(pictures);
            break;
          case 'discussed':
            filterSort = sortFilterComments(pictures);
            break;
          case 'random':
            filterSort = sortFilterRandomize(pictures);
            break;
        }
        break;
      }
    }
    return filterSort;
  }

  function closeSlider() {
    galleryOverlayElement.classList.add('hidden');
    document.removeEventListener('keydown', sliderEscPressHandler);
  }

  function sliderEscPressHandler(evt) {
    window.util.isEscEvent(evt, closeSlider);
  }

  function openSlider() {
    galleryOverlayElement.classList.remove('hidden');
    document.addEventListener('keydown', sliderEscPressHandler);
  }

  function openPhotoHandler(evt) {
    evt.preventDefault();
    var el = evt.currentTarget.children[0];
    window.preview.renderMainPhoto(el, window.pictures);
    openSlider();
  }

  function cleanOldPictures() {
    pictureItems.forEach(function (element, index, array) {
      element.removeEventListener('click', openPhotoHandler);
    });
    picturesList.innerHTML = '';
  }

  function insertingNewPictures() {
    var pictures = changeFilterSort(window.pictures.slice());
    var fragment = document.createDocumentFragment();
    pictures.forEach(function (element, index, array) {
      fragment.appendChild(window.picture.renderPhoto(element));
    });
    picturesList.appendChild(fragment);
  }

  function updatePictures() {
    cleanOldPictures();
    insertingNewPictures();
    pictureItems = document.querySelectorAll('.picture');
    pictureItems.forEach(function (element, index, array) {
      element.addEventListener('click', openPhotoHandler);
    });
  }

  function successRenderPhotoHandler(pictures) {
    window.pictures = pictures; // первоначальный массив картинок
    filterForm.classList.remove('filters-inactive');
    updatePictures();
  }

  filterForm.addEventListener('change', function () {
    window.debounce(updatePictures);
  });

  window.backend.load(successRenderPhotoHandler, window.backend.onError);

  var galleryOverlayClose = document.querySelector('.gallery-overlay-close');

  galleryOverlayClose.addEventListener('click', function () {
    window.preview.closePopup();
  });

  galleryOverlayClose.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.preview.ENTER_KEYCODE) {
      window.preview.closePopup();
    }
  });
})();
