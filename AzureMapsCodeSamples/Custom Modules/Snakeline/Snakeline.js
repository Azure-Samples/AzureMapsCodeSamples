import { Snakeline } from './SnakelineModule.js'

export default new function loadMap() {
  let map = new atlas.Map('map', {
    center: [-90, 40],
    zoom: 2,
    //Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps
    authOptions: {
      authType: 'subscriptionKey',
      subscriptionKey: 'fyPo4BWO5PvgFLPL6myK9wVWJrrxGcMjOi39FBGORh0'
    }
  });

  map.events.add('ready', () => {

    let lineString = new atlas.data.LineString([
      [
        -122.3382568359375,
        47.5394554474239
      ],
      [
        -122.2613525390625,
        47.36115300722623
      ],
      [
        -122.3712158203125,
        47.19717795172789
      ],
      [
        -122.7117919921875,
        47.12247581664114
      ],
      [
        -122.8216552734375,
        47.06263847995432
      ],
      [
        -122.9315185546875,
        46.773730730079386
      ],
      [
        -122.618408203125,
        46.50217348354072
      ],
      [
        -122.23388671874999,
        46.45678142812658
      ],
      [
        -121.83837890625,
        46.45678142812658
      ],
      [
        -121.58020019531249,
        46.60039303734547
      ],
      [
        -121.497802734375,
        46.7549166192819
      ],
      [
        -121.4483642578125,
        47.00273390667881
      ],
      [
        -121.39892578125,
        47.200910301521674
      ],
      [
        -121.4208984375,
        47.42065432071318
      ],
      [
        -121.322021484375,
        47.56911375866714
      ],
      [
        -121.10229492187501,
        47.57652571374621
      ],
      [
        -120.860595703125,
        47.52461999690651
      ],
      [
        -120.673828125,
        47.36115300722623
      ],
      [
        -120.4541015625,
        47.07760411715964
      ]
    ]);
    let polylineOptions = {
      strokeColor: 'red',
      strokeWidth: 5,
      filter: ['any', ['==', ['geometry-type'], 'LineString']]
    };

      map.setCamera({ center: [-121.69281005859375, 47.01958886438217], zoom: 7 });
      window.map = map;

      // snakeline module takes, map, the linestring, polylineoptions and animations duration
    window.snakeLine = new Snakeline(map, lineString, polylineOptions, 1000);
    });

    document.querySelector('#btnReplay').addEventListener('click', () => {
        window.snakeLine.replay(2000);
    });
}