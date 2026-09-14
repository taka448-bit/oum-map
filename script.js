import { buildings } from './buildings.js';

// 地図の初期化
var map = L.map('map', {
  minZoom: 16, 
  maxZoom: 20  
}).setView([34.68717, 133.91987], 17);

// OpenStreetMapタイルの読み込み
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// アイコン設定
const icons = {
  cafe: L.icon({
    iconUrl: 'icons/cafe.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  cafeterria: L.icon({
    iconUrl: 'icons/cafeterria.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  library: L.icon({
    iconUrl: 'icons/library.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  genEdu: L.icon({
    iconUrl: 'icons/genEdu.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  }),
  eng: L.icon({
    iconUrl: 'icons/eng.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  })
};

// レイヤーグループ
const layers = {
  common: L.layerGroup(),
  genEdu: L.layerGroup(),
  eng: L.layerGroup()
}
layers.common.addTo(map);
const symbolMarkers = {};

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
  // b.category に応じたアイコンを取得（一致するものがなければ cafeterria をデフォルト指定）
  const icon = icons[building.category] || icons.cafeterria;
  const popupHTML = createPopupContent(building);
  // ★ type === 'symbol'（まとめピン）の場合の処理
  if (building.type === 'symbol') {
    symbolMarkers[building.category] = L.marker([building.lat, building.lng], { icon: icon })
      .addTo(layers.common)
      .bindPopup(popupHTML);

    // ピンをクリックした時にレイヤーを切り替える
    symbolMarkers[building.category].on('click', () => {
      map.removeLayer(symbolMarkers[building.category]); 
      map.addLayer(layers[building.category]);  
    });
  } 
  // 隠しピンの場合
  else {
    const targetLayer = layers[building.layerGroup] || layers.common;

    L.marker([building.lat, building.lng], { icon: icon })
      .addTo(targetLayer)
      .bindPopup(popupHTML);
  }
});

const resetBtn = document.getElementById('reset-btn');

resetBtn.addEventListener('click', () => {
    Object.keys(layers).forEach(key => {
        if (map.hasLayer(layers[key])) {
            map.removeLayer(layers[key]);
        }
    });
    // 2. common レイヤー（共通表示のレイヤー）のみをマップに再追加
    if (layers['common']) {
        map.addLayer(layers['common']);
    }
});

// 座標取得機能（開発用）
map.on('click', function(e) {
  var lat = e.latlng.lat.toFixed(5);
  var lng = e.latlng.lng.toFixed(5);
  
  L.popup()
    .setLatLng(e.latlng)
    .setContent("クリックした場所の座標:<br>[" + lat + ", " + lng + "]")
    .openOn(map);
});