const now = new Date();
import { buildings } from './buildings.js?v=1.0.0';
// 地図の初期化
var map = L.map('map', {
  minZoom: 16, 
  maxZoom: 20  
}).setView([34.68717, 133.91987], 17);

// OpenStreetMapタイルの読み込み
/*L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxNativeZoom: 19,
  maxZoom: 20
}).addTo(map);*/

//マップの範囲
const bounds = [
    [34.68340, 133.91178], // 左下（SouthWest）の緯度・経度
    [34.69119, 133.92754]  // 右上（NorthEast）の緯度・経度
];
const maxBounds = [
  [34.68166, 133.90929], // 左下（少し外側）
  [34.69242, 133.92963]  // 右上（少し外側）
];

const overlay = L.imageOverlay('images/campus_map.webp', bounds,
  {opacity:1.0}
).addTo(map);

map.setMaxBounds(maxBounds);
map.options.maxBoundsViscosity = 1.0;

// アイコン設定
const ICON_SIZES = {
  small:  [40, 40],
  middle: [60, 60],
  big:    [80, 80]
};
function createCustomIcon(iconUrl, sizeType = 'middle') {
  const size = ICON_SIZES[sizeType] || ICON_SIZES.middle;
  return L.icon({
    iconUrl: iconUrl,
    iconSize: size,                       
    iconAnchor: [size[0] / 2, size[1]],   
    popupAnchor: [0, -size[1]]            
  });
}
const icons = {
  cafe:       createCustomIcon('icons/cafe.png', 'middle'),
  cafeterria: createCustomIcon('icons/cafeterria.png', 'middle'),
  library:    createCustomIcon('icons/library.png', 'middle'),
  genEdu:     createCustomIcon('icons/genEdu.png', 'middle'),
  eng:        createCustomIcon('icons/eng.png', 'middle'),
  sci:        createCustomIcon('icons/sci.png', 'middle'),
  hum:        createCustomIcon('icons/hum.png', 'middle'),
  agr:        createCustomIcon('icons/agr.png', 'middle'),
  edu:        createCustomIcon('icons/edu.png', 'middle'),
  pha:        createCustomIcon('icons/pha.png', 'middle'),
  etc:        createCustomIcon('icons/etc.png', 'middle')
};

// レイヤーグループ
const layers = {
  common: L.layerGroup(),
  genEdu: L.layerGroup(),
  eng: L.layerGroup(),
  sci: L.layerGroup(),
  hum: L.layerGroup(),
  agr: L.layerGroup(),
  edu: L.layerGroup(),
  pha: L.layerGroup(),
  etc: L.layerGroup()
}
layers.common.addTo(map);
layers.etc.addTo(map);
const symbolMarkers = {};

const markerMap = {};

// ポップアップHTML生成関数
function createPopupContent(building) {
  let bodyContent = '';

  if (building.type === 'floor_text' && building.floors) {
    const rows = building.floors.map(f => {
  // items が配列の場合は <br>（改行）でつなぐ、単なる文字列ならそのまま表示する（過去データとの互換性用）
  const infoHTML = Array.isArray(f.items) 
    ? f.items.join('<br>') 
    : (f.info || '');

  return `
    <div style="display: flex; border-bottom: 1px solid #e9ecef; padding: 6px 0; align-items: flex-start;">
      <!-- 左側：階数（1Fなど） -->
      <span style="font-weight: bold; width: 35px; color: #0078ff; flex-shrink: 0;">${f.floor}</span>
      <!-- 右側：施設名リスト（複数あれば勝手に改行されて揃う） -->
      <div style="color: #333; line-height: 1.4;">${infoHTML}</div>
    </div>
  `;
}).join('');
    
    bodyContent = `
      <div style="background: #f8f9fa; border-radius: 6px; padding: 4px 8px; font-size: 12px; margin-top: 6px;">
        ${rows}
      </div>
    `;
  }

  return `
    <div style="text-align: center; width: 190px; font-family: sans-serif;">
      <b style="font-size: 14px; color: #222;">${building.name}</b><br>
      ${building.image ? `<img src="${building.image}" alt="${building.name}" style="width: 100%; height: 95px; object-fit: cover; border-radius: 6px; margin-top: 6px;">` : ''}
      ${bodyContent}
    </div>
  `;
}

// データからピンを生成
buildings.forEach(building => {
  let icon;
  if (building.icon_size){
    const iconUrl = `icons/${building.category}.png`;
    icon = createCustomIcon(iconUrl,building.icon_size);
  }
  else{
    icon = icons[building.category] || icons.cafeterria;
  }
  const popupHTML = createPopupContent(building);
  let marker;
  // type === 'symbol'（まとめピン）の場合の処理
  if (building.type === 'symbol') {
    marker = L.marker((building.coordinate), { icon: icon })
      .addTo(layers.common)
      .bindPopup(popupHTML);
    symbolMarkers[building.category] = marker;

    // ピンをクリックした時にレイヤーを切り替える
    symbolMarkers[building.category].on('click', () => {
      map.removeLayer(symbolMarkers[building.category]); 
      map.addLayer(layers[building.category]);  
    });
  } 
  // 隠しピンの場合
  else {
    const targetLayer = layers[building.layerGroup] || layers.common;

    marker = L.marker((building.coordinate), { icon: icon })
      .addTo(targetLayer)
      .bindPopup(popupHTML);
  }
  markerMap[building.id] = marker;

  if (marker) {
    markerMap[building.id] = marker;
  }
});

const resetBtn = document.getElementById('reset-btn');

resetBtn.addEventListener('click', () => {
  
  const isEtcActive = map.hasLayer(layers.etc);
  Object.keys(layers).forEach(key => {
    if (map.hasLayer(layers[key])) {
      map.removeLayer(layers[key]);
    }
  });
    // 2. common レイヤー（共通表示のレイヤー）のみをマップに再追加
  if (layers['common']) {
    map.addLayer(layers['common']);
  }
  if (isEtcActive && layers['etc']) {
    map.addLayer(layers['etc']);
  }
});
//その他表示ボタン
const toggleEtcBtn = document.getElementById('toggle-etc-btn');
toggleEtcBtn.addEventListener('click', () => {
  if (map.hasLayer(layers.etc)) {
    map.removeLayer(layers.etc);
    toggleEtcBtn.classList.remove('active');
  } else {
    map.addLayer(layers.etc);
    toggleEtcBtn.classList.add('active');
  }
});

// 1. ページ読み込み時にサジェスト（datalist）を自動生成
const dataList = document.getElementById('building-list');

buildings.forEach(b => {
  //建物名を候補に追加
  const option = document.createElement('option');
  option.value = b.name;
  dataList.appendChild(option);

});

// 2. 検索実行関数
function searchBuilding() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();
  if (!query) return;

  // 建物名(name)にヒットするものを検索
  const target = buildings.find(b => {
    const matchName = b.name.toLowerCase().includes(query);
    return matchName;
  });

  if (target) {
    // 1. 検索されたピンの所属レイヤーがオフなら自動でマップに追加する
    const targetLayerGroup = target.layerGroup || target.category;
    if (symbolMarkers[targetLayerGroup] && map.hasLayer(symbolMarkers[targetLayerGroup])) {
      map.removeLayer(symbolMarkers[targetLayerGroup]);
    }
    if (layers[targetLayerGroup] && !map.hasLayer(layers[targetLayerGroup])) {
      map.addLayer(layers[targetLayerGroup]);
      
      // etcレイヤーだった場合はボタンの見た目もONにする
      if (targetLayerGroup === 'etc' && toggleEtcBtn) {
        toggleEtcBtn.classList.add('active');
      }
    }

    // 2. 該当の座標へ滑らかに移動 (coordinate: [lat, lng])
    map.flyTo(target.coordinate, 18, {
      duration: 1.0
    });

    // 3. マーカーを取得してカメラ移動に合わせてポップアップを開く
    map.once('moveend', () => {
      const targetMarker = markerMap[target.id];
      if (targetMarker) {
        targetMarker.openPopup();
      }
    });
  }
}

const searchInput = document.getElementById('search-input');
const clearBtn = document.getElementById('clear-btn');
// 1. 入力欄の文字変化を監視（文字があれば✕を表示、空なら非表示）
searchInput.addEventListener('input', () => {
  if (searchInput.value.length > 0) {
    clearBtn.style.display = 'block';
  } else {
    clearBtn.style.display = 'none';
  }
});
// 2. ✕ボタンが押されたら文字を全消しして入力欄にフォーカスを戻す
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  clearBtn.style.display = 'none';
  searchInput.focus(); // すぐ再入力できるようにフォーカスをあてる
});
// イベントリスナーの設定
document.getElementById('search-btn').addEventListener('click', searchBuilding);
document.getElementById('search-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchBuilding();
});
// 現在地を表示するためのマーカー（青円など）を保持する変数
let userLocationMarker = null;
let userLocationAccuracy = null;

// GPSボタンを取得してクリックイベントを設定
const gpsBtn = document.getElementById('gps-btn');

gpsBtn.addEventListener('click', () => {
  // ブラウザのGPS機能を起動（高精度モードON）
  map.locate({
    setView: true,     // 発見したらそこへ自動でカメラ移動
    maxZoom: 18,       // 移動時のズームレベル
    enableHighAccuracy: true // GPSの高精度モードを有効化
  });
});

// GPSで位置が取得できたときの処理
map.on('locationfound', (e) => {
  const radius = e.accuracy / 2; // 精度誤差の範囲（メートル）

  // すでに現在地マーカーが出ている場合は一度消す
  if (userLocationMarker) {
    map.removeLayer(userLocationMarker);
    map.removeLayer(userLocationAccuracy);
  }

  // 1. 誤差範囲を示す円を描画（うっすら青い円）
  userLocationAccuracy = L.circle(e.latlng, radius, {
    color: '#136AEC',
    fillColor: '#136AEC',
    fillOpacity: 0.15,
    stroke: false
  }).addTo(map);

  // 2. 現在地を示す青いドットマーカーを描画
  userLocationMarker = L.circleMarker(e.latlng, {
    radius: 8,
    color: '#ffffff',     // 枠線は白
    weight: 3,
    fillColor: '#007aff', // 中身はiOS風の青
    fillOpacity: 1.0
  }).addTo(map).bindPopup("現在地");
});

// GPS取得に失敗した場合のエラーハンドリング
map.on('locationerror', (e) => {
  alert("位置情報の取得に失敗しました。スマホの位置情報（GPS）設定やブラウザの権限を確認してください。");
});

// 座標取得機能（開発用）
/*map.on('click', function(e) {
  var lat = e.latlng.lat.toFixed(5);
  var lng = e.latlng.lng.toFixed(5);
  
  L.popup()
    .setLatLng(e.latlng)
    .setContent("クリックした場所の座標:<br>[" + lat + ", " + lng + "]")
    .openOn(map);
});*/