import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Flame, Droplet, Star, Trophy, RotateCcw, Volume2, VolumeX, ShieldCheck, Heart, Sparkles, HelpCircle, Smile, Wrench } from 'lucide-react';
import { Difficulty, StageId, Fire, GameState, GameStats, CharacterId } from '../types';
import { sound } from '../utils/sound';
import { speech } from '../utils/speech';
import MarshallSpeechBubble from './MarshallSpeechBubble';
import FireTruck from './FireTruck';
import FireItem from './FireItem';
import WaterSprayCanvas from './WaterSprayCanvas';
import { Citizen } from './Citizen';
import SkyeRescueHoist from './SkyeRescueHoist';
import RubbleDebrisClearPanel from './RubbleDebrisClearPanel';
import MarshallFireFightPanel from './MarshallFireFightPanel';
import ChaseTrafficControlPanel from './ChaseTrafficControlPanel';
import SkyeRescuePanel from './SkyeRescuePanel';

// Cute interactive citizens with coordinate mappings (on the sidewalk/above road level)
const CITIZEN_DATA = [
  { id: 'c1', type: 'boy', x: 20, y: 71 },
  { id: 'c2', type: 'girl', x: 35, y: 73 },
  { id: 'c3', type: 'cat', x: 48, y: 74 },
  { id: 'c4', type: 'mayor', x: 64, y: 72 },
  { id: 'c5', type: 'boy', x: 78, y: 73 },
  { id: 'c6', type: 'girl', x: 91, y: 71 }
];

interface StageConfig {
  id: StageId;
  name: string;
  emoji: string;
  bgImage: string;
  slogan: string;
  themeColor: string;
}

const STAGES: StageConfig[] = [
  {
    id: 'town',
    name: 'いつもの街（まち）',
    emoji: '🏡',
    bgImage: '/src/assets/images/cartoon_town_bg_1783836636457.jpg',
    slogan: 'おなじみの街で、火災（かさい）しゅつどう！',
    themeColor: 'from-sky-400 to-sky-600 border-sky-500',
  },
  {
    id: 'mountain',
    name: '山あそび広場（やま）',
    emoji: '🌲',
    bgImage: '/src/assets/images/mountain_bg_1783950473688.jpg',
    slogan: 'みどりのやまごやや、キャンプ場をまもろう！',
    themeColor: 'from-emerald-500 to-green-600 border-emerald-600',
  },
  {
    id: 'sea',
    name: 'ビーチリゾート（うみ）',
    emoji: '🏖️',
    bgImage: '/src/assets/images/sea_bg_1783950486624.jpg',
    slogan: 'あおい海とすなはまで、ヨットやうみのいえを消火！',
    themeColor: 'from-amber-400 to-orange-500 border-amber-500',
  },
  {
    id: 'metro',
    name: 'にぎやか大都会（とかい）',
    emoji: '🏙️',
    bgImage: '/src/assets/images/metro_bg_1783950501226.jpg',
    slogan: 'たかいこうそうビルや、スポーツカーをまもろう！',
    themeColor: 'from-indigo-500 to-purple-600 border-indigo-600',
  },
];

const STAGE_BUILDING_TEMPLATES: Record<StageId, {
  house: { name: string; maxSize: number }[];
  tree: { name: string; maxSize: number }[];
  car: { name: string; maxSize: number }[];
  shop: { name: string; maxSize: number }[];
  trash: { name: string; maxSize: number }[];
}> = {
  town: {
    house: [
      { name: 'おうち', maxSize: 1.1 },
      { name: 'あおいおうち', maxSize: 1.1 },
      { name: 'ようちえん', maxSize: 1.15 },
      { name: 'おおきなおうち', maxSize: 1.2 }
    ],
    tree: [
      { name: 'こうえんのき', maxSize: 1.1 },
      { name: 'おおきなき', maxSize: 1.25 },
      { name: 'ひろばのき', maxSize: 1.2 },
      { name: 'ちいさなき', maxSize: 0.95 }
    ],
    car: [
      { name: 'きゅうきゅうしゃ', maxSize: 1.0 },
      { name: 'パトカー', maxSize: 1.0 },
      { name: 'あおいくるま', maxSize: 1.0 },
      { name: 'あかいトラック', maxSize: 1.05 }
    ],
    shop: [
      { name: 'パンやさん', maxSize: 1.15 },
      { name: 'くだものやさん', maxSize: 1.15 },
      { name: 'ケーキやさん', maxSize: 1.15 },
      { name: 'としょかん', maxSize: 1.2 }
    ],
    trash: [
      { name: 'ごみばこ', maxSize: 0.9 },
      { name: 'ゆうびんばこ', maxSize: 0.9 },
      { name: 'ベンチ', maxSize: 0.85 },
      { name: 'ガソリンスタンド', maxSize: 1.2 }
    ]
  },
  mountain: {
    house: [
      { name: 'キャンプのテント', maxSize: 1.1 },
      { name: 'やまごや', maxSize: 1.15 },
      { name: 'ロッジ', maxSize: 1.2 }
    ],
    tree: [
      { name: 'あかいもみじ', maxSize: 1.1 },
      { name: 'おおきなマツのき', maxSize: 1.25 },
      { name: 'どんぐりのき', maxSize: 1.1 }
    ],
    car: [
      { name: 'キャンピングカー', maxSize: 1.1 },
      { name: 'マウンテンバイク', maxSize: 0.9 }
    ],
    shop: [
      { name: 'キャンプじょう受付', maxSize: 1.15 },
      { name: 'おみやげやさん', maxSize: 1.15 }
    ],
    trash: [
      { name: 'キャンプファイヤー', maxSize: 1.1 },
      { name: 'キャンプのコンロ', maxSize: 0.95 },
      { name: 'バーベキューこんろ', maxSize: 1.0 }
    ]
  },
  sea: {
    house: [
      { name: 'うみのいえ', maxSize: 1.15 },
      { name: 'とうだい', maxSize: 1.25 }
    ],
    tree: [
      { name: 'ヤシのき', maxSize: 1.2 },
      { name: 'ちいさなヤシのき', maxSize: 1.0 },
      { name: 'ハイビスカス', maxSize: 0.9 }
    ],
    car: [
      { name: 'ヨット', maxSize: 1.1 },
      { name: 'モーターボート', maxSize: 1.0 },
      { name: 'ビーチバギー', maxSize: 1.0 }
    ],
    shop: [
      { name: 'サーフショップ', maxSize: 1.15 },
      { name: 'アイスクリームや', maxSize: 1.15 }
    ],
    trash: [
      { name: 'ビーチパラソル', maxSize: 1.1 },
      { name: 'うきわスタンド', maxSize: 0.95 },
      { name: 'やしの実ボックス', maxSize: 0.9 }
    ]
  },
  metro: {
    house: [
      { name: 'こうそうビル', maxSize: 1.25 },
      { name: 'タワーマンション', maxSize: 1.25 },
      { name: 'ニュースセンター', maxSize: 1.2 }
    ],
    tree: [
      { name: 'まちのじゅもく', maxSize: 1.1 },
      { name: 'きれいにそろったき', maxSize: 1.0 }
    ],
    car: [
      { name: 'スポーツカー', maxSize: 1.0 },
      { name: 'ちかてつのいりぐち', maxSize: 1.1 },
      { name: '２かいだてバス', maxSize: 1.15 }
    ],
    shop: [
      { name: 'デパート', maxSize: 1.25 },
      { name: 'おもちゃやさん', maxSize: 1.15 },
      { name: 'ハイテクショップ', maxSize: 1.2 }
    ],
    trash: [
      { name: 'あかるいじどうはんばいき', maxSize: 1.0 },
      { name: 'でんしんばしら', maxSize: 1.05 },
      { name: 'デジタルかんばん', maxSize: 1.1 }
    ]
  }
};

const CHASE_TARGET_TEMPLATES: Record<StageId, {
  lost_kitten: { name: string; maxSize: number }[];
  injured_boy: { name: string; maxSize: number }[];
  lost_girl: { name: string; maxSize: number }[];
  puppy_tree: { name: string; maxSize: number }[];
  lost_keys: { name: string; maxSize: number }[];
}> = {
  town: {
    lost_kitten: [{ name: 'まいごのこねこちゃん', maxSize: 1.15 }],
    injured_boy: [{ name: 'すりむいたおとకొのこ', maxSize: 1.15 }],
    lost_girl: [{ name: 'まいごのおんなのこ', maxSize: 1.15 }],
    puppy_tree: [{ name: 'きからおりられないこいぬ', maxSize: 1.2 }],
    lost_keys: [{ name: 'おとしもののゴールドキー', maxSize: 1.05 }]
  },
  mountain: {
    lost_kitten: [{ name: 'もりのまいごのこねこ', maxSize: 1.15 }],
    injured_boy: [{ name: 'あしをすりむいたおとこのこ', maxSize: 1.15 }],
    lost_girl: [{ name: 'まいごのハイキングガール', maxSize: 1.15 }],
    puppy_tree: [{ name: 'いわのうえのこいぬ', maxSize: 1.2 }],
    lost_keys: [{ name: 'なくしたキャンプのカギ', maxSize: 1.05 }]
  },
  sea: {
    lost_kitten: [{ name: 'ビーチのまいごのこねこ', maxSize: 1.15 }],
    injured_boy: [{ name: 'すなはまでころんだおとこのこ', maxSize: 1.15 }],
    lost_girl: [{ name: 'まいごのビーチガール', maxSize: 1.15 }],
    puppy_tree: [{ name: 'やしのきにのぼったこいぬ', maxSize: 1.2 }],
    lost_keys: [{ name: 'なくしたボートのカギ', maxSize: 1.05 }]
  },
  metro: {
    lost_kitten: [{ name: 'ビルのすきまのこねこ', maxSize: 1.15 }],
    injured_boy: [{ name: 'スケボーでころんだおとこのこ', maxSize: 1.15 }],
    lost_girl: [{ name: 'ちかてつのまいごのおんなのこ', maxSize: 1.15 }],
    puppy_tree: [{ name: 'たかいベンチのこいぬ', maxSize: 1.2 }],
    lost_keys: [{ name: 'なくしたスポーツカーのカギ', maxSize: 1.05 }]
  }
};

const SKYE_TARGET_TEMPLATES: Record<StageId, {
  trapped_high: { name: string; maxSize: number }[];
  cliff_rescue: { name: string; maxSize: number }[];
  tree_rescue: { name: string; maxSize: number }[];
  rooftop_rescue: { name: string; maxSize: number }[];
  balloon_rescue: { name: string; maxSize: number }[];
}> = {
  town: {
    trapped_high: [{ name: 'こうえんのすべり台のてっぺんのおとこのこ', maxSize: 1.15 }],
    cliff_rescue: [{ name: 'かいだんの下でこまっているおばあちゃん', maxSize: 1.15 }],
    tree_rescue: [{ name: 'こうえんの木の上でなけないこいぬ', maxSize: 1.2 }],
    rooftop_rescue: [{ name: 'デパートのやねの上からおりられないねこ', maxSize: 1.15 }],
    balloon_rescue: [{ name: '風船でとおくへ浮いてしまった女の子', maxSize: 1.1 }]
  },
  mountain: {
    trapped_high: [{ name: 'いわやまのてっぺんのハイカーさん', maxSize: 1.15 }],
    cliff_rescue: [{ name: '崖の下でうごけないおんなのこ', maxSize: 1.15 }],
    tree_rescue: [{ name: 'もりのマツの木の上でなけないこねこ', maxSize: 1.2 }],
    rooftop_rescue: [{ name: 'キャンプ場のテントの上でふるえるウサギ', maxSize: 1.15 }],
    balloon_rescue: [{ name: '風船にのったまま風でとんだこいぬ', maxSize: 1.1 }]
  },
  sea: {
    trapped_high: [{ name: 'てんぼうだいのうえで風にふかれるおとこのこ', maxSize: 1.15 }],
    cliff_rescue: [{ name: 'うみべの崖の下でうごけないカニさん', maxSize: 1.15 }],
    tree_rescue: [{ name: 'ヤシの木の上からおりられないインコさん', maxSize: 1.2 }],
    rooftop_rescue: [{ name: 'とうだいのてっぺんのまいごのこども', maxSize: 1.15 }],
    balloon_rescue: [{ name: '風船でビーチの上空にうかんだ女の子', maxSize: 1.1 }]
  },
  metro: {
    trapped_high: [{ name: 'こうそうビルのヘリポートのおとこのこ', maxSize: 1.15 }],
    cliff_rescue: [{ name: 'ちかてつの階段の下でうごけないおじいちゃん', maxSize: 1.15 }],
    tree_rescue: [{ name: 'たかい街路樹の上でなけないこねこ', maxSize: 1.2 }],
    rooftop_rescue: [{ name: 'バスのやねの上でうごけないワンちゃん', maxSize: 1.15 }],
    balloon_rescue: [{ name: 'デパートの風船売り場から浮いたこども', maxSize: 1.1 }]
  }
};

const RUBBLE_TARGET_TEMPLATES: Record<StageId, {
  heavy_rock: { name: string; maxSize: number }[];
  debris: { name: string; maxSize: number }[];
  collapsed_tree: { name: string; maxSize: number }[];
  blocked_tunnel: { name: string; maxSize: number }[];
  bridge_disaster: { name: string; maxSize: number }[];
}> = {
  town: {
    heavy_rock: [{ name: 'こうえんの入り口をふさぐ おおきな岩', maxSize: 1.2 }],
    debris: [{ name: 'どうろに崩れた れんがのガレキの山', maxSize: 1.15 }],
    collapsed_tree: [{ name: 'たおれた 街路樹のたいぼく', maxSize: 1.25 }],
    blocked_tunnel: [{ name: 'がけくずれでふさがった 秘密のトンネル', maxSize: 1.2 }],
    bridge_disaster: [{ name: 'かわにかかる こわれた木のまちはし', maxSize: 1.15 }]
  },
  mountain: {
    heavy_rock: [{ name: 'ハイキングコースをふさぐ 巨大な岩石', maxSize: 1.2 }],
    debris: [{ name: 'キャンプ場をおそった どしゃくずれのガレキ', maxSize: 1.15 }],
    collapsed_tree: [{ name: 'とざんどうにたおれた おおきなマツの木', maxSize: 1.25 }],
    blocked_tunnel: [{ name: 'いわでふさがった 鉱山のトンネルいりぐち', maxSize: 1.2 }],
    bridge_disaster: [{ name: 'たににかかる こわれたつりばし', maxSize: 1.15 }]
  },
  sea: {
    heavy_rock: [{ name: 'ひがたのすなはまに転がってきた 岩石', maxSize: 1.2 }],
    debris: [{ name: 'うみのいえのまえに崩れた サンゴのガレキ', maxSize: 1.15 }],
    collapsed_tree: [{ name: 'あらしでたおれた おおきなヤシの木', maxSize: 1.25 }],
    blocked_tunnel: [{ name: 'なみでふさがった 海底どうくつのいりぐち', maxSize: 1.2 }],
    bridge_disaster: [{ name: 'さんばしにかかる こわれたうみの木ばし', maxSize: 1.15 }]
  },
  metro: {
    heavy_rock: [{ name: 'ちかてつのいりぐちをふさぐ コンクリート塊', maxSize: 1.2 }],
    debris: [{ name: 'ビルこうじげんばから崩れた 鉄骨とガレキの山', maxSize: 1.15 }],
    collapsed_tree: [{ name: 'ビルのかぜでたおれた けやきの大木', maxSize: 1.25 }],
    blocked_tunnel: [{ name: 'こうじでふさがった ちかどうのトンネル', maxSize: 1.2 }],
    bridge_disaster: [{ name: 'こうえんの池にかかる こわれた石のはし', maxSize: 1.15 }]
  }
};

interface CharacterConfig {
  id: CharacterId;
  name: string;
  roleName: string;
  avatar: string;
  emoji: string;
  colorClass: string;
  accentColor: string;
  gameTitle: string;
  gameDesc: string;
}

const CHARACTERS: CharacterConfig[] = [
  {
    id: 'marshall',
    name: 'マーシャル',
    roleName: 'しょうぼうやさん',
    avatar: '/src/assets/images/marshall_face_only_1784061084168.jpg',
    emoji: '🚒🔥',
    colorClass: 'bg-red-500 border-red-600 hover:bg-red-600',
    accentColor: 'text-red-600 border-red-400',
    gameTitle: '🔥 しゅつどうだ！ 🔥',
    gameDesc: 'マーシャルのしょうぼうしゃでお水をかけて、まちの火事をぜんぶ消そう！'
  },
  {
    id: 'chase',
    name: 'チェイス',
    roleName: 'けいさつかん',
    avatar: '/src/assets/images/chase_face_only_1784068369473.jpg',
    emoji: '🚔🌟',
    colorClass: 'bg-blue-600 border-blue-700 hover:bg-blue-700',
    accentColor: 'text-blue-600 border-blue-400',
    gameTitle: '🌟 おたすけチャレンジ！ 🌟',
    gameDesc: 'チェイスのポリスカーにのって、こまっているおともだちを おたすけしよう！'
  },
  {
    id: 'skye',
    name: 'スカイ',
    roleName: 'そらのきゅうじょ隊',
    avatar: '/src/assets/images/skye_helicopter_1784071860709.jpg',
    emoji: '🚁💖',
    colorClass: 'bg-pink-500 border-pink-600 hover:bg-pink-600',
    accentColor: 'text-pink-600 border-pink-400',
    gameTitle: '💖 フライングきゅうじょチャレンジ！ 💖',
    gameDesc: 'スカイのヘリコプターにのって、たかいところや崖の下でこまっているおともだちを空からきゅうじょしよう！'
  },
  {
    id: 'rubble',
    name: 'ラブル',
    roleName: 'こうじのくるま',
    avatar: '/src/assets/images/rubble_face_new_1784157012744.jpg',
    emoji: '🚧💛',
    colorClass: 'bg-amber-400 border-amber-500 hover:bg-amber-500 text-slate-900',
    accentColor: 'text-amber-600 border-amber-400',
    gameTitle: '🚧 がれき撤去チャレンジ！ 🚧',
    gameDesc: 'ラブルのパワーショベルを動かして、どうろをふさぐ重い岩やガレキをおしのけ、まちをたすけよう！'
  }
];

const renderCharacterFace = (id: CharacterId, sizeClass: string = "w-10 h-10") => {
  const imgPath = id === 'skye'
    ? "/src/assets/images/skye_helicopter_1784071860709.jpg"
    : id === 'chase' 
    ? "/src/assets/images/chase_face_only_1784068369473.jpg" 
    : id === 'rubble'
    ? "/src/assets/images/rubble_face_new_1784157012744.jpg"
    : "/src/assets/images/marshall_face_only_1784061084168.jpg";

  return (
    <div className={`${sizeClass} rounded-full border-2 border-yellow-400 overflow-hidden shadow-md bg-white flex items-center justify-center`}>
      <img 
        src={imgPath} 
        alt={id} 
        className="w-full h-full object-cover animate-bounce"
        style={{ animationDuration: '3s' }}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

const generateRandomFires = (selectedDiff: Difficulty, stage: StageId, characterId: CharacterId = 'marshall'): Fire[] => {
  const count = selectedDiff === 'easy' ? 5 : selectedDiff === 'normal' ? 7 : selectedDiff === 'endless' ? 4 : 9;
  const marshallTypes: ('house' | 'tree' | 'car' | 'shop' | 'trash')[] = ['house', 'tree', 'car', 'shop', 'trash'];
  const chaseTypes: ('lost_kitten' | 'injured_boy' | 'lost_girl' | 'puppy_tree' | 'lost_keys')[] = ['lost_kitten', 'injured_boy', 'lost_girl', 'puppy_tree', 'lost_keys'];
  const skyeTypes: ('trapped_high' | 'cliff_rescue' | 'tree_rescue' | 'rooftop_rescue' | 'balloon_rescue')[] = ['trapped_high', 'cliff_rescue', 'tree_rescue', 'rooftop_rescue', 'balloon_rescue'];
  const rubbleTypes: ('heavy_rock' | 'debris' | 'collapsed_tree' | 'blocked_tunnel' | 'bridge_disaster')[] = ['heavy_rock', 'debris', 'collapsed_tree', 'blocked_tunnel', 'bridge_disaster'];
  const step = 82 / count;
  
  const generated: Fire[] = [];
  const templatesForStage = STAGE_BUILDING_TEMPLATES[stage];
  
  for (let i = 0; i < count; i++) {
    let type: any;
    let template: any;
    
    if (characterId === 'skye') {
      type = skyeTypes[i % skyeTypes.length];
      const templates = SKYE_TARGET_TEMPLATES[stage][type as keyof typeof SKYE_TARGET_TEMPLATES['town']];
      template = templates[Math.floor(Math.random() * templates.length)];
    } else if (characterId === 'chase') {
      type = chaseTypes[i % chaseTypes.length];
      const templates = CHASE_TARGET_TEMPLATES[stage][type as keyof typeof CHASE_TARGET_TEMPLATES['town']];
      template = templates[Math.floor(Math.random() * templates.length)];
    } else if (characterId === 'rubble') {
      type = rubbleTypes[i % rubbleTypes.length];
      const templates = RUBBLE_TARGET_TEMPLATES[stage][type as keyof typeof RUBBLE_TARGET_TEMPLATES['town']];
      template = templates[Math.floor(Math.random() * templates.length)];
    } else {
      type = marshallTypes[(i + Math.floor(Math.random() * 2)) % marshallTypes.length];
      const templates = templatesForStage[type as keyof typeof STAGE_BUILDING_TEMPLATES['town']];
      template = templates[Math.floor(Math.random() * templates.length)];
    }
    
    // Position x with spacing and jitter
    const baseX = 9 + i * step + (step / 2);
    const jitterX = (Math.random() - 0.5) * (step * 0.4);
    const x = Math.max(8, Math.min(92, Math.round(baseX + jitterX)));
    
    // Position y based on type to respect ground line perspective
    let y = 50;
    if (type === 'trapped_high' || type === 'balloon_rescue') {
      y = Math.round(18 + Math.random() * 10); // Elevated
    } else if (type === 'rooftop_rescue' || type === 'tree_rescue' || type === 'puppy_tree') {
      y = Math.round(30 + Math.random() * 12); // Medium elevated
    } else if (type === 'cliff_rescue') {
      y = Math.round(54 + Math.random() * 8); // Gorge edge / Cliff
    } else if (type === 'house' || type === 'tree' || type === 'shop') {
      y = Math.round(44 + Math.random() * 8); // Background/Ground: 44 to 52
    } else if (type === 'heavy_rock' || type === 'debris') {
      y = Math.round(58 + Math.random() * 6); // Ground/Road blocks
    } else if (type === 'collapsed_tree' || type === 'blocked_tunnel' || type === 'bridge_disaster') {
      y = Math.round(54 + Math.random() * 6); // Mid-ground blocks
    } else {
      y = Math.round(62 + Math.random() * 5); // Foreground/Sidewalk: 62 to 67
    }
    
    // HP settings based on difficulty
    let baseMaxHp = 100;
    if (selectedDiff === 'easy') {
      baseMaxHp = Math.round(180 + Math.random() * 60); // 180 to 240
    } else if (selectedDiff === 'normal') {
      baseMaxHp = Math.round(110 + Math.random() * 40); // 110 to 150
    } else if (selectedDiff === 'endless') {
      baseMaxHp = Math.round(120 + Math.random() * 40); // 120 to 160 starting HP
    } else {
      baseMaxHp = Math.round(75 + Math.random() * 35);  // 75 to 110
    }
    
    generated.push({
      id: `${selectedDiff}_s_${stage}_r_${i}_${Date.now()}`,
      x,
      y,
      size: 100, // Starts fully on fire
      maxSize: template.maxSize,
      type,
      name: template.name,
      hp: baseMaxHp,
      maxHp: baseMaxHp
    });
  }
  
  return generated;
};

const generateSingleEndlessFire = (existingFires: Fire[], stage: StageId, extinguishedCount: number, characterId: CharacterId = 'marshall'): Fire => {
  const marshallTypes: ('house' | 'tree' | 'car' | 'shop' | 'trash')[] = ['house', 'tree', 'car', 'shop', 'trash'];
  const chaseTypes: ('lost_kitten' | 'injured_boy' | 'lost_girl' | 'puppy_tree' | 'lost_keys')[] = ['lost_kitten', 'injured_boy', 'lost_girl', 'puppy_tree', 'lost_keys'];
  const skyeTypes: ('trapped_high' | 'cliff_rescue' | 'tree_rescue' | 'rooftop_rescue' | 'balloon_rescue')[] = ['trapped_high', 'cliff_rescue', 'tree_rescue', 'rooftop_rescue', 'balloon_rescue'];
  const rubbleTypes: ('heavy_rock' | 'debris' | 'collapsed_tree' | 'blocked_tunnel' | 'bridge_disaster')[] = ['heavy_rock', 'debris', 'collapsed_tree', 'blocked_tunnel', 'bridge_disaster'];
  const templatesForStage = STAGE_BUILDING_TEMPLATES[stage];

  let x = 50;
  let attempts = 0;
  let isOverlap = true;

  while (isOverlap && attempts < 100) {
    x = Math.max(10, Math.min(90, Math.round(10 + Math.random() * 80)));
    isOverlap = existingFires.some(f => Math.abs(f.x - x) < 15);
    attempts++;
  }

  // Pick random type
  let type: any;
  let template: any;
  if (characterId === 'skye') {
    type = skyeTypes[Math.floor(Math.random() * skyeTypes.length)];
    const templates = SKYE_TARGET_TEMPLATES[stage][type as keyof typeof SKYE_TARGET_TEMPLATES['town']];
    template = templates[Math.floor(Math.random() * templates.length)];
  } else if (characterId === 'chase') {
    type = chaseTypes[Math.floor(Math.random() * chaseTypes.length)];
    const templates = CHASE_TARGET_TEMPLATES[stage][type as keyof typeof CHASE_TARGET_TEMPLATES['town']];
    template = templates[Math.floor(Math.random() * templates.length)];
  } else if (characterId === 'rubble') {
    type = rubbleTypes[Math.floor(Math.random() * rubbleTypes.length)];
    const templates = RUBBLE_TARGET_TEMPLATES[stage][type as keyof typeof RUBBLE_TARGET_TEMPLATES['town']];
    template = templates[Math.floor(Math.random() * templates.length)];
  } else {
    type = marshallTypes[Math.floor(Math.random() * marshallTypes.length)];
    const templates = templatesForStage[type as keyof typeof STAGE_BUILDING_TEMPLATES['town']];
    template = templates[Math.floor(Math.random() * templates.length)];
  }

  // Position y based on type
  let y = 50;
  if (type === 'trapped_high' || type === 'balloon_rescue') {
    y = Math.round(18 + Math.random() * 10);
  } else if (type === 'rooftop_rescue' || type === 'tree_rescue' || type === 'puppy_tree') {
    y = Math.round(30 + Math.random() * 12);
  } else if (type === 'cliff_rescue') {
    y = Math.round(54 + Math.random() * 8);
  } else if (type === 'house' || type === 'tree' || type === 'shop') {
    y = Math.round(44 + Math.random() * 8);
  } else if (type === 'heavy_rock' || type === 'debris') {
    y = Math.round(58 + Math.random() * 6);
  } else if (type === 'collapsed_tree' || type === 'blocked_tunnel' || type === 'bridge_disaster') {
    y = Math.round(54 + Math.random() * 6);
  } else {
    y = Math.round(62 + Math.random() * 5);
  }

  const baseMaxHp = Math.round(90 + Math.random() * 30);

  return {
    id: `endless_s_${stage}_r_${extinguishedCount}_${Date.now()}`,
    x,
    y,
    size: 100,
    maxSize: template.maxSize,
    type,
    name: template.name,
    hp: baseMaxHp,
    maxHp: baseMaxHp
  };
};

const DIFFICULTY_LABELS: Record<Difficulty, { title: string; desc: string; color: string; stars: number }> = {
  easy: { title: 'かんたん', desc: 'ひがふえないよ！お水もむげんだい！', color: 'bg-yellow-400 border-yellow-500 hover:bg-yellow-500 text-slate-800', stars: 1 },
  normal: { title: 'ふつう', desc: 'ひがすこしずつ大きくなるよ！がんばろう！', color: 'bg-orange-400 border-orange-500 hover:bg-orange-500 text-white', stars: 2 },
  hard: { title: 'むずかしい', desc: 'お水がへるよ！消火栓（しょうかせん）で補給しよう！', color: 'bg-red-500 border-red-600 hover:bg-red-600 text-white', stars: 3 },
  endless: { title: 'エンドレス', desc: 'むげんに火がでるよ！どんどんむずかしくなる！', color: 'bg-purple-600 border-purple-700 hover:bg-purple-700 text-white', stars: 4 }
};

export default function GameArea() {
  const [gameState, setGameState] = useState<GameState>('start_screen');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [selectedStage, setSelectedStage] = useState<StageId>('town');
  const [fires, setFires] = useState<Fire[]>([]);
  const [targetFireId, setTargetFireId] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>('marshall');
  const [activeRubbleTarget, setActiveRubbleTarget] = useState<Fire | null>(null);
  const [activeMarshallTarget, setActiveMarshallTarget] = useState<Fire | null>(null);
  const [activeChaseTarget, setActiveChaseTarget] = useState<Fire | null>(null);
  const [activeSkyeTarget, setActiveSkyeTarget] = useState<Fire | null>(null);
  
  // Audio & Speech state variables
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [speechText, setSpeechText] = useState('パウ・パトロール、しゅつどうじゅんびオッケー！🐶 キャラクターをえらんでね！');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Hard Mode Water mechanic
  const [waterLevel, setWaterLevel] = useState(100);
  const [isRefilling, setIsRefilling] = useState(false);

  // Scoring/Statistics
  const [stats, setStats] = useState<GameStats>({ totalFires: 0, extinguishedFires: 0, waterUsed: 0 });
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Fire Truck Position State
  const [truckX, setTruckX] = useState(50); // Start in middle (percentage 0 to 100)
  const [truckMoving, setTruckMoving] = useState(false);
  const [truckSpraying, setTruckSpraying] = useState(false);
  const [angleToFire, setAngleToFire] = useState(0);
  const [destroyedBuildingName, setDestroyedBuildingName] = useState('');

  // Nozzle Click burst trigger state & cheering callback
  const [burstTrigger, setBurstTrigger] = useState(0);

  // Endless ranking modal state
  const [showRankingModal, setShowRankingModal] = useState(false);

  // Special Move / Ryder Help Gauge
  const [specialGauge, setSpecialGauge] = useState(0);
  const [ryderActive, setRyderActive] = useState(false);

  // Refs to avoid stale closures in timeouts
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const extinguishedCountRef = useRef(0);
  useEffect(() => {
    extinguishedCountRef.current = stats.extinguishedFires;
  }, [stats.extinguishedFires]);

  const handleNozzleClick = () => {
    // 1. Increment burstTrigger to spawn a burst of water particles on WaterSprayCanvas!
    setBurstTrigger((prev) => prev + 1);

    // 2. Play tactile sounds
    sound.playClick();
    
    // Play a short spray noise to represent water burst!
    sound.playWaterSpray(true);
    setTimeout(() => {
      // If we are not actively spraying, stop the water spray sound
      if (!truckSpraying) {
        sound.playWaterSpray(false);
      }
    }, 150);

    // 3. Select a cute cheerful motivation
    const cheerfulPhrases = selectedCharacter === 'chase' ? [
      { text: 'おたすけパワー ぜんかい！いっしょに助けよう！🌟', speech: 'おたすけパワーぜんかい！いっしょにたすけよう！🌟' },
      { text: 'チェイスにおまかせ！みんなを笑顔に！🐶', speech: 'チェイスにおまかせ！みんなをえがおに！🐶' },
      { text: 'パウ・パトロール、全員（ぜんいん）しゅつどう！ピカピカー！✨', speech: 'パウパトロール、ぜんいんしゅつどう！ピカピカー！✨' },
      { text: 'よし！そのちょうしだよ！おたすけパワー発射（はっしゃ）！🚀', speech: 'よし！そのちょうしだよ！おたすけパワーはっしゃ！🚀' },
      { text: 'みんなをたすけにいくよ！まっててね！🚔', speech: 'みんなをたすけにいくよ！まっててね！🚔' }
    ] : selectedCharacter === 'skye' ? [
      { text: 'ビュビューンとひとっ飛び！そらからきゅうじょするよ！🚁💖', speech: 'ビュビューンとひとっとび！そらからきゅうじょするよ！🚁💖' },
      { text: 'スカイにおまかせ！ピンクのつばさでレスキュー！🌸', speech: 'スカイにおまかせ！ピンクのつばさでレスキュー！🌸' },
      { text: 'パウ・パトロール、全員（ぜんいん）しゅつどう！ピカピカー！✨', speech: 'パウパトロール、ぜんいんしゅつどう！ピカピカー！✨' },
      { text: 'よし！そのちょうしだよ！きゅうじょビーム、しゅっぱつ！🚀', speech: 'よし！そのちょうしだよ！きゅうじょビーム、しゅっぱつ！🚀' },
      { text: 'おそらからみんなをきゅうじょするよ！まっててね！🚁', speech: 'おそらからみんなをきゅうじょするよ！まっててね！🚁' }
    ] : [
      { text: 'おみず ぜんかい！がんばれー！💦', speech: 'おみずぜんかい！がんばれー！💦' },
      { text: 'マーシャルにおまかせ！お水をピュッピュッ！💧', speech: 'マーシャルにおまかせ！おみずをピュッピュッ！💧' },
      { text: 'パウ・パトロール、全員（ぜんいん）しゅつどう！ピカピカー！✨', speech: 'パウパトロール、ぜんいんしゅつどう！ピカピカー！✨' },
      { text: 'よし！そのちょうしだよ！おみずを発射（はっしゃ）！🚀', speech: 'よし！そのちょうしだよ！おみずをはっしゃ！🚀' },
      { text: 'もっとたくさん、お水をかけるよ！がんばれ！🚒', speech: 'もっとたくさん、おみずをかけるよ！がんばれ！🚒' }
    ];
    const randPhrase = cheerfulPhrases[Math.floor(Math.random() * cheerfulPhrases.length)];
    triggerGuidance(randPhrase.text, randPhrase.speech);
  };

  // Layout Measurement for exact Canvas tracking
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 800, height: 450 });

  // Voice Narration handler
  useEffect(() => {
    speech.registerCallbacks(
      (text) => {
        setSpeechText(text);
        setIsSpeaking(true);
      },
      () => {
        setIsSpeaking(false);
      }
    );

    // Initial greeting speech
    setTimeout(() => {
      triggerGuidance(
        'パウ・パトロール、出動準備（しゅつどうじゅんび）オッケー！マーシャル、チェイス、スカイ、好きなキャラクターをえらんでね！',
        'パウ・パトロール、しゅつどうじゅんびオッケー！🐶 マーシャル、チェイス、スカイ、すきなキャラクターをえらんでね！'
      );
    }, 500);

    return () => {
      speech.cancel();
      sound.stopBGM();
    };
  }, []);

  // Update sound enabled/disabled states across managers
  useEffect(() => {
    sound.setSoundEnabled(soundEnabled);
    speech.setSoundEnabled(soundEnabled);
    if (soundEnabled && gameState === 'playing') {
      sound.startBGM();
    } else {
      sound.stopBGM();
    }
  }, [soundEnabled, gameState]);

  // Keep track of container dimensions to pass to canvas sprayer
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setContainerDimensions({ width, height });
    });

    resizeObserver.observe(element);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Timer while playing
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, startTime]);

  // Main Game Tick Loop (updates fires health, manages water levels, fire re-growth)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const tickInterval = setInterval(() => {
      // 1. Update existing fires sizes and building HP
      setFires((prevFires) => {
        const updated = prevFires.map((fire) => {
          if (fire.size <= 0) return fire;

          let newSize = fire.size;
          let newHp = fire.hp;

          // If this fire is currently being targeted and sprayed
          if (fire.id === targetFireId && truckSpraying && !isRefilling) {
            newSize = Math.max(0, fire.size - 14.5); // Extinguish / Rescue rate
            // Recover building HP / Relief progress when being sprayed (increased recovery rate for improved game balance)
            newHp = Math.min(fire.maxHp, fire.hp + 4.0);
            
            // If just extinguished / rescued
            if (newSize <= 0 && fire.size > 0) {
              sound.playExtinguish();
              
              // Trigger success vocal cues dynamically
              const praises = selectedCharacter === 'chase' ? [
                'やったね！たすけることができたよ！すごすぎる！',
                '任務（にんむ）完了！チェイス、大活躍（だいかつやく）！',
                'よしっ！みんなをどんどんおたすけしよう！'
              ] : selectedCharacter === 'skye' ? [
                'フライングきゅうじょ、大せいこう！すてき！✨',
                'やったー！ぶじにきゅうじょできたよ！ありがとう！💖',
                'スカイにおまかせ！つぎのおともだちをさがそう！🐾'
              ] : selectedCharacter === 'rubble' ? [
                'ラブルにおまかせ！がれきをぜんぶかたづけたよ！🚧',
                '任務（にんむ）完了！パワーショベルで大活躍（だいかつやく）だ！💛',
                'やったね！どうろがピカピカになってひろびろ〜！✨'
              ] : [
                'やったね！火が消えたよ！すごいすごい！',
                '任務（にんむ）完了！マーシャル、大活躍（だいかつやく）！',
                'よしっ！この調子でどんどん消そう！'
              ];
              const selectedPraise = praises[Math.floor(Math.random() * praises.length)];
              triggerGuidance(selectedPraise, selectedPraise + ' ⭐');
              
              // Safely defer state changes outside state updater
              setTimeout(() => {
                setStats((s) => ({ ...s, extinguishedFires: s.extinguishedFires + 1 }));
                setSpecialGauge((prev) => Math.min(100, prev + 34)); // Fill special move gauge!
                if (fire.id === targetFireId) {
                  setTargetFireId(null);
                  setTruckSpraying(false);
                  sound.playWaterSpray(false);
                }
              }, 0);

              // Endless mode: remove and spawn new fire
              if (difficulty === 'endless') {
                const targetId = fire.id;
                setTimeout(() => {
                  setFires((prev) => prev.filter((f) => f.id !== targetId));
                }, 1500);

                setTimeout(() => {
                  if (gameStateRef.current === 'playing') {
                    setFires((prev) => {
                      const newFire = generateSingleEndlessFire(prev, selectedStage, extinguishedCountRef.current + 1, selectedCharacter);
                      return [...prev, newFire];
                    });
                  }
                }, 4000);
              }
            }
          } else {
            // Fires slowly grow / Trouble increases if they aren't being sprayed (Normal/Hard/Endless mode)
            if (difficulty === 'normal') {
              newSize = Math.min(100, fire.size + 0.6);
            } else if (difficulty === 'hard') {
              newSize = Math.min(100, fire.size + 1.2);
            } else if (difficulty === 'endless') {
              const growthRate = 0.6 + Math.min(1.0, stats.extinguishedFires * 0.05);
              newSize = Math.min(100, fire.size + growthRate);
            }

            // Building HP / Relief decreases while burning/distressed and not being sprayed
            let baseDamage = 0.52;
            if (difficulty === 'easy') {
              baseDamage = 0.22;
            } else if (difficulty === 'normal') {
              baseDamage = 0.52;
            } else if (difficulty === 'hard') {
              baseDamage = 0.88;
            } else if (difficulty === 'endless') {
              baseDamage = 0.25 + Math.min(1.5, stats.extinguishedFires * 0.06);
            }
            const tickDamage = (fire.size / 100) * baseDamage;
            newHp = Math.max(0, fire.hp - tickDamage);
          }

          return { ...fire, size: newSize, hp: newHp };
        });

        // 2. Check Victory or Game Over conditions
        const activeFires = updated.filter(f => f.size > 0);
        const destroyedBuilding = updated.find(f => f.size > 0 && f.hp <= 0);

        if (destroyedBuilding) {
          // Trigger game over!
          setTimeout(() => {
            handleGameOver(destroyedBuilding.name);
          }, 100);
        } else if (activeFires.length === 0) {
          if (difficulty !== 'endless') {
            setTimeout(() => {
              handleVictory();
            }, 800);
          }
        }

        return updated;
      });

      // 3. Consume water / energy in Hard/Endless mode
      if ((difficulty === 'hard' || difficulty === 'endless') && truckSpraying && !isRefilling) {
        setWaterLevel((w) => {
          const nextW = Math.max(0, w - 4); // Consumes water / energy
          
          if (nextW <= 0) {
            setTruckSpraying(false);
            sound.playWaterSpray(false);
            if (selectedCharacter === 'chase') {
              triggerGuidance(
                'おたすけエネルギーが空っぽになっちゃった！右下の青いチャージャーをタップしてチャージしてね！',
                'おたすけエネルギーがからっぽになっちゃった！右下のあおいチャージャーをタップしてね！⚡'
              );
            } else if (selectedCharacter === 'skye') {
              triggerGuidance(
                'フライトバッテリーが空っぽになっちゃった！右下のチャージャーをタップして充電してね！',
                'フライトバッテリーがからっぽになっちゃった！右下のチャージャーをタップしてね！🔌💖'
              );
            } else if (selectedCharacter === 'rubble') {
              triggerGuidance(
                'パワーエネルギーが空っぽになっちゃった！右下のパワーチャージャーをタップして充電してね！',
                'パワーエネルギーがからっぽになっちゃった！右下のパワーチャージャーをタップしてね！🔌🚧'
              );
            } else {
              triggerGuidance(
                'お水が空っぽになっちゃった！右下の青い消火栓（しょうかせん）をタップしてお水を入れてね！',
                'おみずがからっぽになっちゃった！右下のあおい消火栓（しょうかせん）をタップしておみずをいれてね！💧'
              );
            }
          } else if (w > 25 && nextW <= 25) {
            // Warn child when water level is critically low
            if (selectedCharacter === 'chase') {
              triggerGuidance(
                'おたすけエネルギーが少なくなってきたよ！気をつけよう！',
                'おたすけエネルギーがすくなくなってきたよ！きをつけよう！🎛️'
              );
            } else if (selectedCharacter === 'skye') {
              triggerGuidance(
                'フライトバッテリーが少なくなってきたよ！気をつけよう！',
                'フライトバッテリーがすくなくなってきたよ！きをつけよう！⚡'
              );
            } else if (selectedCharacter === 'rubble') {
              triggerGuidance(
                'パワーエネルギーが少なくなってきたよ！気をつけよう！',
                'パワーエネルギーがすくなくなってきたよ！きをつけよう！⚡'
              );
            } else {
              triggerGuidance(
                'お水が少なくなってきたよ！気をつけよう！',
                'おみずがすくなくなってきたよ！きをつけよう！🎛️'
              );
            }
          }

          return nextW;
        });
        setStats((s) => ({ ...s, waterUsed: s.waterUsed + 4 }));
      }

    }, 200); // Ticks 5 times per second

    return () => clearInterval(tickInterval);
  }, [gameState, targetFireId, truckSpraying, difficulty, isRefilling, selectedStage, stats.extinguishedFires, selectedCharacter]);

  // Truck position control loop (drives the truck smoothly to targeted fire's X)
  useEffect(() => {
    if (gameState !== 'playing' || !targetFireId) {
      setTruckSpraying(false);
      sound.playWaterSpray(false);
      return;
    }

    const targetFire = fires.find(f => f.id === targetFireId);
    if (!targetFire || targetFire.size <= 0) {
      // Target is extinguished or missing
      setTargetFireId(null);
      setTruckSpraying(false);
      sound.playWaterSpray(false);
      return;
    }

    // Calculate distance and handle movement to fire's X coordinate
    const dx = Math.abs(truckX - targetFire.x);
    if (dx > 2) {
      // Drive truck towards fire
      setTruckMoving(true);
      setTruckSpraying(false);
      sound.playWaterSpray(false);

      const direction = targetFire.x > truckX ? 1 : -1;
      const driveTimer = setTimeout(() => {
        setTruckX((tx) => {
          const nextX = tx + direction * 4.5;
          // Clamp inside board bounds
          return Math.max(10, Math.min(90, nextX));
        });
      }, 30);

      return () => clearTimeout(driveTimer);
    } else {
      // Arrived at target! Raise nozzle and spray
      setTruckMoving(false);
      
      // Calculate hose nozzle angle to point directly at the fire
      const startX = (truckX / 100) * containerDimensions.width;
      const startY = containerDimensions.height * 0.85;
      const endX = (targetFire.x / 100) * containerDimensions.width;
      const endY = (targetFire.y / 100) * containerDimensions.height;
      const angleRad = Math.atan2(endX - startX, startY - endY); // SVG coordinates swap
      const angleDeg = (angleRad * 180) / Math.PI;

      setAngleToFire(Math.min(65, Math.max(-65, angleDeg))); // Limit rotation angle for look comfort

      // Only spray if we have water (in hard/endless mode)
      if ((difficulty !== 'hard' && difficulty !== 'endless') || waterLevel > 0) {
        if (!truckSpraying && !isRefilling) {
          setTruckSpraying(true);
          sound.playWaterSpray(true);
        }
      }
    }
  }, [gameState, targetFireId, truckX, fires, difficulty, waterLevel, isRefilling, containerDimensions]);

  // Handle fire / rescue touch
  const handleFireSelect = (fire: Fire) => {
    if (gameState !== 'playing' || isRefilling) return;
    
    sound.playClick();
    setTargetFireId(fire.id);

    // Speak firefighting / rescuing shouts
    const callouts = selectedCharacter === 'chase' ? [
      'ポリスカーしゅつどう！急げー！',
      'よし！あそこでおたすけパワーをはっしゃしよう！',
      'チェイス、レスキュー活動スタート！'
    ] : selectedCharacter === 'skye' ? [
      'ヘリコプター、しゅつどう！大空からおたすけだよ！',
      'よし！あそこにホイストをおろしてきゅうじょしよう！',
      'スカイ、レスキュー活動スタート！'
    ] : selectedCharacter === 'rubble' ? [
      'ブルドーザーしゅつどう！がれきをかたづけるよ！',
      'よし！パワーショベルをうごかして、ガレキをどかそう！',
      'ラブル、レスキュー活動スタート！'
    ] : [
      '消防車（しょうぼうしゃ）しゅつどう！急げー！',
      'よし！あそこに放水（ほうすい）だ！お水をかけよう！',
      'マーシャル、消火活動（しょうかかつどう）スタート！'
    ];
    const calloutSubs = selectedCharacter === 'chase' ? [
      'ポリスカーしゅつどう！いそげー！🚔🌟',
      'よし！あそこでおたすけパワーをはっしゃしよう！✨',
      'チェイス、レスキュー活動スタート！🐾'
    ] : selectedCharacter === 'skye' ? [
      'ヘリコプター、しゅつどう！おおぞらからおたすけだよ！🚁💖',
      'よし！あそこにホイストをおろしてきゅうじょしよう！✨',
      'スカイ、レスキュー活動スタート！🐾'
    ] : selectedCharacter === 'rubble' ? [
      'ブルドーザーしゅつどう！がれきをかたづけるよ！🚧💛',
      'よし！パワーショベルをうごかして、ガレキをどかそう！✨',
      'ラブル、レスキュー活動スタート！🐾'
    ] : [
      'しょうぼうしゃしゅつどう！いそげー！🚒',
      'よし！あそこにほうすいだ！おみずをかけよう！💦',
      'マーシャル、しょうかかつどうスタート！🔥'
    ];
    const randIdx = Math.floor(Math.random() * callouts.length);
    triggerGuidance(callouts[randIdx], calloutSubs[randIdx]);

    if (selectedCharacter === 'rubble') {
      setActiveRubbleTarget(fire);
    } else if (selectedCharacter === 'marshall') {
      setActiveMarshallTarget(fire);
    } else if (selectedCharacter === 'chase') {
      setActiveChaseTarget(fire);
    } else if (selectedCharacter === 'skye') {
      setActiveSkyeTarget(fire);
    }
  };

  const handleRubbleTargetCleared = (fireId: string) => {
    setFires((prev) =>
      prev.map((f) => {
        if (f.id === fireId) {
          sound.playExtinguish();

          const praises = [
            'すごい！がれきをきれいにどかせたよ！🌟',
            'さすがラブル！パワーいっぱい大活やく！🚧',
            'どうろがとおれるようになったよ！ありがとう！🐶'
          ];
          const subPraises = [
            'すごい！がれきをきれいにどかせたよ！🌟🚜',
            'さすがラブル！パワーいっぱいで大かつやく！🚧💛',
            'どうろがとおれるようになったよ！ありがとう！🐾'
          ];
          const idx = Math.floor(Math.random() * praises.length);
          triggerGuidance(praises[idx], subPraises[idx]);

          return { ...f, size: 0, hp: f.maxHp };
        }
        return f;
      })
    );

    setTimeout(() => {
      setStats((s) => ({ ...s, extinguishedFires: s.extinguishedFires + 1 }));
      setSpecialGauge((prev) => Math.min(100, prev + 34));
      setTargetFireId(null);
      setActiveRubbleTarget(null);
    }, 0);

    if (difficulty === 'endless') {
      setTimeout(() => {
        setFires((prev) => prev.filter((f) => f.id !== fireId));
      }, 1500);

      setTimeout(() => {
        if (gameStateRef.current === 'playing') {
          setFires((prev) => {
            const newFire = generateSingleEndlessFire(prev, selectedStage, extinguishedCountRef.current + 1, selectedCharacter);
            return [...prev, newFire];
          });
        }
      }, 4000);
    }
  };

  const handleMarshallTargetCleared = (fireId: string) => {
    setFires((prev) =>
      prev.map((f) => {
        if (f.id === fireId) {
          sound.playExtinguish();

          const praises = [
            'すごい！火がきれいに消えたよ！🌟',
            'さすがマーシャル！おみず大せいこう！🚒',
            'これで安心だね！ありがとう！🐶'
          ];
          const subPraises = [
            'すごい！火がきれいに消えたよ！🌟💦',
            'さすがマーシャル！おみず大せいこう！🚒🔥',
            'これで安心だね！ありがとう！🐾'
          ];
          const idx = Math.floor(Math.random() * praises.length);
          triggerGuidance(praises[idx], subPraises[idx]);

          return { ...f, size: 0, hp: f.maxHp };
        }
        return f;
      })
    );

    setTimeout(() => {
      setStats((s) => ({ ...s, extinguishedFires: s.extinguishedFires + 1 }));
      setSpecialGauge((prev) => Math.min(100, prev + 34));
      setTargetFireId(null);
      setActiveMarshallTarget(null);
    }, 0);

    if (difficulty === 'endless') {
      setTimeout(() => {
        setFires((prev) => prev.filter((f) => f.id !== fireId));
      }, 1500);

      setTimeout(() => {
        if (gameStateRef.current === 'playing') {
          setFires((prev) => {
            const newFire = generateSingleEndlessFire(prev, selectedStage, extinguishedCountRef.current + 1, selectedCharacter);
            return [...prev, newFire];
          });
        }
      }, 4000);
    }
  };

  const handleChaseTargetCleared = (fireId: string) => {
    setFires((prev) =>
      prev.map((f) => {
        if (f.id === fireId) {
          sound.playExtinguish();

          const praises = [
            'すごい！あんぜんコーンをじょうずに置けたよ！🌟',
            'さすがチェイス！かっこよく解決したよ！🚔',
            'みんなが笑顔になったよ！ありがとう！🐶'
          ];
          const subPraises = [
            'すごい！あんぜんコーンをじょうずに置けたよ！🌟🚨',
            'さすがチェイス！かっこよく解決したよ！🚔💙',
            'みんなが笑顔になったよ！ありがとう！🐾'
          ];
          const idx = Math.floor(Math.random() * praises.length);
          triggerGuidance(praises[idx], subPraises[idx]);

          return { ...f, size: 0, hp: f.maxHp };
        }
        return f;
      })
    );

    setTimeout(() => {
      setStats((s) => ({ ...s, extinguishedFires: s.extinguishedFires + 1 }));
      setSpecialGauge((prev) => Math.min(100, prev + 34));
      setTargetFireId(null);
      setActiveChaseTarget(null);
    }, 0);

    if (difficulty === 'endless') {
      setTimeout(() => {
        setFires((prev) => prev.filter((f) => f.id !== fireId));
      }, 1500);

      setTimeout(() => {
        if (gameStateRef.current === 'playing') {
          setFires((prev) => {
            const newFire = generateSingleEndlessFire(prev, selectedStage, extinguishedCountRef.current + 1, selectedCharacter);
            return [...prev, newFire];
          });
        }
      }, 4000);
    }
  };

  const handleSkyeTargetCleared = (fireId: string) => {
    setFires((prev) =>
      prev.map((f) => {
        if (f.id === fireId) {
          sound.playExtinguish();

          const praises = [
            'すごい！おともだちをきゅうじょできたよ！🌟',
            'さすがスカイ！おおぞら大かつやく！🚁',
            'みんな助かってよかったね！ありがとう！🐶'
          ];
          const subPraises = [
            'すごい！おともだちをきゅうじょできたよ！🌟💖',
            'さすがスカイ！おおぞら大かつやく！🚁✨',
            'みんな助かってよかったね！ありがとう！🐾'
          ];
          const idx = Math.floor(Math.random() * praises.length);
          triggerGuidance(praises[idx], subPraises[idx]);

          return { ...f, size: 0, hp: f.maxHp };
        }
        return f;
      })
    );

    setTimeout(() => {
      setStats((s) => ({ ...s, extinguishedFires: s.extinguishedFires + 1 }));
      setSpecialGauge((prev) => Math.min(100, prev + 34));
      setTargetFireId(null);
      setActiveSkyeTarget(null);
    }, 0);

    if (difficulty === 'endless') {
      setTimeout(() => {
        setFires((prev) => prev.filter((f) => f.id !== fireId));
      }, 1500);

      setTimeout(() => {
        if (gameStateRef.current === 'playing') {
          setFires((prev) => {
            const newFire = generateSingleEndlessFire(prev, selectedStage, extinguishedCountRef.current + 1, selectedCharacter);
            return [...prev, newFire];
          });
        }
      }, 4000);
    }
  };

  // Water Hydrant refill / Charger refill mechanism
  const handleRefillHydrant = () => {
    if (gameState !== 'playing' || isRefilling || (difficulty !== 'hard' && difficulty !== 'endless')) return;

    sound.playClick();
    setIsRefilling(true);
    setTruckSpraying(false);
    sound.playWaterSpray(false);
    sound.playRefill();

    if (selectedCharacter === 'chase') {
      triggerGuidance(
        'エネルギーチャージャーからチャージするよ！ちょっと待ってね！',
        'エネルギーチャージャーからチャージするよ！ピピピピッ！🔋✨'
      );
    } else if (selectedCharacter === 'skye') {
      triggerGuidance(
        'フライトバッテリーをじゅうでんするよ！ちょっと待ってね！',
        'フライトバッテリーをじゅうでんするよ！ピピッ🔋💖'
      );
    } else if (selectedCharacter === 'rubble') {
      triggerGuidance(
        'パワーチャージャーでエネルギーをじゅうでんするよ！ちょっと待ってね！',
        'パワーチャージャーでエネルギーをじゅうでんするよ！グングン！🔋🚧'
      );
    } else {
      triggerGuidance(
        '消火栓（しょうかせん）からお水をいっぱいいれるよ！ちょっと待ってね！',
        'しょうかせんからおみずをいっぱいいれるよ！ゴクゴク！ぷはー！💧'
      );
    }

    // Smooth progress refilling
    let fillPct = waterLevel;
    const interval = setInterval(() => {
      fillPct = Math.min(100, fillPct + 10);
      setWaterLevel(fillPct);
      if (fillPct >= 100) {
        clearInterval(interval);
        setIsRefilling(false);
        if (selectedCharacter === 'chase') {
          triggerGuidance(
            'おたすけエネルギーが満タンになったよ！よし、おたすけを再開だ！',
            'おたすけエネルギーがまんたんになったよ！よし、おたすけをさいかいだ！🚀'
          );
        } else if (selectedCharacter === 'skye') {
          triggerGuidance(
            'フライトエネルギーが満タンになったよ！よし、きゅうじょを再開だ！',
            'フライトエネルギーがまんたんになったよ！よし、きゅうじょをさいかいだ！🚁✨'
          );
        } else if (selectedCharacter === 'rubble') {
          triggerGuidance(
            'パワーエネルギーが満タンになったよ！よし、がれき撤去を再開だ！',
            'パワーエネルギーがまんたんになったよ！よし、がれきてっきょをさいかいだ！🚧⚡'
          );
        } else {
          triggerGuidance(
            'お水が満タンになったよ！よし、消火活動を再開だ！',
            'おみずがまんたんになったよ！よし、しょうかかつどうをさいかいだ！🚀'
          );
        }
      }
    }, 120);
  };

  // Trigger Guidance speech and text subtitles together
  const triggerGuidance = (text: string, subtitleText?: string) => {
    speech.speak(text, subtitleText);
  };

  // Replay voice narration
  const handleReplaySpeech = () => {
    sound.playClick();
    speech.speak(speechText);
  };

  // Start playing
  const handleStartGame = (selectedDiff: Difficulty) => {
    sound.playClick();
    setDifficulty(selectedDiff);
    
    // Seed randomized fires using selectedStage
    const seededFires = generateRandomFires(selectedDiff, selectedStage, selectedCharacter);

    setFires(seededFires);
    setTargetFireId(null);
    setWaterLevel(100);
    setIsRefilling(false);
    setTruckX(50);
    setTruckMoving(false);
    setTruckSpraying(false);
    setSpecialGauge(0);
    setRyderActive(false);
    setStats({ totalFires: seededFires.length, extinguishedFires: 0, waterUsed: 0 });
    setStartTime(Date.now());
    setElapsedTime(0);
    setGameState('playing');

    // Dynamic, stage-specific guidance text
    let stageTitle = '';
    let stageAction = '';
    let stageEmoji = '';

    if (selectedStage === 'town') {
      stageTitle = 'いつもの街（まち）';
      stageAction = selectedCharacter === 'chase' ? 'まいごのともだち' : 'おうちや木';
      stageEmoji = '🏡';
    } else if (selectedStage === 'mountain') {
      stageTitle = '山あそび広場（やま）';
      stageAction = selectedCharacter === 'chase' ? 'こまっているテント' : 'テントややまごや';
      stageEmoji = '🌲';
    } else if (selectedStage === 'sea') {
      stageTitle = 'ビーチリゾート（うみ）';
      stageAction = selectedCharacter === 'chase' ? 'まいごのネコやともだち' : 'うみのいえやヨット';
      stageEmoji = '🏖️';
    } else if (selectedStage === 'metro') {
      stageTitle = 'にぎやか大都会（とかい）';
      stageAction = selectedCharacter === 'chase' ? 'ビルでこまっている人' : 'ビルやスポーツカー';
      stageEmoji = '🏙️';
    }

    const modeDesc = selectedDiff === 'easy' 
      ? `かんたんモードスタート！いっしょにゆっくり、${stageAction}をタップして${selectedCharacter === 'chase' ? 'おたすけパワーをかけようね！' : 'お水をかけようね！'}`
      : selectedDiff === 'normal'
      ? `ふつうモードスタート！${stageAction}の${selectedCharacter === 'chase' ? 'おともだちがさびしくなる' : '火が大きくなる'}前に、がんばって全部おたすけしようね！`
      : selectedDiff === 'endless'
      ? `エンドレスモードスタート！${selectedCharacter === 'chase' ? 'おともだちがどんどんやってくるよ！がんばっておたすけ限界にちょうせんだ！エネルギーがなくなったら右下のエネルギーチャージャーをタップしてね！' : '火がどんどんふえるよ！がんばって限界にちょうせんだ！お水がなくなったら右下の消火栓（しょうかせん）をタップしてね！'}`
      : `むずかしいモードスタート！${selectedCharacter === 'chase' ? 'エネルギーがなくなったら、右下の青いエネルギーチャージャーをタップしてね！' : 'お水がなくなったら、右下の青い消火栓（しょうかせん）をタップしてね！'}`;

    const modeDescSub = selectedDiff === 'easy' 
      ? `かんたんモードスタート！いっしょにゆっくり、${stageAction}をタップして${selectedCharacter === 'chase' ? 'おたすけしようね！' : 'お水をかけようね！'}${stageEmoji}`
      : selectedDiff === 'normal'
      ? `ふつうモードスタート！${stageAction}をおたすけしようね！🌟`
      : selectedDiff === 'endless'
      ? `エンドレスモードスタート！おたすけ限界にちょうせんだ！💪`
      : `むずかしいモードスタート！おたすけエネルギーがなくなったら、タップしてね！🔋`;

    const introText = `${stageTitle}に到着したよ！${modeDesc}`;
    const introSub = `${stageTitle}に到着したよ！${modeDescSub}`;

    triggerGuidance(introText, introSub);

    // Play happy background loop
    setTimeout(() => {
      if (soundEnabled) sound.startBGM();
    }, 1000);
  };

  // Handle Victory Win state
  const handleVictory = () => {
    setGameState('victory');
    setTruckSpraying(false);
    sound.playWaterSpray(false);
    sound.stopBGM();
    sound.playVictory();

    if (selectedCharacter === 'chase') {
      triggerGuidance(
        '任務完了（にんむかんりょう）！困っているみんなを全員おたすけできたよ！いっしょに遊んでくれてありがとう！チェイス、大活躍（だいかつやく）！',
        '任務完了（にんむかんりょう）！みんなをぜんぶおたすけできたよ！いっしょにあそんでくれてありがとう！チェイス大活躍！🏆✨'
      );
    } else {
      triggerGuidance(
        '任務完了（にんむかんりょう）！街の火を全部消せたよ！いっしょに遊んでくれてありがとう！マーシャル、大活躍（だいかつやく）！',
        '任務完了（にんむかんりょう）！まちの火をぜんぶ消せたよ！いっしょにあそんでくれてありがとう！マーシャル大活躍！🏆✨'
      );
    }
  };

  // Handle Game Over fail state
  const handleGameOver = (buildingName: string) => {
    setGameState('game_over');
    setDestroyedBuildingName(buildingName);
    setTruckSpraying(false);
    sound.playWaterSpray(false);
    sound.stopBGM();
    sound.playGameOver();

    if (selectedCharacter === 'chase') {
      triggerGuidance(
        `大変（たいへん）だ！${buildingName}が悲（かな）しくて泣（な）いちゃったよ…！あきらめずに、もう一回（いっかい）チャレンジしよう！`,
        `たいへんだ！${buildingName}がさびしくてないちゃったよ…！😭 あきらめずに、もういっかいチャレンジしよう！🚓`
      );
    } else {
      triggerGuidance(
        `大変（たいへん）だ！${buildingName}が燃（も）えちゃったよ…！あきらめずに、もう一回（いっかい）チャレンジしよう！`,
        `たいへんだ！${buildingName}がもえちゃったよ…！😭 あきらめずに、もういっかいチャレンジしよう！🚒`
      );
    }

    // If endless mode, save ranking record to local storage
    if (difficulty === 'endless') {
      const gameDuration = Math.floor((Date.now() - startTime) / 1000);
      const newEntry = {
        id: `${Date.now()}`,
        elapsedTime: gameDuration,
        extinguishedFires: stats.extinguishedFires,
        waterUsed: stats.waterUsed,
        stageId: selectedStage,
        date: new Date().toLocaleDateString('ja-JP', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
      };

      try {
        const stored = localStorage.getItem('paw_patrol_endless_ranking');
        const ranking = stored ? JSON.parse(stored) : [];
        ranking.push(newEntry);
        
        // Sort: extinguishedFires (desc), then elapsedTime (desc), then waterUsed (asc)
        ranking.sort((a: any, b: any) => {
          if (b.extinguishedFires !== a.extinguishedFires) {
            return b.extinguishedFires - a.extinguishedFires;
          }
          if (b.elapsedTime !== a.elapsedTime) {
            return b.elapsedTime - a.elapsedTime;
          }
          return a.waterUsed - b.waterUsed;
        });

        const top10 = ranking.slice(0, 10);
        localStorage.setItem('paw_patrol_endless_ranking', JSON.stringify(top10));
      } catch (e) {
        console.error('Failed to save endless ranking', e);
      }
    }
  };

  // Special Move / Ryder (Kent) Help Action
  const triggerSpecialMove = () => {
    if (specialGauge < 100 || gameState !== 'playing') return;

    sound.playClick();
    sound.playExtinguish(); // Play the gorgeous tri-tone chime for Ryder's appearance!
    
    setRyderActive(true);
    setSpecialGauge(0); // Reset gauge

    // Ryder's exciting speech
    if (selectedCharacter === 'chase') {
      triggerGuidance(
        'ケント「パウ・パトロール、全員出動（ぜんいんしゅつどう）！困っているみんなを、いっきにおたすけするよ！」',
        'ケント「パウ・パトロール、ぜんいんしゅつどう！ピンチのおともだちを、いっきにおたすけするぞー！🌟✨」'
      );
    } else {
      triggerGuidance(
        'ケント「パウ・パトロール、全員出動（ぜんいんしゅつどう）！ピンチ（HP半分以下）のたてものを一斉に消火（いっせいしょうか）するよ！」',
        'ケント「パウ・パトロール、ぜんいんしゅつどう！ピンチのところを、いっきにけすぞー！💧✨」'
      );
    }

    setFires((prev) => {
      let extinguishedThisTurn = 0;
      const updated = prev.map((fire) => {
        if (fire.size <= 0) return fire;

        const isRyderTargetable = fire.hp <= fire.maxHp * 0.5;
        if (isRyderTargetable) {
          extinguishedThisTurn++;
          sound.playExtinguish();

          // Handle targetFireId clearing if it was the one being targeted
          if (fire.id === targetFireId) {
            setTargetFireId(null);
            setTruckSpraying(false);
            sound.playWaterSpray(false);
          }

          // Endless mode: remove and spawn new fire after delay
          if (difficulty === 'endless') {
            const targetId = fire.id;
            setTimeout(() => {
              setFires((p) => p.filter((f) => f.id !== targetId));
            }, 1500);

            setTimeout(() => {
              if (gameStateRef.current === 'playing') {
                setFires((p) => {
                  const newFire = generateSingleEndlessFire(p, selectedStage, extinguishedCountRef.current + 1, selectedCharacter);
                  return [...p, newFire];
                });
              }
            }, 4000);
          }

          return {
            ...fire,
            size: 0,
            hp: fire.maxHp // Fully restored
          };
        } else {
          // Splash helper effect for other fires: reduce fire size by 40% and recover some HP
          const newSize = Math.max(0, fire.size - 40);
          const newHp = Math.min(fire.maxHp, fire.hp + 30);

          if (newSize <= 0) {
            extinguishedThisTurn++;
            sound.playExtinguish();

            if (fire.id === targetFireId) {
              setTargetFireId(null);
              setTruckSpraying(false);
              sound.playWaterSpray(false);
            }

            if (difficulty === 'endless') {
              const targetId = fire.id;
              setTimeout(() => {
                setFires((p) => p.filter((f) => f.id !== targetId));
              }, 1500);

              setTimeout(() => {
                if (gameStateRef.current === 'playing') {
                  setFires((p) => {
                    const newFire = generateSingleEndlessFire(p, selectedStage, extinguishedCountRef.current + 1, selectedCharacter);
                    return [...p, newFire];
                  });
                }
              }, 4000);
            }
          }

          return {
            ...fire,
            size: newSize,
            hp: newHp
          };
        }
      });

      if (extinguishedThisTurn > 0) {
        setStats((s) => ({
          ...s,
          extinguishedFires: s.extinguishedFires + extinguishedThisTurn
        }));
      }

      return updated;
    });

    // Reset ryderActive state after 3.5 seconds
    setTimeout(() => {
      setRyderActive(false);
    }, 3500);
  };

  // Reset to Main Start Screen
  const handleGoToStart = () => {
    sound.playClick();
    sound.stopBGM();
    speech.cancel();
    setGameState('start_screen');
    if (selectedCharacter === 'chase') {
      triggerGuidance(
        'チェイスだよ！ぼくのポリスカーでおたすけチャレンジ、もう一回あそぶ？難易度（なんいど）を選んでスタートしてね！',
        'チェイスだよ！もういっかいあそぶ？なんいどをえらんでスタートしてね！🚔🌟'
      );
    } else {
      triggerGuidance(
        'マーシャルだよ！もう一回あそぶ？難易度（なんいど）を選んでスタートしてね！',
        'マーシャルだよ！もういっかいあそぶ？なんいどをえらんでスタートしてね！🚒'
      );
    }
  };

  // Helper score elements
  const currentExtinguished = difficulty === 'endless' ? stats.extinguishedFires : fires.filter(f => f.size <= 0).length;
  const totalFireCount = fires.length;
  const progressPercentage = totalFireCount > 0 
    ? Math.round((difficulty === 'endless' ? 0 : currentExtinguished / totalFireCount) * 100) 
    : 0;

  const renderRankingList = (limit = 5) => {
    let ranking = [];
    try {
      const stored = localStorage.getItem('paw_patrol_endless_ranking');
      ranking = stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error(e);
    }

    if (ranking.length === 0) {
      return (
        <div className="text-[10px] sm:text-xs text-slate-500 text-center py-4 font-bold font-sans">
          きろくが まだありません。エンドレスに ちょうせんしよう！🔥
        </div>
      );
    }

    return (
      <div className="w-full text-slate-800 font-sans text-[10px] sm:text-xs">
        <div className="grid grid-cols-12 gap-1 font-black bg-slate-100 p-1 sm:p-1.5 rounded-t-lg border-b border-slate-300 text-center text-slate-600">
          <div className="col-span-2">順位</div>
          <div className="col-span-3">ステージ</div>
          <div className="col-span-2">
            {selectedCharacter === 'chase' ? 'たすけた数' : selectedCharacter === 'skye' ? 'きゅうじょ数' : selectedCharacter === 'rubble' ? 'かたづけ数' : '消した数'}
          </div>
          <div className="col-span-2">時間</div>
          <div className="col-span-3">
            {selectedCharacter === 'chase' ? 'パワー' : selectedCharacter === 'skye' ? 'エネルギー' : selectedCharacter === 'rubble' ? 'パワー' : 'お水'}
          </div>
        </div>
        <div className="divide-y divide-slate-100 max-h-[120px] sm:max-h-[150px] overflow-y-auto scrollbar-thin">
          {ranking.slice(0, limit).map((entry: any, index: number) => {
            const stageName = STAGES.find(s => s.id === entry.stageId)?.name.split('（')[0] || entry.stageId;
            const isTop3 = index < 3;
            const medalColors = ['bg-yellow-400 text-yellow-950', 'bg-slate-300 text-slate-800', 'bg-amber-600 text-amber-50'];
            
            return (
              <div key={entry.id || index} className="grid grid-cols-12 gap-1 py-1 px-0.5 items-center text-center font-bold">
                <div className="col-span-2 flex justify-center">
                  {isTop3 ? (
                    <span className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center font-black text-[9px] sm:text-xs ${medalColors[index]} shadow-xs`}>
                      {index + 1}
                    </span>
                  ) : (
                    <span className="text-slate-500">{index + 1}</span>
                  )}
                </div>
                <div className="col-span-3 truncate text-left pl-1 text-[9px] sm:text-[11px]">{stageName}</div>
                <div className="col-span-2 text-red-600 text-[10px] sm:text-xs">{entry.extinguishedFires}こ</div>
                <div className="col-span-2 text-sky-600 text-[10px] sm:text-xs">{entry.elapsedTime}秒</div>
                <div className="col-span-3 text-blue-500 text-[10px] sm:text-xs">{entry.waterUsed}L</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div id="game-main-container" className="w-full min-h-screen sm:h-screen sm:max-h-screen flex flex-col bg-sky-50 overflow-y-auto sm:overflow-hidden">
      
      {/* Top Header Panel - Bright, inviting colors for kids */}
      <header id="game-header" className={`relative z-30 flex-shrink-0 border-b-4 px-3 py-1.5 sm:px-4 sm:py-2 text-white flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md select-none transition-colors duration-300 ${
        selectedCharacter === 'chase' ? 'bg-blue-600 border-blue-700 text-white' : selectedCharacter === 'skye' ? 'bg-pink-500 border-pink-600 text-white' : selectedCharacter === 'rubble' ? 'bg-yellow-500 border-yellow-600 text-slate-950' : 'bg-red-500 border-red-600 text-white'
      }`}>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cute face illustration */}
          <div className="relative shrink-0">
            {renderCharacterFace(selectedCharacter, "w-10 h-10 sm:w-12 sm:h-12")}
            <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-0.5 border border-white shadow-xs">
              <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current text-white">
                <path d="M12 2L2 22h20L12 2zm0 3.3l6.5 13.1H5.5L12 5.3z" />
              </svg>
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Rescue emblem badge */}
            <div className="bg-white rounded-full p-1 border-2 border-yellow-400 animate-pulse shadow">
              <svg viewBox="0 0 40 40" className="w-5 h-5 sm:w-7 sm:h-7">
                <path d="M 20 2 C 10 2, 2 10, 2 20 C 2 30, 20 38, 20 38 C 20 38, 38 30, 38 20 C 38 10, 30 2, 20 2 Z" fill={selectedCharacter === 'chase' ? '#2563eb' : selectedCharacter === 'skye' ? '#ec4899' : selectedCharacter === 'rubble' ? '#ca8a04' : '#ef4444'} />
                <path d="M 20 4 C 11 4, 4 11, 4 20 C 4 28, 20 35, 20 35 C 20 35, 36 28, 36 20 C 36 11, 29 4, 20 4 Z" fill="#ffffff" />
                {/* Shield star paw */}
                <circle cx="20" cy="21.5" r="5" fill={selectedCharacter === 'chase' ? '#2563eb' : selectedCharacter === 'skye' ? '#ec4899' : selectedCharacter === 'rubble' ? '#ca8a04' : '#ef4444'} />
                <circle cx="15" cy="15.5" r="2" fill={selectedCharacter === 'chase' ? '#2563eb' : selectedCharacter === 'skye' ? '#ec4899' : selectedCharacter === 'rubble' ? '#ca8a04' : '#ef4444'} />
                <circle cx="20" cy="13.5" r="2.2" fill={selectedCharacter === 'chase' ? '#2563eb' : selectedCharacter === 'skye' ? '#ec4899' : selectedCharacter === 'rubble' ? '#ca8a04' : '#ef4444'} />
                <circle cx="25" cy="15.5" r="2" fill={selectedCharacter === 'chase' ? '#2563eb' : selectedCharacter === 'skye' ? '#ec4899' : selectedCharacter === 'rubble' ? '#ca8a04' : '#ef4444'} />
              </svg>
            </div>
            <h1 className="text-base sm:text-lg md:text-2xl font-black font-sans tracking-wider drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
              {selectedCharacter === 'chase' ? 'チェイスの おたすけチャレンジ！' : selectedCharacter === 'skye' ? 'スカイの そらのきゅうじょチャレンジ！' : selectedCharacter === 'rubble' ? 'ラブルの がれきレスキューチャレンジ！' : 'マーシャルの しょうかゲーム！'}
            </h1>
          </div>
        </div>

        {/* Top toolbar buttons */}
        <div className="flex items-center gap-2">
          {/* Sound enable button */}
          <button
            id="sound-toggle-btn"
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              sound.playClick();
            }}
            className={`p-2.5 rounded-full border-2 font-bold shadow text-xs flex items-center gap-1 transition-all duration-200 active:scale-95 ${
              soundEnabled 
                ? 'bg-yellow-400 border-yellow-500 text-slate-800' 
                : 'bg-slate-400 border-slate-500 text-slate-100'
            }`}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span>{soundEnabled ? 'おと あり' : 'おと なし'}</span>
          </button>

          {/* Help navigation back to start */}
          {gameState === 'playing' && (
            <button
              id="back-to-start-btn"
              onClick={handleGoToStart}
              className="bg-sky-400 border-2 border-sky-500 hover:bg-sky-500 text-white font-bold px-3 py-1.5 rounded-full text-xs shadow flex items-center gap-1 transition-all active:scale-95"
            >
              <RotateCcw size={14} />
              <span>もどる</span>
            </button>
          )}
        </div>
      </header>

      {/* Real-time speech guidance subtitles */}
      <MarshallSpeechBubble 
        text={speechText} 
        isSpeaking={isSpeaking} 
        onReplay={handleReplaySpeech} 
        characterId={selectedCharacter}
      />

      {/* Real-time Top Progress Bar & Task Tracker */}
      {gameState === 'playing' && difficulty === 'endless' && (
        <div id="top-playing-progress-tracker" className={`relative z-10 flex-shrink-0 border-b-4 px-4 py-2 sm:py-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-inner select-none font-sans ${
          selectedCharacter === 'chase' ? 'bg-blue-50 border-blue-200/60' : selectedCharacter === 'skye' ? 'bg-pink-50 border-pink-200/60' : selectedCharacter === 'rubble' ? 'bg-yellow-50 border-yellow-200/60' : 'bg-amber-100 border-b-4 border-amber-300/60'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`rounded-full p-1 shadow-md border-2 border-white animate-bounce ${
              selectedCharacter === 'chase' ? 'bg-blue-600' : selectedCharacter === 'skye' ? 'bg-pink-500' : selectedCharacter === 'rubble' ? 'bg-yellow-500 text-slate-900' : 'bg-red-500'
            }`}>
              {selectedCharacter === 'chase' ? (
                <HelpCircle size={16} className="text-white fill-yellow-400 animate-pulse" />
              ) : selectedCharacter === 'skye' ? (
                <Heart size={16} className="text-white fill-pink-200 animate-pulse" />
              ) : selectedCharacter === 'rubble' ? (
                <Wrench size={16} className="text-slate-900 fill-amber-300 animate-pulse" />
              ) : (
                <Flame size={16} className="text-white fill-white animate-pulse" />
              )}
            </div>
            <span className="text-sm md:text-base font-black text-slate-800">
              {selectedCharacter === 'chase' ? 'エンドレスモードに ちょうせん中！🚔🌟' : selectedCharacter === 'skye' ? 'エンドレスモードに ちょうせん中！🚁💖' : selectedCharacter === 'rubble' ? 'エンドレスモードに ちょうせん中！🚧🚜' : 'エンドレスモードに ちょうせん中！🔥'}
            </span>
          </div>

          <div className="w-full md:w-3/5 flex flex-wrap sm:flex-nowrap items-center justify-end gap-2.5 sm:gap-4 font-black">
            <span className="text-xs sm:text-sm font-black text-purple-800 whitespace-nowrap bg-purple-100 px-3 py-1 rounded-full border border-purple-300 shadow-xs">
              {selectedCharacter === 'chase' ? 'たすけた数:' : selectedCharacter === 'skye' ? 'きゅうじょ数:' : selectedCharacter === 'rubble' ? 'がれきクリア数:' : '消した数:'} <span className="text-blue-600 text-sm sm:text-base font-black">{stats.extinguishedFires}{selectedCharacter === 'chase' ? 'にん' : selectedCharacter === 'rubble' ? 'こ' : 'にん'}</span>
            </span>
            <span className="text-xs sm:text-sm font-black text-sky-800 whitespace-nowrap bg-sky-100 px-3 py-1 rounded-full border border-sky-300 shadow-xs">
              じかん: <span className="text-blue-600 text-sm sm:text-base font-black">{elapsedTime}秒</span>
            </span>
            <span className="text-xs sm:text-sm font-black text-blue-800 whitespace-nowrap bg-blue-100 px-3 py-1 rounded-full border border-blue-200 shadow-xs">
              {selectedCharacter === 'chase' ? 'パワー:' : selectedCharacter === 'skye' ? 'おたすけ:' : selectedCharacter === 'rubble' ? 'パワー:' : 'お水:'} <span className="text-blue-600 text-sm sm:text-base font-black">{stats.waterUsed}L</span>
            </span>
          </div>
        </div>
      )}

      {/* NEW: Clean, Kids-Friendly Status and Rescue Bar outside the play area */}
      {gameState === 'playing' && (
        <div id="rescue-status-bar" className={`relative z-10 flex-shrink-0 text-white px-4 py-2 sm:py-2.5 border-b-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4 select-none font-sans ${
          selectedCharacter === 'chase' ? 'bg-blue-900 border-blue-950' : selectedCharacter === 'skye' ? 'bg-pink-900 border-pink-950' : selectedCharacter === 'rubble' ? 'bg-yellow-900 border-yellow-950 text-white' : 'bg-sky-900 border-b-4 border-sky-950'
        }`}>
          
          {/* Water / Energy level gauge if Hard or Endless */}
          {(difficulty === 'hard' || difficulty === 'endless') ? (
            <div className="w-full sm:w-1/2 flex items-center gap-2 bg-sky-950/50 px-2.5 py-1.5 rounded-xl border border-sky-700/60 shadow-inner">
              {selectedCharacter === 'chase' ? (
                <Sparkles size={14} className="text-yellow-300 animate-bounce fill-yellow-300 shrink-0" />
              ) : selectedCharacter === 'skye' ? (
                <Heart size={14} className="text-pink-300 animate-bounce fill-pink-300 shrink-0" />
              ) : selectedCharacter === 'rubble' ? (
                <Wrench size={14} className="text-yellow-400 animate-bounce fill-yellow-400 shrink-0" />
              ) : (
                <Droplet size={14} className="text-sky-300 animate-bounce fill-sky-300 shrink-0" />
              )}
              <span className="text-[11px] font-black text-sky-200 whitespace-nowrap">
                {selectedCharacter === 'chase' ? 'おたすけエネルギー:' : selectedCharacter === 'skye' ? 'きゅうじょエネルギー:' : selectedCharacter === 'rubble' ? 'がれきパワー:' : 'おみずタンク:'}
              </span>
              <div className="flex-grow bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-700 relative">
                <div 
                  style={{ width: `${waterLevel}%` }}
                  className={`h-full transition-all duration-150 rounded-full ${
                    waterLevel > 25 ? (selectedCharacter === 'chase' ? 'bg-yellow-400' : selectedCharacter === 'skye' ? 'bg-pink-400' : selectedCharacter === 'rubble' ? 'bg-yellow-500' : 'bg-sky-400') : 'bg-red-500 animate-pulse'
                  }`}
                />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-black text-white">
                  {waterLevel}%
                </span>
              </div>
              {waterLevel <= 25 && (
                <span className="text-[9px] font-black text-red-400 bg-red-950/80 px-2 py-0.5 rounded-md animate-pulse shrink-0 border border-red-500/30 whitespace-nowrap animate-bounce">
                  {selectedCharacter === 'chase' ? 'ココ！エネルギー！👇' : selectedCharacter === 'skye' ? 'ココ！チャージ！👇' : selectedCharacter === 'rubble' ? 'ココ！ジュウデン！👇' : 'ココ！おみず！👇'}
                </span>
              )}
            </div>
          ) : (
            // Easy/Normal mode supportive message
            <div className="w-full sm:w-1/2 flex items-center gap-2 bg-sky-950/30 px-2.5 py-1.5 rounded-xl border border-sky-800/20 text-sky-200 text-[11px]">
              <span className="font-black">
                {selectedCharacter === 'chase' 
                  ? '🚔 がんばれチェイス！ おたすけパワーは むげんだいだよ！✨'
                  : selectedCharacter === 'skye'
                  ? '🚁 がんばれスカイ！ きゅうじょエネルギーは むげんだいだよ！💖'
                  : selectedCharacter === 'rubble'
                  ? '🚧 がんばれラブル！ どくりょくパワーは むげんだいだよ！🚜✨'
                  : '🚒 がんばれマーシャル！ おみずは むげんだいだよ！✨'
                }
              </span>
            </div>
          )}

          {/* Special Move Gauge (Kent / Ryder Helper) */}
          <div className="w-full sm:w-1/2 flex items-center justify-between gap-2 bg-gradient-to-r from-blue-950/60 to-cyan-900/60 px-2.5 py-1.5 rounded-xl border border-cyan-800/60 shadow-inner">
            <div className="flex items-center gap-1.5 flex-grow">
              <div className="bg-cyan-500 rounded-full p-1 border border-cyan-300 shadow flex items-center justify-center animate-pulse shrink-0">
                <Star size={12} className="text-yellow-300 fill-yellow-300 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <span className="text-[11px] font-black text-cyan-200 whitespace-nowrap">ケントのメーター:</span>
              <div className="flex-grow bg-slate-800 h-4 rounded-full overflow-hidden border border-slate-700 relative min-w-[50px]">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: `${specialGauge}%` }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                />
                <span className="absolute inset-0 flex items-center justify-center text-[9px] font-mono font-black text-cyan-200">
                  {specialGauge}%
                </span>
              </div>
            </div>

            {/* Ryder Trigger Button */}
            {specialGauge >= 100 ? (
              <motion.button
                onClick={triggerSpecialMove}
                animate={{ scale: [1, 1.06, 1], rotate: [-1, 1, -1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-[10px] sm:text-xs py-1 px-3 rounded-full border border-amber-200 shadow-md transition-transform flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Sparkles size={11} className="text-yellow-800 fill-yellow-500" />
                <span>ケントをよぶ！🚨</span>
              </motion.button>
            ) : (
              <button
                disabled
                className="bg-slate-800 text-slate-400 font-bold text-[9px] py-1 px-2.5 rounded-full border border-slate-700 cursor-not-allowed shrink-0 whitespace-nowrap"
              >
                あと {Math.ceil((100 - specialGauge) / 34)}{selectedCharacter === 'chase' ? 'にん' : selectedCharacter === 'skye' ? 'にん' : 'この火'}
              </button>
            )}
          </div>

        </div>
      )}

      {/* Primary Gameplay Window Area */}
      <main className="relative z-0 flex-grow flex items-center justify-center p-1 sm:p-1.5 md:p-2.5 w-full h-auto min-h-0">
        <div 
          ref={containerRef}
          className={`relative w-full max-w-5xl bg-sky-200 rounded-2xl md:rounded-3xl border-4 md:border-8 border-amber-400 shadow-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 ${
            gameState === 'playing' 
              ? 'aspect-[16/9] min-h-[220px] max-h-[48vh] sm:max-h-[55vh] md:max-h-[58vh]' 
              : 'min-h-[380px] sm:min-h-[440px] max-h-[72vh] sm:max-h-[62vh] aspect-[4/3] sm:aspect-[16/9]'
          }`}
        >
          {/* Animated Background Image Layer */}
          <img 
            src={STAGES.find((s) => s.id === selectedStage)?.bgImage || "/src/assets/images/cartoon_town_bg_1783836636457.jpg"} 
            alt="Cartoon firefighting stage landscape" 
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />

          {/* Transparent safety overlay mask for visuals */}
          <div className="absolute inset-0 bg-sky-900/10 pointer-events-none" />

          {/* Interactive Game Elements */}
          <AnimatePresence>
            {/* 1. START SCREEN */}
            {gameState === 'start_screen' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`absolute inset-0 flex flex-col items-center justify-start overflow-y-auto p-3 sm:p-4 z-30 select-none text-white text-center scrollbar-thin py-6 transition-colors duration-300 ${
                  selectedCharacter === 'chase' 
                    ? 'bg-blue-800/95 text-white' 
                    : selectedCharacter === 'skye' 
                    ? 'bg-pink-800/95 text-white' 
                    : selectedCharacter === 'rubble' 
                    ? 'bg-yellow-500/95 text-slate-950' 
                    : 'bg-red-600/90 text-white'
                }`}
              >
                {/* Character Selection Row - Future proof & highly stylized */}
                <div className={`w-full max-w-sm sm:max-w-md backdrop-blur-xs border p-2 sm:p-3 rounded-2xl mb-3 sm:mb-4 shrink-0 flex-shrink-0 ${
                  selectedCharacter === 'rubble' ? 'bg-slate-900/10 border-slate-900/20' : 'bg-white/10 border-white/20'
                }`}>
                  <p className={`text-xs font-black mb-1.5 flex items-center justify-center gap-1 ${
                    selectedCharacter === 'rubble' ? 'text-amber-950' : 'text-yellow-300'
                  }`}>
                    🐾 キャラクターを えらんでね！ (Choose Hero)
                  </p>
                  <div className="flex gap-3 justify-center items-center">
                    {CHARACTERS.map((char) => {
                      const isSelected = selectedCharacter === char.id;
                      return (
                        <button
                          key={char.id}
                          id={`char-select-btn-${char.id}`}
                          onClick={() => {
                            sound.playClick();
                            setSelectedCharacter(char.id);
                            
                            // Speak initial callout depending on selection
                            if (char.id === 'skye') {
                              triggerGuidance(
                                'スカイだよ！ヘリコプターでおそらの救助活動（きゅうじょかつどう）スタート！難易度（なんいど）を選んでね！',
                                'スカイだよ！ヘリコプターできゅうじょにいくよ！なんいどをえらんでね！🚁💖'
                              );
                            } else if (char.id === 'chase') {
                              triggerGuidance(
                                'チェイスだよ！ポリスカーでおたすけチャレンジスタート！難易度（なんいど）を選んでね！',
                                'チェイスだよ！ポリスカーでおたすけチャレンジスタート！難易度（なんいど）を選んでね！🚔🌟'
                              );
                            } else if (char.id === 'rubble') {
                              triggerGuidance(
                                'ラブルだよ！パワーショベルで、どうろをふさいでいる岩やガレキをおかたづけするよ！難易度（なんいど）を選んでね！',
                                'ラブルだよ！パワーショベルで、どうろのガレキをおかたづけするよ！なんいどをえらんでね！🚧💛'
                              );
                            } else {
                              triggerGuidance(
                                'マーシャルだよ！消防車（しょうぼうしゃ）のゲームへようこそ！難易度（なんいど）を選んでね！',
                                'マーシャルだよ！しょうぼうしゃのゲームへようこそ！なんいどをえらんでね！🚒'
                              );
                            }
                          }}
                          className={`relative flex flex-col items-center p-2 rounded-xl border border-b-2 sm:border-2 sm:border-b-4 transition-all duration-200 cursor-pointer ${
                            isSelected 
                              ? 'bg-yellow-400 border-yellow-300 text-slate-900 font-extrabold scale-105 shadow-md' 
                              : 'bg-white/90 border-slate-300 text-slate-800 font-bold hover:bg-white'
                          }`}
                          style={{ width: '100px' }}
                        >
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white mb-1 bg-sky-100 shadow-inner flex items-center justify-center">
                            {renderCharacterFace(char.id, "w-full h-full")}
                          </div>
                          <span className="text-xs tracking-tight whitespace-nowrap font-sans font-black">{char.name}</span>
                          {isSelected && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[9px] font-black border border-white flex items-center justify-center animate-bounce">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Title Card */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className={`mb-2 sm:mb-4 bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-md sm:shadow-xl border-2 sm:border-4 border-yellow-400 max-w-sm sm:max-w-md w-full flex-shrink-0 ${
                    selectedCharacter === 'chase' ? 'text-blue-600' : selectedCharacter === 'skye' ? 'text-pink-600' : selectedCharacter === 'rubble' ? 'text-amber-600' : 'text-red-600'
                  }`}
                >
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-black mb-0.5 sm:mb-1 font-sans">
                    {selectedCharacter === 'chase' ? '🚔 おたすけチャレンジ！ 🚔' : selectedCharacter === 'skye' ? '🚁 フライングきゅうじょ！ 💖' : selectedCharacter === 'rubble' ? '🚧 がれきレスキュー！ 🚧' : '🔥 しゅつどうだ！ 🔥'}
                  </h2>
                  <p className="text-slate-700 text-xs sm:text-sm font-bold font-sans leading-normal">
                    {selectedCharacter === 'chase' 
                      ? 'チェイスのポリスカーでおたすけパワーをはっしゃして、困っているみんなを全員助けよう！'
                      : selectedCharacter === 'skye'
                      ? 'スカイのヘリコプターにのって、高いところや木の上、崖の下でこまっている人をきゅうじょしよう！'
                      : selectedCharacter === 'rubble'
                      ? 'ラブルのショベルカーで、どうろをふさいでいる岩やガレキをおかたづけしよう！'
                      : 'マーシャルのしょうぼうしゃでお水をかけて、まちの火事をぜんぶ消そう！'
                    }
                  </p>
                </motion.div>

                {/* Stage Selection */}
                <div className={`w-full max-w-lg mb-2 sm:mb-4 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex-shrink-0 border ${
                  selectedCharacter === 'rubble' ? 'bg-slate-900/10 border-slate-900/20' : 'bg-white/10 border-white/20'
                }`}>
                  <p className={`text-xs sm:text-sm font-black mb-1.5 ${
                    selectedCharacter === 'rubble' ? 'text-amber-950' : 'text-yellow-300'
                  }`}>
                    👇 ぶたい（ステージ）を えらんでね！
                  </p>
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {STAGES.map((stg) => {
                      const isSelected = selectedStage === stg.id;
                      return (
                        <button
                          key={stg.id}
                          id={`stage-btn-${stg.id}`}
                          onClick={() => {
                            sound.playClick();
                            setSelectedStage(stg.id);
                          }}
                          className={`relative flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg sm:rounded-xl border border-b-2 sm:border-2 sm:border-b-4 transition-all hover:scale-102 active:scale-98 ${
                            isSelected 
                              ? 'bg-amber-400 border-yellow-300 text-slate-900 font-extrabold shadow-sm scale-103 z-10' 
                              : 'bg-slate-100 border-slate-300 text-slate-700 font-bold hover:bg-slate-200'
                          }`}
                        >
                          <span className="text-lg sm:text-2xl mb-0.5 sm:mb-1">{stg.emoji}</span>
                          <span className="text-[10px] sm:text-xs leading-none whitespace-nowrap">{stg.name.split('（')[0]}</span>
                          {isSelected && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 text-[8px] border border-white animate-bounce">
                              ★
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {/* Selected Stage Slogan / Tip */}
                  <div className={`mt-1.5 text-[10px] sm:text-xs font-bold leading-tight ${
                    selectedCharacter === 'rubble' ? 'text-amber-900' : 'text-amber-200'
                  }`}>
                    {STAGES.find((s) => s.id === selectedStage)?.slogan}
                  </div>
                </div>

                {/* Difficulty selectors */}
                <div className={`w-full max-w-lg mb-2 sm:mb-4 p-2 sm:p-3 rounded-xl sm:rounded-2xl flex-shrink-0 border ${
                  selectedCharacter === 'rubble' ? 'bg-slate-900/10 border-slate-900/20' : 'bg-white/10 border-white/20'
                }`}>
                  <p className={`text-xs sm:text-sm font-black mb-1.5 ${
                    selectedCharacter === 'rubble' ? 'text-amber-950' : 'text-yellow-300'
                  }`}>
                    👇 むずかしさを えらんでね！
                  </p>
                  <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
                    {(Object.keys(DIFFICULTY_LABELS) as Difficulty[]).map((diff) => {
                      const cfg = DIFFICULTY_LABELS[diff];
                      return (
                        <button
                          key={diff}
                          id={`diff-btn-${diff}`}
                          onClick={() => handleStartGame(diff)}
                          className={`flex flex-col items-center justify-center p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl border border-b-2 sm:border-b-4 font-black transition-all hover:scale-102 active:scale-98 ${cfg.color}`}
                        >
                          <span className="text-xs sm:text-base md:text-lg font-sans mb-0.5 sm:mb-1 leading-tight">{cfg.title}</span>
                          <div className="flex gap-0.5 mb-0.5 sm:mb-1">
                            {Array.from({ length: cfg.stars }).map((_, i) => (
                              <Star key={i} size={10} className="fill-yellow-300 text-yellow-300 sm:w-3.5 sm:h-3.5" />
                            ))}
                          </div>
                          <span className="text-[8px] sm:text-[10px] leading-tight opacity-90">{cfg.desc.split('！')[0]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Ranking View Button */}
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowRankingModal(true);
                  }}
                  className="mb-2 sm:mb-4 bg-amber-400 hover:bg-amber-500 text-slate-900 border-2 border-amber-300 font-black text-xs sm:text-sm py-1.5 px-5 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Trophy size={14} className="text-yellow-700 fill-yellow-400 animate-bounce" />
                  <span>🏆 エンドレスランキングをみる 🏆</span>
                </button>
              </motion.div>
            )}

            {/* Active Play HUD Overlays have been moved outside the play canvas to keep screen visibility clean and clear! */}

            {/* 3. VICTORY SUCCESS MODAL SCREEN */}
            {gameState === 'victory' && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="absolute inset-0 bg-emerald-600/95 flex flex-col items-center justify-start overflow-y-auto p-3 sm:p-4 z-35 select-none text-white text-center scrollbar-thin py-6"
              >
                {/* Giant Golden Trophy Anim */}
                <motion.div
                  animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8 }}
                  className="mb-2 text-yellow-300 flex justify-center flex-shrink-0"
                >
                  <Trophy className="w-12 h-12 sm:w-16 sm:h-16 fill-yellow-400 drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]" />
                </motion.div>

                {/* Animated sparks/stars behind trophy */}
                <div className="absolute top-10 left-10 text-yellow-300 opacity-60 animate-bounce pointer-events-none">
                  <Star size={24} className="fill-yellow-300" />
                </div>
                <div className="absolute top-16 right-12 text-yellow-300 opacity-60 animate-bounce pointer-events-none" style={{ animationDelay: '0.4s' }}>
                  <Star size={16} className="fill-yellow-300" />
                </div>

                <h2 className="text-xl sm:text-3xl md:text-4xl font-black mb-0.5 sm:mb-1 font-sans text-yellow-200 tracking-widest drop-shadow flex-shrink-0">
                  🎉 にんむかんりょう！ 🎉
                </h2>
                <p className="text-xs sm:text-base font-black mb-2 sm:mb-4 font-sans text-white flex-shrink-0">
                  {selectedCharacter === 'chase' 
                    ? 'チェイスといっしょに、街の平和（へいわ）をまもったよ！🚔🌟' 
                    : selectedCharacter === 'skye' 
                    ? 'スカイといっしょに、街の平和（へいわ）をまもったよ！🚁💖' 
                    : selectedCharacter === 'rubble' 
                    ? 'ラブルといっしょに、街のがれきをきれいにかたづけたよ！🚧🚜' 
                    : 'マーシャルといっしょに、街の平和（へいわ）をまもったよ！🚒🔥'}
                </p>

                {/* Performance stats box */}
                <div className="w-full max-w-sm bg-white text-slate-800 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl border-2 sm:border-4 border-yellow-400 mb-3 sm:mb-6 font-sans flex-shrink-0">
                  <h3 className="text-red-500 font-black text-xs sm:text-sm border-b pb-1 sm:pb-1.5 mb-1.5 sm:mb-2.5 flex items-center justify-center gap-1">
                    <ShieldCheck size={14} />
                    レスキューきろく（リザルト）
                  </h3>
                  <div className="space-y-1 text-[10px] sm:text-xs font-bold text-left px-1 sm:px-2">
                    <div className="flex justify-between">
                      <span>難易度（なんいど）:</span>
                      <span className="text-orange-500 font-black">{DIFFICULTY_LABELS[difficulty].title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{selectedCharacter === 'chase' ? 'たすけたおともだち:' : selectedCharacter === 'skye' ? 'きゅうじょした数:' : selectedCharacter === 'rubble' ? 'かたづけたがれき:' : '消した火の数:'}</span>
                      <span className="text-red-500 font-black">{currentExtinguished}こ / {totalFireCount}こ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>かかった時間:</span>
                      <span className="text-sky-600 font-black">{elapsedTime}秒（びょう）</span>
                    </div>
                    {difficulty === 'hard' && (
                      <div className="flex justify-between">
                        <span>{selectedCharacter === 'chase' ? 'つかったパワー:' : selectedCharacter === 'skye' ? 'つかったエネルギー:' : selectedCharacter === 'rubble' ? 'つかったパワー:' : 'つかったお水の量:'}</span>
                        <span className="text-blue-500 font-black">
                          {stats.waterUsed}{selectedCharacter === 'chase' || selectedCharacter === 'skye' || selectedCharacter === 'rubble' ? '' : 'リットル'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Return/Replay buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-sm justify-center px-4 flex-shrink-0">
                  <button
                    id="replay-victory-btn"
                    onClick={() => handleStartGame(difficulty)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-800 border-b-2 sm:border-b-4 border-yellow-600 font-black text-sm sm:text-lg px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw size={16} />
                    もういちど あそぶ！
                  </button>
                  <button
                    id="back-victory-btn"
                    onClick={handleGoToStart}
                    className="bg-white hover:bg-slate-100 text-red-600 border-b-2 sm:border-b-4 border-slate-300 font-black text-sm sm:text-lg px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow transition-transform hover:scale-105 active:scale-95 text-center"
                  >
                    メニューにもどる
                  </button>
                </div>
              </motion.div>
            )}

            {/* 3.5. GAME OVER MODAL SCREEN */}
            {gameState === 'game_over' && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="absolute inset-0 bg-red-600/95 flex flex-col items-center justify-start overflow-y-auto p-3 sm:p-4 z-35 select-none text-white text-center scrollbar-thin py-6"
              >
                {/* Marshall rescue helmet / badge */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="mb-2 text-red-100 flex justify-center flex-shrink-0"
                >
                  <svg viewBox="0 0 40 40" className="w-10 h-10 sm:w-16 sm:h-16 drop-shadow">
                    <circle cx="20" cy="20" r="18" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
                    <path d="M 10 20 L 20 10 L 30 20 L 25 32 L 15 32 Z" fill="#b91c1c" />
                    <path d="M 20 14 Q 24 19 20 25 Q 16 19 20 14" fill="#facc15" />
                  </svg>
                </motion.div>

                <h2 className="text-xl sm:text-3xl md:text-4xl font-black mb-0.5 sm:mb-1 font-sans text-yellow-300 tracking-wider drop-shadow flex-shrink-0">
                  {selectedCharacter === 'chase' ? '🚔 おしい！がんばったね！ 🚔' : selectedCharacter === 'skye' ? '💖 おしい！がんばったね！ 💖' : selectedCharacter === 'rubble' ? '🪨 おしい！がんばったね！ 🚧' : '🔥 おしい！がんばったね！ 🔥'}
                </h2>
                <p className="text-xs sm:text-sm font-bold mb-2 sm:mb-4 font-sans text-white max-w-md flex-shrink-0">
                  {selectedCharacter === 'rubble' ? (
                    <>たいへん！<span className="text-yellow-200 font-black">{destroyedBuildingName}</span>ががれきでうもれちゃったよ。🚧</>
                  ) : selectedCharacter === 'chase' || selectedCharacter === 'skye' ? (
                    <>たいへん！がんばったけどおともだちがたすけられなかったよ。💦</>
                  ) : (
                    <>たいへん！<span className="text-yellow-200 font-black">{destroyedBuildingName}</span>がもえちゃったよ。🔥</>
                  )}
                  <br />
                  でも、パウ・パトロールはあきらめない！もう一回やってみよう！
                </p>

                {/* Performance stats box */}
                <div className="w-full max-w-sm bg-white text-slate-800 p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl border-2 sm:border-4 border-orange-400 mb-3 sm:mb-6 font-sans flex-shrink-0">
                  <h3 className="text-orange-500 font-black text-xs sm:text-sm border-b pb-1 sm:pb-1.5 mb-1.5 sm:mb-2.5 flex items-center justify-center gap-1">
                    <ShieldCheck size={14} />
                    しゅつどうきろく
                  </h3>
                  <div className="space-y-1 text-[10px] sm:text-xs font-bold text-left px-1 sm:px-2">
                    <div className="flex justify-between">
                      <span>難易度（なんいど）:</span>
                      <span className="text-orange-500 font-black">{DIFFICULTY_LABELS[difficulty].title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{selectedCharacter === 'chase' ? 'たすけたおともだち:' : selectedCharacter === 'skye' ? 'きゅうじょした数:' : selectedCharacter === 'rubble' ? 'かたづけたがれき:' : '消した火の数:'}</span>
                      <span className="text-red-500 font-black">
                        {difficulty === 'endless' ? `${stats.extinguishedFires}こ` : `${currentExtinguished}こ / ${totalFireCount}こ`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>がんばった時間:</span>
                      <span className="text-sky-600 font-black">{elapsedTime}秒（びょう）</span>
                    </div>
                    {(difficulty === 'hard' || difficulty === 'endless') && (
                      <div className="flex justify-between">
                        <span>{selectedCharacter === 'chase' ? 'つかったパワー:' : selectedCharacter === 'skye' ? 'つかったエネルギー:' : selectedCharacter === 'rubble' ? 'つかったパワー:' : 'つかったお水の量:'}</span>
                        <span className="text-blue-500 font-black">
                          {stats.waterUsed}{selectedCharacter === 'chase' || selectedCharacter === 'skye' || selectedCharacter === 'rubble' ? '' : 'リットル'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Endless ranking scoreboard show */}
                  {difficulty === 'endless' && (
                    <div className="mt-3 border-t pt-2.5">
                      <p className="text-purple-600 font-black text-center text-xs mb-1.5 flex items-center justify-center gap-1">
                        🏆 エンドレスランキング (TOP 5)
                      </p>
                      {renderRankingList(5)}
                    </div>
                  )}
                </div>

                {/* Return/Replay buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-sm justify-center px-4 flex-shrink-0">
                  <button
                    id="replay-gameover-btn"
                    onClick={() => handleStartGame(difficulty)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-800 border-b-2 sm:border-b-4 border-yellow-600 font-black text-sm sm:text-lg px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <RotateCcw size={16} />
                    もういちど ちょうせん！
                  </button>
                  <button
                    id="back-gameover-btn"
                    onClick={handleGoToStart}
                    className="bg-white hover:bg-slate-100 text-red-600 border-b-2 sm:border-b-4 border-slate-300 font-black text-sm sm:text-lg px-4 py-2 sm:px-6 sm:py-3 rounded-full shadow transition-transform hover:scale-105 active:scale-95 text-center"
                  >
                    メニューにもどる
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 4. ACTIVE GAMEPLAY LAYER */}
          {gameState === 'playing' && (
            <div id="active-playing-viewport" className="absolute inset-0 w-full h-full">
              
              {/* Fire Entities rendering (tappable items) */}
              {fires.map((fire) => (
                <FireItem
                  key={fire.id}
                  id={fire.id}
                  x={fire.x}
                  y={fire.y}
                  size={fire.size}
                  maxSize={fire.maxSize}
                  type={fire.type}
                  name={fire.name || 'ひ'}
                  isTargeted={targetFireId === fire.id}
                  onSelect={() => handleFireSelect(fire)}
                  hp={fire.hp}
                  maxHp={fire.maxHp}
                  characterId={selectedCharacter}
                />
              ))}

              {/* Cute interactive escaping citizens who react dynamically to fires */}
              {fires.map((fire, idx) => {
                const types: ('boy' | 'girl' | 'cat' | 'mayor')[] = ['boy', 'girl', 'cat', 'mayor'];
                const type = types[idx % types.length];

                const isPanic = fire.size > 0;
                const isAllCleared = fires.every((f) => f.size <= 0);

                // Set Y-offset depending on the fire type to make them stand nicely in front of the burning object.
                // Since citizen translates by -100% on Y, if we place them at fire.y + offset, they stand beautifully in front of the object.
                let yOffset = 10;
                if (fire.type === 'house' || fire.type === 'shop') {
                  yOffset = 12;
                } else if (fire.type === 'tree') {
                  yOffset = 13;
                } else {
                  yOffset = 9;
                }

                // Small horizontal offset so citizens don't block the exact center of burning objects
                const xOffset = (idx % 2 === 0) ? -6 : 6;
                let citX = fire.x + xOffset;
                if (citX < 8) citX = fire.x + 5;
                if (citX > 92) citX = fire.x - 5;
                const citY = fire.y + yOffset;

                return (
                  <Citizen
                    key={`cit-${fire.id}`}
                    id={`cit-${fire.id}`}
                    type={type}
                    x={citX}
                    y={citY}
                    isPanic={isPanic && !isAllCleared}
                    isCleared={isAllCleared}
                    characterId={selectedCharacter}
                  />
                );
              })}

              {/* Real-time cascading Water Spray Overlay */}
              <WaterSprayCanvas
                isActive={truckSpraying && !isRefilling}
                truckXPercent={truckX}
                targetXPercent={
                  targetFireId 
                    ? (fires.find(f => f.id === targetFireId)?.x ?? null) 
                    : null
                }
                targetYPercent={
                  targetFireId 
                    ? (fires.find(f => f.id === targetFireId)?.y ?? null) 
                    : null
                }
                containerWidth={containerDimensions.width}
                containerHeight={containerDimensions.height}
                burstTrigger={burstTrigger}
                characterId={selectedCharacter}
              />

              {/* Skye's Custom Rescue Winch Hoist */}
              {selectedCharacter === 'skye' && targetFireId && (
                (() => {
                  const targetFire = fires.find((f) => f.id === targetFireId);
                  return targetFire ? (
                    <SkyeRescueHoist
                      truckX={truckX}
                      targetX={targetFire.x}
                      targetY={targetFire.y}
                      targetType={targetFire.type}
                      isActive={truckSpraying && !isRefilling}
                    />
                  ) : null;
                })()
              )}

              {/* Ground road panel where fire truck drives */}
              <div id="road-overlay" className="absolute bottom-0 inset-x-0 h-[15%] bg-slate-800/20 border-t-2 border-slate-800/10 pointer-events-none" />

              {/* Sliding, animated Fire Truck item */}
              <FireTruck
                xPercent={truckX}
                isMoving={truckMoving}
                isSpraying={truckSpraying && !isRefilling}
                angleToFire={angleToFire}
                onNozzleClick={handleNozzleClick}
                characterId={selectedCharacter}
              />

              {/* Water Fire Hydrant / Energy Refill Station (Needed for Hard/Endless mode) */}
              {(difficulty === 'hard' || difficulty === 'endless') && (
                <div 
                  id="hydrant-refill-station"
                  onClick={handleRefillHydrant}
                  className={`absolute right-4 bottom-14 md:bottom-20 z-25 p-2 border-3 border-white rounded-2xl shadow-lg cursor-pointer select-none transition-all duration-200 hover:scale-105 active:scale-95 flex flex-col items-center justify-center text-white ${
                    selectedCharacter === 'chase' ? 'bg-yellow-500 hover:bg-yellow-600' : selectedCharacter === 'rubble' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'
                  } ${
                    waterLevel <= 25 ? 'animate-bounce border-yellow-400' : ''
                  }`}
                >
                  {/* Glowing warning arrow */}
                  {waterLevel <= 25 && (
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                      className="absolute -top-6 text-yellow-300 font-sans font-black text-xs bg-red-600 px-1.5 py-0.5 rounded shadow border border-white whitespace-nowrap"
                    >
                      {selectedCharacter === 'chase' ? 'ココ！ジュウデン！' : selectedCharacter === 'rubble' ? 'ココ！パワーチャージ！' : 'ココ！おみず！'}
                    </motion.div>
                  )}
                  
                  {selectedCharacter === 'chase' ? (
                    /* Custom SVG Energy Charger Battery */
                    <svg viewBox="0 0 40 40" className="w-12 h-12">
                      <rect x="14" y="6" width="12" height="4" fill="#ca8a04" rx="1" />
                      <rect x="10" y="10" width="20" height="24" fill="#eab308" rx="3" />
                      <polygon points="20,13 14,23 19,23 17,31 26,20 21,20" fill="#ffffff" />
                    </svg>
                  ) : selectedCharacter === 'rubble' ? (
                    /* Custom SVG Toolbox / Construction supply station */
                    <svg viewBox="0 0 40 40" className="w-12 h-12">
                      <rect x="8" y="14" width="24" height="18" fill="#ea580c" rx="2" />
                      <rect x="14" y="8" width="12" height="6" fill="none" stroke="#ea580c" strokeWidth="3" rx="1" />
                      <line x1="8" y1="20" x2="32" y2="20" stroke="#f97316" strokeWidth="2" />
                      <rect x="17" y="19" width="6" height="4" fill="#facc15" rx="1" />
                    </svg>
                  ) : (
                    /* Custom SVG Fire Hydrant */
                    <svg viewBox="0 0 40 40" className="w-12 h-12">
                      {/* Top dome */}
                      <path d="M 12 15 A 8 8 0 0 1 28 15 Z" fill="#60a5fa" />
                      {/* Main body */}
                      <rect x="12" y="15" width="16" height="20" fill="#3b82f6" rx="2" />
                      {/* Top cap */}
                      <rect x="18" y="4" width="4" height="4" fill="#1d4ed8" rx="0.5" />
                      {/* Side nozzle outlets */}
                      <rect x="8" y="18" width="4" height="6" fill="#1d4ed8" />
                      <rect x="28" y="18" width="4" height="6" fill="#1d4ed8" />
                      {/* Center nut */}
                      <circle cx="20" cy="22" r="3" fill="#ffffff" />
                      {/* Ground base flange */}
                      <rect x="10" y="34" width="20" height="3" fill="#1e3a8a" />
                    </svg>
                  )}
                  
                  <span className="text-[10px] font-black font-sans leading-none tracking-wide text-center mt-1 whitespace-nowrap">
                    {selectedCharacter === 'chase' ? 'エネルギー補給' : selectedCharacter === 'rubble' ? 'がれきパワー補給' : 'おみず補給'}
                  </span>
                </div>
              )}

              {/* SPECIAL MOVE WATER SPRAY / RESCUE NETS & FLOATING SPEECH BUBBLE */}
              <AnimatePresence>
                {ryderActive && (
                  <>
                    {/* SVG Canvas for Majestic Arcing Streams */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-25" style={{ transform: 'translate3d(0,0,0)' }}>
                      <defs>
                        <linearGradient id="ryder-water-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor={selectedCharacter === 'skye' ? "#db2777" : selectedCharacter === 'chase' ? "#eab308" : "#2563eb"} stopOpacity="0.8" />
                          <stop offset="40%" stopColor={selectedCharacter === 'skye' ? "#ec4899" : selectedCharacter === 'chase' ? "#facc15" : "#3b82f6"} stopOpacity="0.95" />
                          <stop offset="70%" stopColor={selectedCharacter === 'skye' ? "#fbcfe8" : selectedCharacter === 'chase' ? "#fde047" : "#60a5fa"} stopOpacity="0.95" />
                          <stop offset="100%" stopColor={selectedCharacter === 'skye' ? "#ffffff" : selectedCharacter === 'chase' ? "#fef08a" : "#93c5fd"} stopOpacity="1" />
                        </linearGradient>
                      </defs>

                      {fires.map((fire) => {
                        // Check if fire has been extinguished prior to this trigger
                        if (fire.size <= 0 && fire.hp === fire.maxHp) return null;

                        // Check if it's targeted for Ryder's direct help (HP <= 50%) or gets helper splash
                        const isRyderTargetable = fire.hp <= fire.maxHp * 0.5;

                        // Start: position of the fire truck nozzle (road y is around 88%)
                        const x1 = truckX;
                        const y1 = 88;
                        const x2 = fire.x;
                        const y2 = fire.y;

                        // Calculate curved bezier point for a cool rainbow arch
                        const cx = (x1 + x2) / 2;
                        const cy = Math.min(y1, y2) - 20;

                        const pathStr = `M ${x1}% ${y1}% Q ${cx}% ${cy}% ${x2}% ${y2}%`;

                        return (
                          <g key={`ryder-spray-${fire.id}`}>
                            {/* 1. Broad outer stream */}
                            <motion.path
                              d={pathStr}
                              fill="none"
                              stroke="url(#ryder-water-gradient)"
                              strokeWidth={isRyderTargetable ? "16" : "8"}
                              strokeLinecap="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                            />

                            {/* 2. Concentrated core stream */}
                            <motion.path
                              d={pathStr}
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth={isRyderTargetable ? "5" : "2.5"}
                              strokeLinecap="round"
                              strokeDasharray="12 16"
                              initial={{ pathLength: 0, strokeDashoffset: 0 }}
                              animate={{ pathLength: 1, strokeDashoffset: -200 }}
                              exit={{ opacity: 0 }}
                              transition={{ 
                                pathLength: { duration: 0.7, ease: "easeOut" },
                                strokeDashoffset: { repeat: Infinity, duration: 1.2, ease: "linear" }
                              }}
                            />

                            {/* 3. High-impact splash rings at fire position */}
                            <foreignObject
                              x={`${fire.x}%`}
                              y={`${fire.y}%`}
                              className="overflow-visible"
                              width="1"
                              height="1"
                            >
                              <div className="relative -left-[50px] -top-[50px] w-[100px] h-[100px] flex items-center justify-center">
                                {/* Shockwave expanding ring */}
                                <motion.div
                                  initial={{ scale: 0.2, opacity: 0 }}
                                  animate={{ scale: [0.4, 2.2], opacity: [0.95, 0] }}
                                  transition={{ repeat: 3, duration: 0.85, ease: "easeOut" }}
                                  className={`absolute w-20 h-20 rounded-full border-4 ${selectedCharacter === 'skye' ? 'border-pink-300 bg-pink-400/25' : selectedCharacter === 'chase' ? 'border-yellow-300 bg-yellow-400/25' : 'border-cyan-300 bg-sky-400/25'}`}
                                />
                                <motion.div
                                  initial={{ scale: 0.1, opacity: 0 }}
                                  animate={{ scale: [0.2, 1.6], opacity: [0.9, 0] }}
                                  transition={{ repeat: 3, duration: 0.85, delay: 0.25, ease: "easeOut" }}
                                  className="absolute w-20 h-20 rounded-full border-2 border-white bg-blue-300/15"
                                />

                                {/* Outward spraying droplets */}
                                {[...Array(8)].map((_, i) => {
                                  const angle = (i * 360) / 8;
                                  const rad = (angle * Math.PI) / 180;
                                  const distance = isRyderTargetable ? 55 : 35;
                                  const tx = Math.cos(rad) * distance;
                                  const ty = Math.sin(rad) * distance;

                                  return (
                                    <motion.div
                                      key={i}
                                      initial={{ x: 0, y: 0, scale: 0.6, opacity: 1 }}
                                      animate={{ x: tx, y: ty, scale: [1, 0.1], opacity: [1, 0] }}
                                      transition={{ repeat: 2, duration: 0.8, ease: "easeOut" }}
                                      className={`absolute w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${selectedCharacter === 'skye' ? 'bg-pink-200' : selectedCharacter === 'chase' ? 'bg-yellow-200' : 'bg-cyan-200'}`}
                                    />
                                  );
                                })}
                              </div>
                            </foreignObject>
                          </g>
                        );
                      })}
                    </svg>

                    {/* Floating Kent dialogue cartoon bubble overlay */}
                    <motion.div
                      initial={{ opacity: 0, y: 40, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 40, scale: 0.85 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="absolute bottom-16 right-4 sm:right-6 md:right-10 z-30 flex items-end gap-2.5 sm:gap-3 max-w-[270px] sm:max-w-sm pointer-events-auto"
                    >
                      {/* Speech bubble */}
                      <div className={`relative bg-white border-4 rounded-2xl p-2.5 sm:p-3 shadow-2xl text-slate-800 text-[10px] sm:text-xs font-black font-sans leading-relaxed flex-grow ${selectedCharacter === 'skye' ? 'border-pink-400' : selectedCharacter === 'chase' ? 'border-yellow-400' : 'border-cyan-400'}`}>
                        {/* Triangle bubble arrow */}
                        <div className={`absolute right-[-14px] bottom-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-12 ${selectedCharacter === 'skye' ? 'border-l-pink-400' : selectedCharacter === 'chase' ? 'border-l-yellow-400' : 'border-l-cyan-400'}`} />
                        <div className="absolute right-[-8px] bottom-4.5 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-l-10 border-l-white" />
                        
                        <p className={`${selectedCharacter === 'skye' ? 'text-pink-600' : selectedCharacter === 'chase' ? 'text-yellow-600' : 'text-cyan-600'} font-extrabold text-[11px] sm:text-xs mb-0.5 flex items-center gap-1`}>
                          <Star size={11} className="fill-yellow-300 text-yellow-500 animate-spin" style={{ animationDuration: '3s' }} />
                          ケント（Kent）
                        </p>
                        <p className="text-slate-800 font-extrabold leading-snug">
                          {selectedCharacter === 'skye' 
                            ? '「パウ・パトロール、ぜんいんしゅつどう！こまっているおともだちをいっきにきゅうじょするよ！🚁✨」'
                            : selectedCharacter === 'chase' 
                            ? '「パウ・パトロール、ぜんいんしゅつどう！こまっているみんなをいっきにおたすけするよ！🌟✨」'
                            : '「パウ・パトロール、ぜんいんしゅつどう！ピンチのたてものをいっきにしょうかするよ！💦✨」'
                          }
                        </p>
                      </div>

                      {/* Character avatar circular badge */}
                      <div className="shrink-0 flex flex-col items-center">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-tr from-rose-500 via-yellow-400 to-indigo-600 rounded-full border-4 border-yellow-400 flex items-center justify-center shadow-lg overflow-hidden relative">
                          <img
                            src="/src/assets/images/ryder_kent_face_1784145449509.jpg"
                            alt="ケント"
                            className="w-full h-full object-cover object-center"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute bottom-1 right-1 text-yellow-300 animate-ping text-[10px]">★</div>
                        </div>
                        <div className="bg-yellow-400 text-slate-950 border-2 border-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-md -mt-2 z-10 whitespace-nowrap">
                          ケント
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      
      {/* Real-time Bottom Progress Bar (しょうかメーター & タスク追跡) */}
      {gameState === 'playing' && difficulty !== 'endless' && (
        <div id="bottom-playing-progress-tracker" className="relative z-10 flex-shrink-0 bg-amber-50 border-t-4 border-amber-300 px-4 py-2 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 shadow-md select-none font-sans">
          {/* Left: Remaining Fire count */}
          <div className="flex items-center gap-2">
            <div className={`rounded-full p-1 shadow-sm border border-white animate-bounce ${
              selectedCharacter === 'chase' ? 'bg-blue-500' : selectedCharacter === 'skye' ? 'bg-pink-500' : selectedCharacter === 'rubble' ? 'bg-yellow-500 text-slate-900' : 'bg-red-500'
            }`}>
              {selectedCharacter === 'chase' ? (
                <HelpCircle size={14} className="text-white fill-yellow-300 animate-pulse" />
              ) : selectedCharacter === 'skye' ? (
                <Heart size={14} className="text-white fill-pink-200 animate-pulse" />
              ) : selectedCharacter === 'rubble' ? (
                <Wrench size={14} className="text-slate-900 fill-amber-300 animate-pulse" />
              ) : (
                <Flame size={14} className="text-white fill-white animate-pulse" />
              )}
            </div>
            <span className="text-xs sm:text-sm font-black text-slate-800">
              {selectedCharacter === 'chase' 
                ? 'おたすけを まつ人（ともだち）:' 
                : selectedCharacter === 'skye'
                ? 'きゅうじょを まつ人:'
                : selectedCharacter === 'rubble'
                ? 'のこりのがれき:' 
                : 'のこりの火事（かじ）:'} <span className="text-red-600 text-sm sm:text-base font-black underline decoration-red-400 decoration-wavy">{totalFireCount - currentExtinguished}{selectedCharacter === 'chase' ? 'にん' : selectedCharacter === 'rubble' ? 'こ' : 'にん'}</span> / {totalFireCount}{selectedCharacter === 'chase' ? 'にん' : selectedCharacter === 'rubble' ? 'こ' : 'にん'}
            </span>
          </div>

          {/* Middle: Progress Meter */}
          <div className="w-full md:flex-grow max-w-xl flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black text-slate-700 whitespace-nowrap flex items-center gap-1 shrink-0">
              <Trophy size={14} className="text-yellow-500 fill-yellow-400" />
              <span className="hidden sm:inline">{selectedCharacter === 'chase' ? 'おたすけメーター:' : 'しょうかメーター:'}</span>
            </span>
            <div className="relative w-full bg-slate-300 h-6 sm:h-6.5 rounded-full overflow-hidden border-2 border-orange-400 shadow-md">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${progressPercentage}%` }}
                className="h-full bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-500 rounded-full"
                transition={{ type: 'spring', stiffness: 85, damping: 14 }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[10px] sm:text-xs font-black text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                {progressPercentage}% かんりょう！
              </span>
            </div>
          </div>

          {/* Right: Timer & Count badges */}
          <div className="flex items-center gap-2 sm:gap-3 whitespace-nowrap">
            {/* Timer badge */}
            <div className="flex items-center gap-1 text-xs font-black text-sky-700 bg-white border-2 border-sky-400 px-3 py-1 rounded-full shadow-xs">
              ⏱️ {elapsedTime}秒
            </div>

            {/* Remaining Badge */}
            <div className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-white border-2 border-emerald-400 px-3 py-1 rounded-full shadow-xs animate-pulse">
              <Trophy size={12} className="text-yellow-500 fill-yellow-400" />
              <span>あと {totalFireCount - currentExtinguished}{selectedCharacter === 'chase' ? 'にん' : 'こ'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Operation Guide Narration / Guide banner at the bottom */}
      <footer id="game-footer" className="bg-slate-800 border-t-2 border-slate-700 p-3 text-slate-400 text-center text-xs select-none font-sans">
        <div className="max-w-md mx-auto flex items-center justify-center gap-1.5 font-sans font-medium text-slate-300">
          <span>🎮 【あそびかた】:</span>
          <span>
            {selectedCharacter === 'chase' 
              ? 'おともだちをタップすると、チェイスのポリスカーが動いて、おたすけパワーをかけるよ！'
              : '火をタップすると、マーシャルの消防車が動いて、お水をかけるよ！'}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 mt-1">
          © パウ・パトロールファンゲーム | 子供向け安全設計・知育おもちゃ
        </p>
      </footer>

      {/* Endless Ranking Modal Overlay */}
      {showRankingModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-sans select-none">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl max-w-md w-full border-4 border-amber-400 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-amber-400 p-4 text-slate-900 font-black text-center relative flex-shrink-0">
              <h3 className="text-base sm:text-lg flex items-center justify-center gap-1.5 font-black">
                <Trophy size={20} className="text-yellow-800 fill-yellow-600 animate-bounce" />
                エンドレスランキング 🏆
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-800 font-bold mt-1">
                これまでに がんばったレスキューの きろくだよ！
              </p>
            </div>

            {/* List */}
            <div className="p-4 overflow-y-auto scrollbar-thin flex-grow">
              {renderRankingList(10)}
            </div>

            {/* Footer / Close button */}
            <div className="bg-slate-50 p-3 text-center border-t border-slate-200 flex-shrink-0">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowRankingModal(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-black text-xs sm:text-sm py-2 px-6 rounded-full shadow-md active:scale-95 transition-transform"
              >
                とじる
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Rubble Debris Clear interactive overlay panel (full-screen global overlay) */}
      <AnimatePresence>
        {gameState === 'playing' && selectedCharacter === 'rubble' && activeRubbleTarget && (
          <RubbleDebrisClearPanel
            target={activeRubbleTarget}
            soundEnabled={soundEnabled}
            onComplete={() => handleRubbleTargetCleared(activeRubbleTarget.id)}
            onClose={() => {
              sound.playClick();
              setActiveRubbleTarget(null);
              setTargetFireId(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Marshall Fire Fight interactive overlay panel (full-screen global overlay) */}
      <AnimatePresence>
        {gameState === 'playing' && selectedCharacter === 'marshall' && activeMarshallTarget && (
          <MarshallFireFightPanel
            target={activeMarshallTarget}
            soundEnabled={soundEnabled}
            onComplete={() => handleMarshallTargetCleared(activeMarshallTarget.id)}
            onClose={() => {
              sound.playClick();
              setActiveMarshallTarget(null);
              setTargetFireId(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Chase Traffic Control interactive overlay panel (full-screen global overlay) */}
      <AnimatePresence>
        {gameState === 'playing' && selectedCharacter === 'chase' && activeChaseTarget && (
          <ChaseTrafficControlPanel
            target={activeChaseTarget}
            soundEnabled={soundEnabled}
            onComplete={() => handleChaseTargetCleared(activeChaseTarget.id)}
            onClose={() => {
              sound.playClick();
              setActiveChaseTarget(null);
              setTargetFireId(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Skye Rescue interactive overlay panel (full-screen global overlay) */}
      <AnimatePresence>
        {gameState === 'playing' && selectedCharacter === 'skye' && activeSkyeTarget && (
          <SkyeRescuePanel
            target={activeSkyeTarget}
            soundEnabled={soundEnabled}
            onComplete={() => handleSkyeTargetCleared(activeSkyeTarget.id)}
            onClose={() => {
              sound.playClick();
              setActiveSkyeTarget(null);
              setTargetFireId(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
