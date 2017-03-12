'use strict';

define(['./item.js', './load'], function(addDataToTemplate, load) {
  var PIC_URL = 'http://localhost:1507/api';

  var itemsContainer = document.querySelector('.product__area');

  // Отрисовка товаров
  function renderItems(items) {
    items.forEach(function(itemParam) {
      itemsContainer.appendChild(addDataToTemplate(itemParam));
    });
  };

  // Загрузка JSON массива
  load(PIC_URL, renderItems);
});