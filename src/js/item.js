'use strict';

define(function() {
  var template = document.querySelector('template');
  var templateContainer = 'content' in template ? template.content : template;

  var item = templateContainer.querySelector('#products_section');

  // Добавление данных в шаблон
  var addDataToTemplate = function(itemParam) {
    // Обрезаем лишние нули в коде товара
    console.log(itemParam);
    var arrCode = itemParam.code.split('');
    for(var i = 0; i < arrCode.length; i++) {
      if(arrCode[i] === '0') {
        arrCode.shift();
        i--;
      }
    }
    itemParam.code = 'Код: ' + arrCode.join('');

    var nodeClone = item.cloneNode(true);

    nodeClone.querySelector('.product_code').textContent = itemParam.code;
    nodeClone.querySelector('.product_description').firstChild.textContent = itemParam.title;

    var arrAssocProd = itemParam.assocProducts.split('\n');
    var productTags = nodeClone.querySelector('.product_tags');

    var aTemplate = productTags.children[1];

    var addTextContentToA = function(arrItem) {
      var aClone = aTemplate.cloneNode(true);
      aClone.textContent = arrItem;
      return aClone;
    };

    arrAssocProd.forEach(function(assocItem) {
      productTags.appendChild(addTextContentToA(assocItem));
    });

    nodeClone.querySelector('.goldPrice').textContent = Math.ceil(itemParam.priceGoldAlt);
    nodeClone.querySelector('.retailPrice').textContent = Math.ceil(itemParam.priceRetailAlt);
    nodeClone.querySelector('.btn_cart').dataset.productId = itemParam.productId;

    var stepperUpDown = nodeClone.querySelector('.stepper');
    var steppeInput = nodeClone.querySelector('.stepper-input');

    var unitWrapper = nodeClone.querySelector('.unit--wrapper');

    var changePrice = function(param) {
      switch(param) {
        case 0:
          nodeClone.querySelector('.goldPrice').textContent = Math.ceil(itemParam.priceGold);
          nodeClone.querySelector('.retailPrice').textContent = Math.ceil(itemParam.priceRetail);
          steppeInput.value = 1;
          break;
        case 1:
          nodeClone.querySelector('.goldPrice').textContent = Math.ceil(itemParam.priceGoldAlt);
          nodeClone.querySelector('.retailPrice').textContent = Math.ceil(itemParam.priceRetailAlt);
          steppeInput.value = 1;
          break;
      }
    };

    // Переключение стоимости
    unitWrapper.addEventListener('click', function(event) {
      var target = event.target;
      if(target.parentNode !== nodeClone.querySelector('.unit--active')) {
        target.parentNode.classList.add('unit--active');
        if(target.parentNode.previousElementSibling) {
          target.parentNode.previousElementSibling.classList.remove('unit--active');
          changePrice(0);
        }
        if(target.parentNode.nextElementSibling) {
          target.parentNode.nextElementSibling.classList.remove('unit--active');
          changePrice(1);
        }
      }
    });
    // Изменение количества товаров
    function plusItem(price, arrow) {
      return price * arrow;
    }

    stepperUpDown.addEventListener('click', function(event) {
      var target = event.target;
      var wrapper = nodeClone.querySelector('.unit--wrapper').childNodes;
      console.log(wrapper[1].className);
      if(target.classList[1] === 'up') {
        steppeInput.value++;
        if(wrapper[1].className == 'unit--select unit--active') {
          nodeClone.querySelector('.goldPrice').textContent = plusItem( Math.ceil(itemParam.priceGoldAlt), steppeInput.value);
          nodeClone.querySelector('.retailPrice').textContent = plusItem( Math.ceil(itemParam.priceRetailAlt), steppeInput.value);
        } else {
          nodeClone.querySelector('.goldPrice').textContent = plusItem( Math.ceil(itemParam.priceGold), steppeInput.value);
          nodeClone.querySelector('.retailPrice').textContent = plusItem( Math.ceil(itemParam.priceRetail), steppeInput.value);
        }
      }
      if(target.classList[1] === 'down' && steppeInput.value >= 2) {
        steppeInput.value--;
        if(wrapper[1].className == 'unit--select unit--active') {
          nodeClone.querySelector('.goldPrice').textContent = plusItem( Math.ceil(itemParam.priceGoldAlt), steppeInput.value);
          nodeClone.querySelector('.retailPrice').textContent = plusItem( Math.ceil(itemParam.priceRetailAlt), steppeInput.value);
        } else {
          nodeClone.querySelector('.goldPrice').textContent = plusItem( Math.ceil(itemParam.priceGold), steppeInput.value);
          nodeClone.querySelector('.retailPrice').textContent = plusItem( Math.ceil(itemParam.priceRetail), steppeInput.value);
        } 
      }
    });

    // Загрузка картинок
    var img = new Image();

    img.onload = function(evt) {
      var nodeImg = nodeClone.querySelector('img');
      nodeImg.src = evt.target.src;
    };
    img.onerror = function() {
      console.log('Img load err!');
    };

    // Добавление строкового модификатора
    var arrToChange = itemParam.primaryImageUrl.split('.');
    var lastElem = arrToChange.pop();
    var firstElem = arrToChange.shift();
    var firstElemMod = firstElem + '.';
    var STR_MOD = '_220x220_1.';

    arrToChange.push(STR_MOD);
    arrToChange.push(lastElem);
    arrToChange.unshift(firstElemMod);

    var modifStr = arrToChange.join('');

    img.src = modifStr;

    return nodeClone;
  };
  return addDataToTemplate;
});