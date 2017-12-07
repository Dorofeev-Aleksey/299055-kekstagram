'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var photos = [];

 // ---Формируем массив данных
for (var i = 0; i < 25; i++) {
  photos[i] = {
    url: 'photos/' + (i + 1) + '.jpg',
    likes: getRandomInRange(15, 200),
    commets: COMMENTS[getRandomInRange(0, COMMENTS.length - 1)]
  };
}
 // ---Создания шаблона и вставка в разметку
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

 // ---Показ крупного плана, отприсовка картинки крупным планом
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

galleryOverlayClose.addEventListener('click', function () {
  closePopup();
});

galleryOverlayClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
});

 //  --- Взаимодействие с редактором фото
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

uploadInput.addEventListener('change', function () {
  openOverlay();
});

uploadFormCancel.addEventListener('click', function () {
  closeOverlay();
});

 // ---Наложение фильтров
var effectButtons = document.querySelectorAll('.upload-effect-input');
var imagePreview = document.getElementById('effect-image-preview');

var onEffectPress = function (evt) {
  for (i = 0; i < effectButtons.length; i++) {
    var effectClass = effectButtons[i].id;
    effectClass = effectClass.substr(7) + '';
    imagePreview.classList.remove(effectClass);

    if (evt.target.checked) {
      var effectButtonsId = evt.target.id;
      effectButtonsId= effectButtonsId.substr(7) + '';
      imagePreview.classList.add(effectButtonsId);
    }
  }
};

for (i = 0; i < effectButtons.length; i++) {
  effectButtons[i].addEventListener('change', onEffectPress);
}

 // ---Изменение масштаба изображения
var buttonResizeDec = document.querySelector('.upload-resize-controls-button-dec');
var buttonResizeInc = document.querySelector('.upload-resize-controls-button-inc');
var controlSizeValue = document.querySelector('.upload-resize-controls-value');

var STEP_RESIZE = 25;
var MIN_RESIZE = 25;
var MAX_RESIZE = 100;

var buttonResizeClickHandler = function (evt) {
  var step = STEP_RESIZE;
  if (evt.currentTarget === buttonResizeDec) {
    step = -step;
  }
  var value = parseInt(controlSizeValue.value, 10) + step;
  if (value >= MIN_RESIZE && value <= MAX_RESIZE) {
    controlSizeValue.value = value + '%';
    imagePreview.style.transform = 'scale(' + value * 0.01 + ')';
  }
};

buttonResizeDec.addEventListener('click', buttonResizeClickHandler);
buttonResizeInc.addEventListener('click', buttonResizeClickHandler);

 // ---Валидация хэш-тэгов

var inputHashtag = document.querySelector('.upload-form-hashtags');

var validateHashtags = function (value) {
  var MAX_HASHTAGS = 5;
  var MAX_LENGTH_HASHTAG = 20;
  var MIN_LENGTH_HASHTAG = 2;
  var errorMessage = '';

  value = value.toLowerCase();
  var array = value.split(/\s+/g);

  if (array.length > MAX_HASHTAGS) {
    errorMessage += 'Не больше 5 хэш-тегов.\n';
  }

  for (i = 0; i < array.length; i++) {
    if (array[i].length > MAX_LENGTH_HASHTAG) {
      errorMessage += 'Длина хэш-тега не больше 20 символов.\n';
      break;
    }

    if (array[i][0] !== '#') {
      errorMessage += 'Хэш-тег должен начинаться с символа "#".\n';
      break;
    }

    if (array[i].length < MIN_LENGTH_HASHTAG + 1) {
      errorMessage += 'После символа "#" минимум ' + MIN_LENGTH_HASHTAG + ' знака.\n';
      break;
    }

    if (array[0].indexOf('#', 1) >= 0) {
      errorMessage += 'Хэш-теги отделяются пробелом.\n';
      break;
    }
  }

  for (i = 0; i < array.length - 1; i++) {
    if (~array.indexOf(array[i], i + 1)) {
      errorMessage += 'Запрещены повторяющие хэш-теги\n';
      break;
    }
  }

  if (errorMessage) {
    inputHashtag.setCustomValidity(errorMessage);
  } else {
    inputHashtag.setCustomValidity('');
    inputHashtag.style.border = '';
  }

};

inputHashtag.addEventListener('input', function () {
  validateHashtags(inputHashtag.value);
});
