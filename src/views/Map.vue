<template>
  <div class="about">
    <h1>Vue map</h1>
    <p>
      Различные варианты карты
    </p>

    <h2>Реализация #1</h2>
    <span>Точек на карте - {{ dotsCounter }}</span><br/><br/>
    <button @click="one()">Карта с точкой</button>
    <button @click="ten()">Ещё 10 точек</button>
    <button @click="hundred()">Ещё 100 точек</button>
    <button @click="clustererHundred()">Ещё 100 точек в кластере</button>
    <button @click="threeThousand()">Ещё 3000 точек</button>
    <button @click="clustererthreeThousand()">Ещё 3000 точек в кластере</button>
    <button @click="centerMap()">centerMap</button>
    <button @click="clearMap()">clearMap</button>
    <br/><br/>
    <div id="map" style="width: 600px; height: 400px; border: 1px solid black"></div>

    <h2>Реализация #2</h2>
    <span>Точек на карте - {{ dots.length }}</span><br/><br/>
    <button @click="generatePoints(1)">Карта с точкой</button>
    <button @click="generatePoints(10)">Ещё 10 точек</button>
    <button @click="generatePoints(100)">Ещё 100 точек</button>
    <button @click="generate3000Points(3000)">Ещё 3000 точек</button>
    <button @click="removeDots()">clearMap</button>
    <br/><br/>
    <button @click="showMap = !showMap">Show Map = {{ showMap }}</button>
    <button @click="hideMap = !hideMap">Hide Map = {{ hideMap }}</button>
    <br/><br/>
    <button @click="filterType = ''">Show all</button>
    <button @click="filterType = 'type1'">Show type 1</button>
    <button @click="filterType = 'type2'">Show type 2</button>
    <br/><br/>

    <div class="map">
      <YaMap
        v-show="!hideMap"
        :showMap="showMap"
        :shops="dots"
        type="select"
        :objectManager="objectManager"
        :filterType="filterType"
        @shop-selected="alert($event);"
        ref="shops-map"/>
    </div>
  </div>
</template>
<script>
import { loadYmap } from 'vue-yandex-maps';
import YaMap from '../components/ya-map';

export default {
  components: { YaMap },
  data() {
    return {
      showMap: false,
      hideMap: true,
      objectManager: true,
      filterType: '',
      settings: {
        apiKey: '',
        lang: 'ru_RU',
        coordorder: 'latlong',
        version: '2.1',
      },
      dots: [],
      myMap: null,
      clusterer: null,
      center: [55.753215, 37.622504],
    };
  },
  async mounted() {
    await loadYmap({ debug: true });
  },
  computed: {
    dotsCounter() {
      let dots = 0;

      if (this.myMap) {
        if (this.clusterer) {
          dots = this.myMap.geoObjects.getLength() - 1 + this.clusterer.getGeoObjects().length;
        } else {
          dots = this.myMap.geoObjects.getLength();
        }
      }
      return dots;
    },
  },
  methods: {
    one() {
      this.addDots(1);
      this.centerMap();
    },
    ten() {
      this.addDots(10);
      this.centerMap();
    },
    hundred() {
      this.addDots(100);
      this.centerMap();
    },
    clustererHundred() {
      this.createClusterer();
      this.addDotsClusterer(100);
    },
    threeThousand() {
      this.addDots(3000);
      this.centerMap();
    },
    clustererthreeThousand() {
      let time = performance.now();
      this.createClusterer();
      this.addDotsClusterer(3000);
      time = (performance.now() - time) / 1000;

      alert(`Время выполнения - ${time.toFixed(2)} секунд`);
    },
    createMap() {
      // eslint-disable-next-line no-undef
      this.myMap = new ymaps.Map(
        'map',
        {
          zoom: 10,
          center: this.center,
          controls: [],
        },
        {
          searchControlProvider: 'yandex#search',
          yandexMapDisablePoiInteractivity: true,
          maxZoom: 16,
          minZoom: 2,
        },
      );
    },
    generateDot(coord) {
      // eslint-disable-next-line no-undef
      return new ymaps.Placemark(coord, {
        hintContent: 'hintContent',
        balloonContent: 'balloonContent',
      }, {
        iconLayout: 'default#image',
        iconImageHref: '/images/marker/pin_green.svg',
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
      });
    },
    addDots(counter) {
      if (!this.myMap) {
        this.createMap();
      }
      for (let i = 0; i < counter; i += 1) {
        const coords = [
          this.center[0] + ((Math.random() > 0.5) ? 1 : -1) * Math.random(),
          this.center[1] + ((Math.random() > 0.5) ? 1 : -1) * Math.random(),
        ];
        if (this.myMap) {
          this.myMap.geoObjects.add(this.generateDot(coords));
        }
      }
    },
    clearMap() {
      if (this.clusterer) {
        this.clusterer.removeAll();
        this.clusterer = null;
      }
      this.myMap.geoObjects.removeAll();
    },
    centerMap() {
      if (this.myMap) {
        this.myMap.setBounds(this.myMap.geoObjects.getBounds(), {
          checkZoomRange: true,
        });
      }
    },
    createClusterer() {
      if (!this.clusterer) {
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
        // eslint-disable-next-line no-undef
        this.clusterer = new ymaps.Clusterer(pointObjectSettings);
        if (!this.myMap) {
          this.createMap();
        }
        this.myMap.geoObjects.add(this.clusterer);
      }
    },
    addDotsClusterer(counter) {
      if (!this.myMap) {
        this.createMap();
      }
      for (let i = 0; i < counter; i += 1) {
        const coords = [
          this.center[0] + ((Math.random() > 0.5) ? 1 : -1) * Math.random(),
          this.center[1] + ((Math.random() > 0.5) ? 1 : -1) * Math.random(),
        ];
        if (this.myMap) {
          this.clusterer.add(this.generateDot(coords));
        }
      }
    },
    generatePoints(count) {
      const offset = this.dots.length;
      for (let i = offset; i < count + offset; i += 1) {
        this.dots.push(this.generatePointOM(i));
      }
    },
    generate3000Points(count) {
      let time = performance.now();
      const offset = this.dots.length;
      for (let i = offset; i < count + offset; i += 1) {
        this.dots.push(this.generatePointOM(i));
      }
      time = (performance.now() - time) / 1000;

      alert(`Время выполнения - ${time.toFixed(2)} секунд`);
    },
    generatePointOM(n) {
      const m = Math.random();
      return {
        type: 'Feature',
        id: n,
        geometry: {
          type: 'Point',
          coordinates: [
            this.center[0] + ((Math.random() > 0.5) ? 1 : -1) * Math.random(),
            this.center[1] + ((Math.random() > 0.5) ? 1 : -1) * Math.random(),
          ],
        },
        properties: {
          iconType: m > 0.5 ? 1 : 3,
          type: m > 0.5 ? 'type1' : 'type2',
          balloonContent: `Точка ${n}`,
          clusterCaption: `Точка ${n}`,
          hintContent: `Точка ${n}`,
          iconCaption: `Точка ${n}`,
        },
        options: { preset: 'islands#blueCircleDotIconWithCaption' },
      };
    },
    removeDots() {
      this.dots = [];
    },
  },
};
</script>
