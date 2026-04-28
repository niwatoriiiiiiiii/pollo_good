# Pollo 👍

[English](README.md) | [日本語](README.ja.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![views](https://myhits.vercel.app/api/hit/https%3A%2F%2Fniwatoriiiiiiiii.github.io%2Fpollo_good%2F?color=red&label=views&size=small)](https://myhits.vercel.app)

**An interactive 2D physics simulation running in your browser** 🐔

The object (chicken) behaves according to physical laws in response to user drag interactions. This is a Web application where you can experience real-time physics simulations, including soft-body elasticity and deformation upon collision, powered by Matter.js.

### 🔗 [Pollo👍 (GitHub Pages)](https://niwatoriiiiiiiii.github.io/pollo_good/)

---

## ✨ Features

*   **Real-time Physics**: Utilizing `Matter.js` to express soft-body elasticity, rather than just simple rigid bodies.
*   **Intuitive Interaction**: Supports both PC (mouse) and smartphones (touch). You can grab and throw the object using drag/swipe operations.
*   **Responsive Design**: Automatically detects the screen size and dynamically optimizes the scale of the object.
*   **Refined UI**: Implements a glassmorphism UI and lightweight drop shadows to minimize rendering load.

## 🛠 Tech Stack

*   **HTML5 / CSS3**: UI layout
*   **Vanilla JavaScript (ES6)**: Main logic
*   **[Matter.js](https://brm.io/matter-js/)**: 2D physics engine

## 🚀 Local Setup

This project consists only of static files (HTML/CSS/JS) and does not require complex build processes.

1.  Clone the repository.
    ```bash
    git clone https://github.com/niwatoriiiiiiiii/pollo_good.git
    ```
2.  Navigate to the directory.
    ```bash
    cd pollo_good
    ```
3.  Start a local server and open `index.html`.
    *You can use the VSCode "Live Server" extension, or run one of the following commands:*
    ```bash
    # If Node.js is installed
    npx serve .
    
    # If Python is installed
    python -m http.server 8000
    ```
4.  Access `http://localhost:3000` (or the configured port) in your browser.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

### Third-Party Licenses

This project uses the following third-party libraries:

#### [Matter.js](https://github.com/liabru/matter-js)
*   License: MIT
*   Copyright (c) Liam Brummitt and contributors.
*   See [LICENSE](https://github.com/liabru/matter-js/blob/master/LICENSE) for details.
