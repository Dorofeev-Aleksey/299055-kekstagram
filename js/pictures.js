'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;
var COMMENTS = ['Всё отлично!', 'В целом всё неплохо. Но не всё.', 'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.', 'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.', 'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.', 'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var photos = [];

for (var i = 0; i < 25; i++) {
  photos[i] = {
    url: 'photos/' + (i + 1) + '.jpg',
    likes: getRandomInRange(15, 200),
    commets: COMMENTS[getRandomInRange(0, COMMENTS.length - 1)]
  };
}

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

//galleryOverlay.querySelector('.gallery-overlay-image').src = photos[0].url;
//galleryOverlay.querySelector('.likes-count').textContent = photos[0].likes;
//galleryOverlay.querySelector('.comments-count').textContent = '1';

for (var i = 0; i < pictureItems.length; i++) {
  pictureItems[i].addEventListener('click', function (evt) {
    evt.preventDefault();
    var usedPicture = evt.target.parentNode;
    galleryOverlay.querySelector('.gallery-overlay-image').src = usedPicture.querySelector('img').src;
    galleryOverlay.querySelector('.likes-count').textContent = usedPicture.querySelector('.picture-likes').textContent;
    galleryOverlay.querySelector('.comments-count').textContent = '1';
    openPopup();
  });

  pictureItems[i].addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      evt.preventDefault();
      var usedPicture2 = evt.target;
      console.log(usedPicture2);
      galleryOverlay.querySelector('.gallery-overlay-image').src = usedPicture2.querySelector('img').src;
      galleryOverlay.querySelector('.likes-count').textContent = usedPicture2.querySelector('.picture-likes').textContent;
      galleryOverlay.querySelector('.comments-count').textContent = '1';
      openPopup();
    }
  });
}

galleryOverlayClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
});
