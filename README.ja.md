# Pollo 👍

[English](README.md) | [日本語](README.ja.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![views](https://myhits.vercel.app/api/hit/https%3A%2F%2Fniwatoriiiiiiiii.github.io%2Fpollo_good%2F?color=red&label=views&size=small)](https://myhits.vercel.app)


**ブラウザ上で動作する、2D物理演算を活用したインタラクティブ・シミュレーション**🐔

ユーザーのドラッグ操作に応じてオブジェクト（ニワトリ）が物理法則に従い挙動します。ソフトボディのような弾性や衝突時の変形など、Matter.jsを用いたリアルタイムな物理シミュレーションを体験可能なWebアプリケーションです。

### 🔗 [Pollo👍 (GitHub Pages)](https://niwatoriiiiiiiii.github.io/pollo_good/)

---

## ✨ 特徴 (Features)

*   **リアルタイム物理演算**: `Matter.js` を採用し、単なる剛体ではない弾性体のような挙動を表現。
*   **直感的な操作性**: PC（マウス）およびスマートフォン（タッチ操作）の双方に対応し、ドラッグ操作によるオブジェクトの把持・投擲が可能です。
*   **マルチデバイス対応**: 端末の画面サイズを自動的に判別し、オブジェクトのスケールが動的に最適化されます。
*   **洗練されたUI設計**: グラスモーフィズムを取り入れたUIと、描画負荷を最小限に抑えたドロップシャドウを実装しています。

## 🛠 使用技術 (Tech Stack)

*   **HTML5 / CSS3**: UIレイアウト
*   **Vanilla JavaScript (ES6)**: メインロジック
*   **[Matter.js](https://brm.io/matter-js/)**: 2D物理演算エンジン

## 🚀 ローカル環境での実行方法 (Local Setup)

本プロジェクトは静的ファイル（HTML/CSS/JS）のみで構成されており、複雑なビルドプロセスは不要です。

1.  リポジトリをクローンします。
    ```bash
    git clone https://github.com/niwatoriiiiiiiii/pollo_good.git
    ```
2.  クローンしたディレクトリに移動します。
    ```bash
    cd pollo_good
    ```
3.  ローカルサーバーを起動し、`index.html` を開きます。
    *VSCodeの拡張機能「Live Server」を使用するか、以下のコマンドを実行してください。*
    ```bash
    # Node.jsがインストールされている場合
    npx serve .
    
    # Pythonがインストールされている場合
    python -m http.server 8000
    ```
4.  ブラウザで `http://localhost:3000` (または設定したポート) にアクセスします。

## 📄 ライセンス (License)

このプロジェクトは [MIT License](LICENSE) のもとで公開されています。

### サードパーティライセンス (Third-Party Licenses)

このプロジェクトでは以下のサードパーティライブラリを使用しています。

#### [Matter.js](https://github.com/liabru/matter-js)
*   License: MIT
*   Copyright (c) Liam Brummitt and contributors.
*   See [LICENSE](https://github.com/liabru/matter-js/blob/master/LICENSE) for details.
