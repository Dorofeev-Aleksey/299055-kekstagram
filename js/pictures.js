'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var photos = [];

//---Формируем массив данных
for (var i = 0; i < 25; i++) {
  photos[i] = {
    url: 'photos/' + (i + 1) + '.jpg',
    likes: getRandomInRange(15, 200),
    commets: COMMENTS[getRandomInRange(0, COMMENTS.length - 1)]
  };
}
//---Создания шаблона и вставка в разметку
var picturesList = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture-template').content;

var renderPhoto = function (photo) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture img').src = photo.url;
  pictureElement.querySelector('.picture-likes').textContent = photo.likes;
  pictureElement.querySelector('.picture-comments').textContent = photo.commets;

  return pictureElement;
};

var fragment = document.createDocumentFragment();

for (var j = 0; j < photos.length; j++) {
  fragment.appendChild(renderPhoto(photos[j]));
}

picturesList.appendChild(fragment);

//---Показ крупного плана, отприсовка картинки крупным планом
var galleryOverlay = document.querySelector('.gallery-overlay');
var pictureItems = document.querySelectorAll('.picture');
var galleryOverlayClose = document.querySelector('.gallery-overlay-close');

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var openPopup = function () {
  galleryOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function () {
  galleryOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
};

var renderGalleryPhoto = function (usedPicture) {
  galleryOverlay.querySelector('.gallery-overlay-image').src = usedPicture.querySelector('img').src;
  galleryOverlay.querySelector('.likes-count').textContent = usedPicture.querySelector('.picture-likes').textContent;
  galleryOverlay.querySelector('.comments-count').textContent = '1';
};

for (i = 0; i < pictureItems.length; i++) {
  pictureItems[i].addEventListener('click', function (evt) {
    evt.preventDefault();
    var usedPicture = evt.target.parentNode;
    renderGalleryPhoto(usedPicture);
    openPopup();
  });

  pictureItems[i].addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      evt.preventDefault();
      var usedPicture2 = evt.target;
      renderGalleryPhoto(usedPicture2);
      openPopup();
    }
  });
}

galleryOverlayClose.addEventListener('click', function (evt) {
    closePopup();
});

galleryOverlayClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
});

//--- Взаимодействие с редактором фото
var uploadInput = document.querySelector('.upload-input');
var uploadOverlay = document.querySelector('.upload-overlay');
var uploadFormCancel = document.querySelector('.upload-form-cancel');
var uploadFormDescription = document.querySelector('.upload-form-description');

var onOverlayEscPress = function (evt) {
  var focused = document.activeElement;
  if (evt.keyCode === ESC_KEYCODE) {
    if (focused === uploadFormDescription) {
      focused.blur();
    } else {
      closeOverlay();
    }
  }
};

var openOverlay = function () {
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onOverlayEscPress);
};

var closeOverlay = function () {
  uploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onOverlayEscPress);
};

uploadInput.addEventListener('change', function() {
  openOverlay();
});

uploadFormCancel.addEventListener('click', function() {
  closeOverlay();
});

var effectButtons = document.querySelectorAll('.upload-effect-input');
var imagePreview = document.querySelector('.effect-image-preview');

var onEffectPress = function (evt) {
  if (evt.target.checked) {
    var effectButtonsId = evt.target.id;
    effectButtonsId= effectButtonsId.substr(7) + '';
    imagePreview.classList.add(effectButtonsId);
  }
};

for (var i = 0; i < effectButtons.length; i++) {
  var effectButtonsId = effectButtons[i].id;
  effectButtons[i].addEventListener('change', onEffectPress);
}
