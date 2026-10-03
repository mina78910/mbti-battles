# MBTI BATTLES — Prototype A

MBTIの特徴を、形・速度・重さ・移動パターンの異なるコマとして観察する2Dオートバトルです。ビルドやインストールは不要です。リポジトリ直下の `index.html` をブラウザで開いてください。

## ファイル構成

| ファイル | 役割 |
| --- | --- |
| `index.html` | アプリの入口と画面構造 |
| `css/style.css` | レイアウト、コントロール、レスポンシブ表示 |
| `js/config.js` | MBTIごとの能力値・形状・挙動とゲーム共通値 |
| `js/battle.js` | Canvas描画、移動、衝突、ダメージ、勝敗判定 |
| `js/ui.js` | タイプ選択UIとバトル状態表示 |
| `js/main.js` | UIとバトルエンジンの接続 |

## MBTI設定の変更

`js/config.js` の `MBTI_CONFIG` を編集します。HP (`hp`)、攻撃 (`attack`)、防御 (`defense`)、回転速度 (`rotationSpeed`)、移動速度 (`speed`)、重量 (`weight`)、大きさ (`radius`)、形 (`shape`)、移動特性 (`movementType`)、攻撃性 (`aggression`) をタイプごとに変更できます。バトル処理へタイプ固有値を直接書かない構成です。

## 新しいタイプの追加

1. `js/config.js` の `MBTI_CONFIG` に新しいタイプを1項目追加します。
2. 既存の `shape` (`star`, `shield`, `spike`, `burst`, `diamond`, `soft`) と `movementType` (`steady`, `charger`, `erratic`, `wander`, `avoid`) から特徴を選びます。
3. `index.html` を再読み込みします。選択UIは設定から自動生成されるため、ほかのファイルの編集は不要です。

## 操作

各タイプを0〜5体選び、`START BATTLE` を押します。戦闘中の操作はありません。残ったタイプが1種類になると勝者を表示します（長期戦は生存HP比率で判定します）。
