const iconPath = (type) => {
  let path = '';

  switch (type) {
    case 1:
      path = '/images/marker/pin_green.svg';
      break;
    case 2:
      path = '/images/marker/pin_green-yellow.svg';
      break;
    case 3:
      path = '/images/marker/pin_yellow.png';
      break;
    default:
      path = '/images/marker/pin_green.svg';
  }

  return path;
};

const getNumbers = (phone) => {
  let telParam = '';
  if (phone.substring(0, 2) === '+7') {
    telParam += '+';
  }
  telParam += phone.replace(/\D/g, '');
  return telParam;
};

const balloonContent = (placemark, ...data) => {
  let phones = '';

  if ('phones' in placemark && placemark.phones.length > 0) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < placemark.phones.length; i++) {
      phones
        += `<a href="tel:${
          getNumbers(placemark.phones[i])
        }">${
          placemark.phones[i]
        }</a>`;
    }
  }

  let metro = '';
  if (placemark.metro) {
    metro = `${'<div class="balloon-content__shop-metro">'
      + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 10" height="10" width="14" fill="'}${
      placemark.metro.color
    }">`
      + '<polygon points="9.869 0 7 5.36 4.131 0 0.867 8.706 0 8.706 0 9.901 4.543 9.901 4.543 8.706 3.781 8.706 4.725 5.99 7 10 9.275 5.99 10.219 8.706 9.457 8.706 9.457 9.901 14 9.901 14 8.706 13.133 8.706 9.869 0"></polygon>'
      + `</svg>${
        placemark.metro.station
      }</div>`;
  }

  let available = '';
  if ('available' in placemark) {
    available = `${'<div class="balloon-content__available">В наличии '
      + '<div class="available available--'}${
      placemark.available[0]
    }">`
      + '<span class="available-dot"></span>'
      + '<span class="available-dot"></span>'
      + '<span class="available-dot"></span>'
      + '<span class="available-dot"></span>'
      + `<span class="available-text">${
        placemark.available[1]
      }</span>`
      + '</div>'
      + '</div>';
  }

  let someData = '';
  data.forEach((item) => {
    someData += `<p>${item.name}: ${item.value}</p>`;
  });

  let radio = '';
  if (placemark.isSelectable) {
    radio = '<label class="balloon-content__shop-select js-select-shop">Выбрать</label>';
  }

  let button = '';
  if (placemark.isAvailability) {
    button = '<button class="balloon-content__btn-selected link link--blue js-open-bz">Забрать здесь</button>';
  }

  let floor = '';
  if (placemark.floor && placemark.floor.str) {
    floor = `<span class="balloon-content__floor">&nbsp;/&nbsp;${placemark.floor.str}</span>`;
  }

  let workTime = '';
  if (placemark.workScheduleText) {
    workTime = `<div class="balloon-content__shop-work-time">${placemark.workScheduleText}</div>`;
  }

  let name = '';
  if (placemark.name) {
    name = `<div class="balloon-content__shop-name">${placemark.name}</div>`;
  }

  let address = '';
  if (placemark.address) {
    address = `<div class="balloon-content__shop-address">${placemark.address}</div>`;
  }

  let type = '';
  if (placemark.type.name) {
    type = `<div class="balloon-content__shop-type">${placemark.type.name}${floor}</div>`;
  }

  let pinType = '';
  switch (placemark.type.id) {
    case 2:
      pinType = 'pin-green-yellow';
      break;
    case 3:
      pinType = 'pin-yellow';
      break;
    default:
      pinType = 'pin-green';
  }

  const balloonContentText = `<div class="balloon-content ${pinType}">`
    + '<div class="balloon-content__inner">'
    + `<div class="balloon-content__head-row">${
      name
    }${radio
    }</div>${
      type
    }${metro
    }${available
    }${address
    }${workTime
    }<div class="balloon-content__shop-tel">${
      phones
    }</div>${
      someData
    }${button
    }</div>`
    + '</div>';

  return balloonContentText;
};

export { balloonContent, iconPath };
