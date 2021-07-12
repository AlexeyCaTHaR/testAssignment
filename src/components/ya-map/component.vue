<style src="./ya-map.scss" lang="scss"></style>

<template>
  <div :class="{
    'block-blur': !mapData.length,
    'ya-map--detail': type === 'availability',
    'outscreen': !showMap
  }" class="ya-map"/>
</template>

<script>
import { loadYmap } from 'vue-yandex-maps';
import { iconPath } from './balloon';

let zoomLayout;

export default {
  name: 'YaMap',
  props: {
    shops: {
      type: Array,
      required: false,
      default: () => [],
    },
    url: {
      type: String,
      required: false,
      default: '',
    },
    apiKey: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    isEmpty: {
      type: Boolean,
      default: false,
    },
    objectManager: {
      type: Boolean,
      default: false,
    },
    showMap: {
      type: Boolean,
      default: true,
    },
    filterType: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      center: [55.753215, 37.622504],
      placemarks: [],
      controls: [],
      isMapReady: false,
      mapData: this.shops,
      myMap: null,
      // eslint-disable-next-line no-underscore-dangle
      uniqId: this._uid,
    };
  },
  created() {
    window[`mapPointObject-${this.uniqId}`] = {};
    window[`marks-${this.uniqId}`] = [];
  },
  async mounted() {
    await loadYmap({ apiKey: this.apiKey });
    if (!this.myMap) {
      this.getMapInfo();
    }
    this.$emit('map-initialized', this.myMap, window[`mapPointObject-${this.uniqId}`], window[`marks-${this.uniqId}`]);
  },
  computed: {
    isClusterer() {
      return !this.objectManager;
    },
  },
  methods: {
    getMapInfo() {
      // eslint-disable-next-line no-prototype-builtins
      this.createMap();
      this.createZoomlayout();
      this.addZoomControl();
      if (this.mapData.length) {
        this.addPlacemarks(this.mapData);
      }
      this.setMapCenter();
    },
    createMap() {
      // eslint-disable-next-line no-undef
      this.myMap = new ymaps.Map(
        this.$el,
        {
          zoom: 10, // масштаб будет установлен автоматически методом setBounds.
          center: this.center,
          controls: [],
        },
        {
          searchControlProvider: 'yandex#search',
          yandexMapDisablePoiInteractivity: true,
          maxZoom: 16,
          minZoom: 4,
        },
      );

      // Кастомный кластер или ObjectManager
      const pointObjectSettings = {
        clusterIcons: [
          {
            href: '/images/marker/cluster.svg',
            size: [40, 40],
            offset: [-20, -20],
          }],
        minClusterSize: 3,
        clusterHideIconOnBalloonOpen: false,
        geoObjectHideIconOnBalloonOpen: false,
      };

      if (this.isClusterer) {
        // eslint-disable-next-line no-undef
        window[`mapPointObject-${this.uniqId}`] = new ymaps.Clusterer(pointObjectSettings);
      } else {
        pointObjectSettings.clusterize = true;
        pointObjectSettings.trackObjects = false;
        // eslint-disable-next-line no-undef
        window[`mapPointObject-${this.uniqId}`] = new ymaps.ObjectManager(pointObjectSettings);
      }

      this.isMapReady = true;
    },

    addZoomControl() {
      // eslint-disable-next-line no-undef
      const zoomControl = new ymaps.control.ZoomControl({
        options: {
          layout: zoomLayout,
          float: 'none',
          position: {
            top: '20px',
            left: '20px',
          },
        },
      });
      this.myMap.controls.add(zoomControl);
    },

    createZoomlayout() {
      // eslint-disable-next-line no-underscore-dangle
      const _this = this;
      // eslint-disable-next-line no-undef
      zoomLayout = ymaps.templateLayoutFactory.createClass(
        '<div class="zoom-control">'
        + '<button type="button" class="zoom-button zoom-button-in">'
        + '</button>'
        + '<button type="button" class="zoom-button zoom-button-out">'
        + '</button>'
        + '</div>',
        {
          // Переопределяем методы макета, чтобы выполнять дополнительные действия
          // при построении и очистке макета.
          build() {
            // Вызываем родительский метод build.
            zoomLayout.superclass.build.call(this);

            // Начинаем слушать клики на кнопках макета.
            const thisBtnIn = _this.$el.querySelectorAll('.zoom-button-in');
            const thisBtnOut = _this.$el.querySelectorAll('.zoom-button-out');
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < thisBtnIn.length; ++i) {
              thisBtnIn[i].addEventListener(
                'click',
                // eslint-disable-next-line no-undef
                ymaps.util.bind(this.zoomIn, this),
              );
              thisBtnOut[i].addEventListener(
                'click',
                // eslint-disable-next-line no-undef
                ymaps.util.bind(this.zoomOut, this),
              );
            }
          },

          clear() {
            // Снимаем обработчики кликов.
            const thisBtnIn = _this.$el.querySelectorAll('.zoom-button-in');
            const thisBtnOut = _this.$el.querySelectorAll('.zoom-button-out');
            // eslint-disable-next-line no-plusplus
            for (let i = 0; i < thisBtnIn.length; ++i) {
              thisBtnIn[i].removeEventListener('click', this.zoomIn);
              thisBtnOut[i].removeEventListener('click', this.zoomOut);
            }

            // Вызываем родительский метод clear.
            zoomLayout.superclass.clear.call(this);
          },

          zoomIn() {
            const map = this.getData()
              .control
              .getMap();
            // Генерируем событие, в ответ на которое
            // элемент управления изменит коэффициент масштабирования карты.
            map.setZoom(map.getZoom() + 1, { checkZoomRange: true });
          },

          zoomOut() {
            const map = this.getData()
              .control
              .getMap();
            map.setZoom(map.getZoom() - 1, { checkZoomRange: true });
          },
        },
      );
    },

    addPlacemarks(placemarks) {
      // eslint-disable-next-line no-underscore-dangle
      const _this = this;
      const selfMyMap = _this.myMap;
      let placemark = {};
      let placemarkOptions;

      // eslint-disable-next-line func-names
      const getPointOptions = function () {
        return {
          iconLayout: 'default#image',
          iconImageSize: [30, 44],
          iconImageOffset: [-15, -44],
          hideIcon: false,
          balloonImageHref: '',
          balloonContentSize: [300, 140],
          balloonOffset: [-96, -18],
          balloonImageSize: [300, 0],
          balloonShadow: false,
          hideIconOnBalloonOpen: false,
          balloonPanelMaxMapArea: 0,
        };
      };

      if (!selfMyMap) {
        return;
      }

      window[`marks-${this.uniqId}`] = {
        type: 'FeatureCollection',
        features: [],
      };

      // eslint-disable-next-line no-plusplus
      for (let n = 0; n < placemarks.length; n++) {
        placemark = placemarks[n];
        const pointOptions = getPointOptions();

        pointOptions.iconImageHref = iconPath(placemark.properties.iconType);

        pointOptions.pointType = placemark.type;

        pointOptions.address = placemark.address;
        pointOptions.name = placemark.name;
        pointOptions.code = placemark.code;
        pointOptions.statusStr = placemark.statusStr;
        pointOptions.id = placemark.id;

        // В балуне есть радиокнопка
        if (_this.type === 'select') {
          placemark.isSelectable = true;
        }

        // В балуне кнопка 'Забрать здесь'
        if (_this.type === 'availability') {
          placemark.isAvailability = true;
        }

        window[`marks-${this.uniqId}`].features.push({
          type: 'Feature',
          id: n,
          geometry: placemark.geometry,
          properties: placemark.properties,
          'balloon ': pointOptions,
          options: {
            ...pointOptions,
          },
        });
      }

      if (_this.type === 'selectedShop') {
        selfMyMap.geoObjects.events.add('click', (e) => {
          e.preventDefault();
        });
      } else if (_this.type === 'select') {
        // Открытие балуна при клике на пин (для ObjectManager)
        if (!this.isClusterer) {
          window[`mapPointObject-${_this.uniqId}`].objects.events.add('click', (e) => {
            const objectId = e.get('objectId');
            const object = window[`mapPointObject-${_this.uniqId}`].objects.getById(objectId);

            if (object.properties.balloonContent) {
              let balloonLabel = null;
              placemarkOptions = object.options;
              setTimeout(() => {
                balloonLabel = _this.$el.querySelector('.js-select-shop');
                balloonLabel.addEventListener('click', () => {
                  _this.shopSelected(placemarkOptions.code, placemarkOptions.id);
                }, false);
              }, 500);
            }
          });
        }

        // Открытие балуна при клике на пин
        selfMyMap.geoObjects.events.add('click', (e) => {
          const target = e.get('target');
          if (target.balloon) {
            target.balloon.open();
            let balloonLabel = null;
            placemarkOptions = target.options;
            setTimeout(() => {
              balloonLabel = _this.$el.querySelector('.js-select-shop');
              balloonLabel.addEventListener('click', () => {
                _this.shopSelected(placemarkOptions.get('code'), placemarkOptions.get('id'));
              }, false);
            }, 500);
          }
        });
      } else {
        // Открытие балуна при наведении на пин
        selfMyMap.geoObjects.events.add('mouseenter', (e) => {
          const target = e.get('target');
          if (target.balloon) {
            target.balloon.open();
            let buttonSelect = null;
            placemarkOptions = target.options;
            setTimeout(() => {
              buttonSelect = _this.$el.querySelector('.js-open-bz');
              buttonSelect.addEventListener('click', () => {
                _this.openFastOrder(placemarkOptions.get('code'));
              }, false);
            }, 500);
          }
        });
        selfMyMap.balloon.events.add('mouseout', () => {
          selfMyMap.balloon.close();
        });
        selfMyMap.events.add('mousemove', () => {
          selfMyMap.balloon.close();
        });
      }

      window[`mapPointObject-${this.uniqId}`].add(window[`marks-${this.uniqId}`]);
      selfMyMap.geoObjects.add(window[`mapPointObject-${this.uniqId}`]);

      this.setMapCenter();

      this.isMapReady = true;
      this.removeMarks();
    },

    updateMap() {
      if (this.myMap) {
        this.myMap.destroy();
        this.isMapReady = false;
        this.getMapInfo();
        if (!this.isClusterer && this.filterType) {
          this.doFilter(this.filterType);
        }
      }
    },
    async shopSelected(code, id) {
      this.$emit('shop-selected', code, id);
    },
    async openFastOrder(shopCode) {
      await this.initFastOrder(this.size);
      this.selectTabWay('pickup');
      this.updateSelectedShop(shopCode);
      this.updateObtaining('pickup');
      this.setAvailablePayments(this.selectedObtaining.availablePayments);
    },
    /**
     * Фильтруем точки по типу
     * @param value
     * @returns {function(*)}
     */
    filterPoints(value) {
      // eslint-disable-next-line func-names
      return function (point) {
        return point.properties
          && point.properties.type
          && point.properties.type === value;
      };
    },
    /**
     * Устанавливаем центр карты
     */
    setMapCenter() {
      const center = window[`mapPointObject-${this.uniqId}`].getBounds();
      // eslint-disable-next-line no-unused-expressions
      center && this.myMap.setBounds(center, {
        checkZoomRange: true,
      });
    },
    /**
     * Удаляем временную коллекцию точек на карте
     */
    removeMarks() {
      if (this.isClusterer) {
        window[`marks-${this.uniqId}`].splice(0, window[`marks-${this.uniqId}`].length);
      } else {
        delete window[`marks-${this.uniqId}`];
      }
    },

    doFilter(value) {
      if (window[`mapPointObject-${this.uniqId}`] && typeof window[`mapPointObject-${this.uniqId}`].setFilter === 'function') {
        window[`mapPointObject-${this.uniqId}`].setFilter(value ? this.filterPoints(value) : 'true');
        this.setMapCenter();
      }
    },
  },
  watch: {
    shops(value) {
      this.mapData = value;
      this.updateMap();
    },
    /**
     * Фильтрация точек на карте
     * @param value функция фильтрации или строка
     */
    filterType(value) {
      this.doFilter(value);
    },
  },
  beforeDestroy() {
    this.removeMarks();
    if (this.myMap) {
      this.myMap.geoObjects.removeAll();
      this.myMap.destroy();
      delete this.myMap;
      delete window[`mapPointObject-${this.uniqId}`];
    }
  },
};
</script>
