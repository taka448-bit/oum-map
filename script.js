const now = new Date();
import { buildings } from './buildings.js?v=0.4.0';
// 地図の初期化
var map = L.map('map', {
  minZoom: 16, 
  maxZoom: 20  
}).setView([34.68717, 133.91987], 17);

// OpenStreetMapタイルの読み込み
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors',
  maxNativeZoom: 19,
  maxZoom: 20
}).addTo(map);

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
    iconSize: size,                       // 例: [28, 28]
    iconAnchor: [size[0] / 2, size[1]],   // ピンの足元（中央下）を座標の基準点にする
    popupAnchor: [0, -size[1]]            // ポップアップ位置を上にずらす
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
    symbolMarkers[building.category] = L.marker((building.coordinate), { icon: icon })
      .addTo(layers.common)
      .bindPopup(popupHTML);

    // ピンをクリックした時にレイヤーを切り替える
    symbolMarkers[building.category].on('click', () => {
      map.removeLayer(symbolMarkers[building.category]); 
      map.addLayer(layers[building.category]);  
    });

    markerMap[building.id] = marker;
  } 
  // 隠しピンの場合
  else {
    const targetLayer = layers[building.layerGroup] || layers.common;

    L.marker((building.coordinate), { icon: icon })
      .addTo(targetLayer)
      .bindPopup(popupHTML);
  }
  markerMap[building.id] = marker;
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
// buildings データが別ファイルにある場合は import しておきます
// import { buildings } from './buildings.js';

// 1. ページ読み込み時にサジェスト（datalist）を自動生成
const dataList = document.getElementById('building-list');

buildings.forEach(b => {
  // ① 建物名を候補に追加
  const option = document.createElement('option');
  option.value = b.name;
  dataList.appendChild(option);

  // ② フロア内のアイテム（'学食' や 'セブンイレブン' など）も候補に追加（重複除外）
  if (b.floors) {
    b.floors.forEach(f => {
      f.items.forEach(item => {
        // まだ datalist にないキーワードなら追加
        if (!Array.from(dataList.options).some(opt => opt.value === item)) {
          const itemOption = document.createElement('option');
          itemOption.value = item; // 'セブンイレブン' や '学食' など
          dataList.appendChild(itemOption);
        }
      });
    });
  }
});

// 2. 検索実行関数
function searchBuilding() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();
  if (!query) return;

  // 建物名(name) または 各階のアイテム(items) にヒットするものを検索
  const target = buildings.find(b => {
    // 建物名に含まれるか？
    const matchName = b.name.toLowerCase().includes(query);
    
    // または、いずれかの階の items に含まれるか？
    const matchItem = b.floors && b.floors.some(f => 
     Array.isArray(f.items) && f.items.some(item => item.toLowerCase().includes(query))
    );

    return matchName || matchItem;
  });

  if (target) {
    // 1. 検索されたピンの所属レイヤーがオフなら自動でマップに追加する
    const targetLayerGroup = target.layerGroup || target.category;
    if (layers[targetLayerGroup] && !map.hasLayer(layers[targetLayerGroup])) {
      map.addLayer(layers[targetLayerGroup]);
      
      // etcレイヤーだった場合はボタンの見た目もONにする
      if (targetLayerGroup === 'etc' && toggleEtcBtn) {
        toggleEtcBtn.classList.add('active');
      }
    }

    // 2. 該当の座標へ滑らかに移動 (coordinate: [lat, lng])
    map.flyTo(target.coordinate, 18, {
      duration: 1.2
    });

    // 3. マーカーを取得してカメラ移動に合わせてポップアップを開く
    const targetMarker = markerMap[target.id];
    if (targetMarker) {
      setTimeout(() => {
        targetMarker.openPopup();
      }, 400); // 0.4秒後にふわっと開く
    }
  } else {
    alert('該当する建物・施設が見つかりませんでした。');
  }
}

// イベントリスナーの設定
document.getElementById('search-btn').addEventListener('click', searchBuilding);
document.getElementById('search-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') searchBuilding();
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