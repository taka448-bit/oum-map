export const buildings = [
    //食堂・カフェ
  {
    id: "muscat",
    name: "マスカットユニオン",
    category: "cafeterria",
    type: "floor_text", 
    image: "images/muscat.jpg",
    lat: 34.68943,
    lng: 133.92047,
    floors: [
      { floor: "1F",
        items: ['ブックストア'] },
      { floor: "2F",
        items: ['学食'] },
      { floor: "3F",
        items: ['学食'] }
    ]
  },
  {
    id: "pione",
    name: "ピオーネユニオン",
    category: "cafeterria",
    type: "floor_text", 
    image: "images/pione.jpg",
    lat: 34.68934,
    lng: 133.92440,
    floors: [
      { floor: "1F",
        items: ['ショップ']},
      { floor: "2F",
        items: ['学食']}
    ]
  },
  {
    id: "peach",
    name: "ピーチユニオン",
    category: "cafeterria",
    type: "floor_text", 
    image: "images/peach.jpg",
    lat: 34.68731,
    lng: 133.92006,
    floors: [
      { floor: "1F",
        items: ['セブンイレブン','ピーチショップ']},
      { floor: "2F",
        items: ['学食']},
      { floor: "3F",
        items: ['学食']},
      { floor: "4F",
        items: ['レストラン']}
    ]
  },
  {
    id: "Uni_hall",
    name: "大学会館",
    category: "cafe",
    type: "floor_text", 
    image: "images/Uni_hall.jpg",
    lat: 34.68671,
    lng: 133.92052,
    floors: [
      { floor: "1F",
        items: ['喫茶 indent']}
    ]
  },
   {
    id: "J_cafe",
    name: "Junko Fukutake Terrace",
    category: "cafe",
    type: "floor_text", 
    image: "images/J_cafe.jpg",
    lat: 34.68526,
    lng: 133.91953,
    floors: [
      { floor: "1F",
        items: ['Junko Fukutake terrace'] }
    ]
  },
  //図書館
  {
    id: "library",
    name: "中央図書館",
    category: "library",
    type: "floor_text", 
    image: "images/library.jpg",
    lat: 34.68955,
    lng: 133.91983,
    floors: [
      { floor: "1F",
        items: ['図書館']}
    ]
  },
  //一般教育棟
  {
    id: "genEduBounds",
    name: "一般教育棟",
    category: "genEdu",
    type: "symbol", 
    lat: 34.68641,
    lng: 133.92206,
  },
  {
    id: "genEduBound_abc",
    name: "一般教育棟A・B・C棟",
    category: "genEdu",
    layerGroup: "genEdu",
    type: "floor_text", 
    lat: 34.68700,
    lng: 133.92200,
  },
  {
    id: "genEduBound_de",
    name: "一般教育棟D・E棟",
    category: "genEdu",
    layerGroup: "genEdu",
    type: "floor_text", 
    lat: 34.68614,
    lng: 133.92194,
  },
  //工学部棟
  {
    id: "engBounds",
    name: "工学部",
    category: "eng",
    type: "symbol", 
    lat: 34.68970,
    lng: 133.92253,
  },
  {
    id: "endBound_1",
    name: "工学部1号館",
    category: "eng",
    layerGroup: "eng",
    type: "floor_text", 
    lat: 34.68968,
    lng: 133.92157,
  },
  {
    id: "endBound_2",
    name: "工学部2号館",
    category: "eng",
    layerGroup: "eng",
    type: "floor_text", 
    lat: 34.68946,
    lng: 133.92258,
  },
  {
    id: "endBound_3",
    name: "工学部3号館",
    category: "eng",
    layerGroup: "eng",
    type: "floor_text", 
    lat: 34.68988,
    lng: 133.92277,
  },
  {
    id: "endBound_4",
    name: "工学部4号館",
    category: "eng",
    layerGroup: "eng",
    type: "floor_text", 
    lat: 34.69000,
    lng: 133.92339,
  },
  {
    id: "endBound_5",
    name: "工学部5号館",
    category: "eng",
    layerGroup: "eng",
    type: "floor_text", 
    lat: 34.68976,
    lng: 133.92360,
  },
  {
    id: "endBound_6",
    name: "工学部6号館",
    category: "eng",
    layerGroup: "eng",
    type: "floor_text", 
    lat: 34.68989,
    lng: 133.92437,
  }
];