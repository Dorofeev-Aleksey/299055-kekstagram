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
  var effectButtons = document.querySelectorAll('.upload-effect-input');
  var imagePreview = document.getElementById('effect-image-preview');

  var onEffectPress = function (evt) {
    for (i = 0; i < effectButtons.length; i++) {
      var effectClass = effectButtons[i].id;
      effectClass = effectClass.substr(7) + '';
      imagePreview.classList.remove(effectClass);

      if (evt.target.checked) {
        var newPercent = 100;
        checkFilter(newPercent);
        effectLevelPinElement.style.left = newPercent + '%';
        effectLevelLineElement.style.width = newPercent + '%';
        uploadLevelInputElement.value = Math.round(newPercent);

        var effectButtonsId = evt.target.id;
        if (effectButtonsId === "upload-effect-none") {
          uploadLevelElement.classList.add('hidden');
        } else {
          uploadLevelElement.classList.remove('hidden');
        }
        effectButtonsId = effectButtonsId.substr(7) + '';
        imagePreview.classList.add(effectButtonsId);
      }
    }
  };

  for (var i = 0; i < effectButtons.length; i++) {
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
