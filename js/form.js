'use strict';

(function () {
  var uploadInput = document.querySelector('.upload-input');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadFormCancel = document.querySelector('.upload-form-cancel');
  var uploadFormDescription = document.querySelector('.upload-form-description');
  var uploadLevelElement = document.querySelector('.upload-effect-level');
  var uploadLevelInputElement = uploadLevelElement.querySelector('.upload-effect-level-value');
  var scopeElement = uploadLevelElement.querySelector('.upload-effect-level-line');
  var effectLevelPinElement = uploadLevelElement.querySelector('.upload-effect-level-pin');
  var effectLevelLineElement = uploadLevelElement.querySelector('.upload-effect-level-val');
  var uploadControlsElement = document.querySelector('.upload-effect-controls');
  var imagePreview = document.getElementById('effect-image-preview');

  uploadLevelInputElement.classList.add('hidden');

  var onOverlayEscPress = function (evt) {
    var focused = document.activeElement;
    if (evt.keyCode === window.preview.ESC_KEYCODE) {
      if (focused === uploadFormDescription) {
        focused.blur();
      } else {
        closeOverlay();
      }
    }
  };

  var openOverlay = function () {
    uploadOverlay.classList.remove('hidden');
    uploadLevelElement.classList.add('hidden');
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

  var effectContainer = document.querySelector('.upload-effect__container');

  var filterDefault = function (percent) {
    effectLevelPinElement.style.left = percent + '%';
    effectLevelLineElement.style.width = percent + '%';
    uploadLevelInputElement.value = Math.round(percent);
  };

  var applyFilter = function (targetId) {
    if (targetId === "upload-effect-none") {
      uploadLevelElement.classList.add('hidden');
    } else {
      uploadLevelElement.classList.remove('hidden');
    }
    targetId = targetId.substr(7) + '';
    imagePreview.classList.add(targetId);
  };

  window.initializeFilters(effectContainer, checkFilter, filterDefault, applyFilter);

  // ---Изменение масштаба изображения

  var scaleElement = document.querySelector('.upload-resize-controls');

  var adjustScale = function(scale) {
    imagePreview.style.transform = 'scale(' + scale / 100 + ')';
  };

  window.initializeScale(scaleElement, adjustScale);

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

  // Ползунок фильтров

  function getCoordsScope (elem) {
    var box = elem.getBoundingClientRect();

    return {
      left: box.left,
      right: box.right
    };
  }

  function getCoordsPin (mouseX) {
    var scopeEffectLevelPin = getCoordsScope(scopeElement);
    var newPercent = (mouseX - scopeEffectLevelPin.left) * 100 / (scopeEffectLevelPin.right - scopeEffectLevelPin.left);

    if(newPercent > 0 && newPercent < 100) {
      effectLevelPinElement.style.left = newPercent + '%';
      effectLevelLineElement.style.width = newPercent + '%';
      uploadLevelInputElement.value = Math.round(newPercent);
    }
    return newPercent;
  }

  function checkFilter(newPercent) {
    var filterElements = uploadControlsElement.querySelectorAll('input[type="radio"]');
    for (var i = 0; i < filterElements.length; i++) {
      if (filterElements[i].checked) {
        var filter = filterElements[i].value;
        var filterValue;

        switch (filter) {
          case 'none':
            filterValue = 'none';
            break;
          case 'chrome':
            filterValue = 'grayscale(' + String(parseFloat(newPercent / 100).toFixed(2)) + ')';
            break;
          case 'sepia':
            filterValue = 'sepia(' + String(parseFloat(newPercent / 100).toFixed(2)) + ')';
            break;
          case 'marvin':
            filterValue = 'invert(' + String(newPercent) + '%)';
            break;
          case 'phobos':
            filterValue = 'blur(' + String(Math.round((newPercent * 3) / 100)) + 'px)';
            break;
          case 'heat':
            filterValue = 'brightness(' + String(parseFloat((newPercent * 3) / 100).toFixed(1)) + ')';
            break;
        }
        imagePreview.style.filter = filterValue;
        return;
      }
    }
  }

  effectLevelPinElement.addEventListener('mousedown', function (event) {
    event.preventDefault();

    var onMouseMove = function (moveEvent) {
      moveEvent.preventDefault();

      var newPercent = getCoordsPin(moveEvent.clientX);
      checkFilter(newPercent);
    };

    var onMouseUp = function (upEvent) {
      upEvent.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
