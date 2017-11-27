'use strict';

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
galleryOverlay.classList.remove('hidden');

galleryOverlay.querySelector('.gallery-overlay-image').src = photos[0].url;
galleryOverlay.querySelector('.likes-count').textContent = photos[0].likes;
galleryOverlay.querySelector('.comments-count').textContent = '1';
