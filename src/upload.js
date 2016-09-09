/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

module.exports = function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-failed.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];
  var inputX = resizeForm.querySelector('#resize-x');
  var inputY = resizeForm.querySelector('#resize-y');
  var inputSide = resizeForm.querySelector('#resize-size');
  var buttonSubmit = resizeForm.querySelector('#resize-fwd');
  var resizeControls = document.querySelector('.upload-resize-controls');
  var inputs = document.querySelectorAll('.upload-resize-control');

  inputs.forEach(function(item) {
    item.addEventListener('input', function() {
      resizeFormIsValid();
    });
  });

  /**
   * Отправка в форму значений по-умолчанию смещения и размера кадра,
   * рассчитанных согласно размерам загружаемого изображения
   */
  function toAdjustResizer() {
    inputX.value = parseInt(currentResizer.getConstraint().x, 10);
    inputY.value = parseInt(currentResizer.getConstraint().y, 10);
    inputSide.value = parseInt(currentResizer.getConstraint().side, 10);
  }
  window.addEventListener('resizerchange', toAdjustResizer);


// Обновление объекта Resizer при изменении значений формы
  function updateResizer(e) {
    if (e.target.classList.contains('upload-resize-control')) {
      syncResizerWithForm();
      setValue();
    }
  }

  function syncResizerWithForm() {
    currentResizer.setConstraint(parseInt(inputX.value, 10), parseInt(inputY.value, 10), parseInt(inputSide.value, 10));
  }

// Изначальные значения полей из Resizer
  function setValue() {
    var inputSideValue = inputSide.value;
    if (inputSideValue < 0) {
      inputSideValue = 0;
    }

    inputX.max = currentResizer._image.naturalWidth - inputSideValue;
    inputY.max = currentResizer._image.naturalHeight - inputSideValue;
    inputX.min = 0;
    inputY.min = 0;
    inputSide.max = Math.min(currentResizer._image.naturalWidth, currentResizer._image.naturalHeight);
  }

  resizeControls.addEventListener('change', updateResizer, true);

  // Метод для проверки устанавливаемых начальных координат обрезанного изображения на неотрицательность
  function isPositiveNumber(val) {
    return (val > 0);
  }

  // Проверяем, не выходит ли правая сторона обрезанного изображения за свою первоначальную границу
  function isAllowedX(val) {
    var imageWidth = currentResizer._image.naturalWidth;
    return ((val) <= imageWidth);
  }

  // Проверяем, не выходит ли нижняя сторона обрезанного изображения за свою первоначальную границу
  function isAllowedY(val) {
    var imageHeight = currentResizer._image.naturalHeight;
    return ((val) <= imageHeight);
  }

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid() {
    var inputValueX = parseInt(inputX.value, 10);
    var inputValueY = parseInt(inputY.value, 10);
    var inputValueSide = parseInt(inputSide.value, 10);
    var croppedRightX = inputValueX + inputValueSide;
    var croppedBottomY = inputValueY + inputValueSide;

    if (isPositiveNumber(inputValueX) && isPositiveNumber(inputValueY) && isAllowedX(croppedRightX) && isAllowedY(croppedBottomY)) {
      buttonSubmit.removeAttribute('disabled');
      return true;
    }

    buttonSubmit.setAttribute('disabled', 'disabled');
    return false;
  }

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.addEventListener('change', function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.addEventListener('load', function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          hideMessage();
        });

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
        showMessage(Action.ERROR);
      }
    }
  });

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      var image = currentResizer.exportImage().src;
      var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
      for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].style.backgroundImage = 'url(' + image + ')';
      }

      filterImage.src = image;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  });

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  });

  // Рассчитываем срок хранения cookie исходя из текущей даты
  function toGetCookieLifeTime() {
    // Устанавливаем дату уничтожения cookie 9 декабря текущего года
    var now = new Date();
    var dayX = new Date();
    dayX.setMonth(11, 9);
    // Проверяем, был ли день уничтожения куков в текущем году
    if (dayX - now <= 0) {
      // Устанавливаем дату уничтожения cookie 9 декабря следующего года
      dayX.setFullYear(dayX.getFullYear() + 1, 11, 9);
    }

    // Срок хранения cookie в днях
    var cookieLifeTime = (dayX - now) / (24 * 3600 * 1000);
    return cookieLifeTime;
  }

  var expires = toGetCookieLifeTime();

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');

    var checkedInputValue = filterForm.querySelector('input[type="radio"]:checked').value;

    browserCookies.set('upload-filter', checkedInputValue, {expires: expires});

    cleanupResizer();
    updateBackground();
  });

  var filters = {
    'none': filterForm.querySelector('#upload-filter-none'),
    'chrome': filterForm.querySelector('#upload-filter-chrome'),
    'sepia': filterForm.querySelector('#upload-filter-sepia'),
    'marvin': filterForm.querySelector('#upload-filter-marvin')
  };

  var browserCookies = require('browser-cookies');
  var filterInCookie = browserCookies.get('upload-filter');

  getCookies();
  // В соответствии с записью, хранящейся в 'upload-filter' cookies,
  // если таковая имеется, выделяем соответствующий фильтр
  function getCookies() {
    if (filterInCookie) {
      filters[filterInCookie].setAttribute('checked', 'checked');
    }
  }

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  function toCheckFilter() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia',
        'marvin': 'filter-marvin'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  }

  toCheckFilter();
  filterForm.addEventListener('change', toCheckFilter);

  cleanupResizer();
  updateBackground();
};

