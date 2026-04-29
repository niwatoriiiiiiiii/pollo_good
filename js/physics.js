document.addEventListener("DOMContentLoaded", () => {
  if (typeof Matter === "undefined") {
    console.error("Matter.jsが読み込まれていません");
    return;
  }

  const {
    Engine,
    Render,
    Runner,
    World,
    Bodies,
    Mouse,
    MouseConstraint,
    Composite,
    Events,
  } = Matter;

  // Configuration
  const CHICKEN_IMAGE_PATH = "assets/chicken_512x512.png";
  const CHICKEN_SIZE = Math.min(
    Math.max(Math.min(window.innerWidth, window.innerHeight) * 0.25, 130),
    250,
  );
  const BOUNCINESS = 0.7;
  const FRICTION = 0.01;

  const engine = Engine.create();
  const world = engine.world;
  engine.gravity.y = 2.0;

  const container = document.getElementById("canvas-container");
  if (!container) return;

  const render = Render.create({
    element: container,
    engine: engine,
    options: {
      width: window.innerWidth,
      height: window.innerHeight,
      wireframes: false,
      background: "transparent",
    },
  });

  // 壁の参照を保持する配列
  let walls = [];

  // 壁の生成関数（既存の壁があれば削除して再生成）
  function createWalls() {
    if (walls.length > 0) {
      Composite.remove(world, walls);
    }

    const thickness = 500;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const topOffset = 50;
    const bottomOffset = 50;
    const options = { isStatic: true, render: { visible: false } };

    walls = [
      Bodies.rectangle(
        width / 2,
        height - bottomOffset + thickness / 2,
        width,
        thickness,
        options,
      ), // Ground
      Bodies.rectangle(
        width / 2,
        topOffset - thickness / 2,
        width,
        thickness,
        options,
      ), // Ceiling
      Bodies.rectangle(-thickness / 2, height / 2, thickness, height, options), // Left
      Bodies.rectangle(
        width + thickness / 2,
        height / 2,
        thickness,
        height,
        options,
      ), // Right
    ];

    World.add(world, walls);
  }

  createWalls();

  // ニワトリ（本体）
  const chicken = Bodies.circle(
    window.innerWidth / 2,
    window.innerHeight / 2,
    CHICKEN_SIZE * 0.45,
    {
      restitution: BOUNCINESS,
      friction: FRICTION,
      frictionAir: 0.005,
      angularDamping: 0.05,
      render: {
        sprite: {
          texture: CHICKEN_IMAGE_PATH,
          xScale: CHICKEN_SIZE / 512,
          yScale: CHICKEN_SIZE / 512,
        },
      },
    },
  );

  Matter.Body.setInertia(chicken, chicken.inertia / 4);

  World.add(world, chicken);

  // マウス操作の設定
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.1,
      angularStiffness: 0.5,
      render: { visible: false },
    },
  });

  World.add(world, mouseConstraint);
  render.mouse = mouse;

  // ぽよぽよ（スプリング）ロジック
  let currentScaleX = CHICKEN_SIZE / 512;
  let currentScaleY = CHICKEN_SIZE / 512;
  const baseScale = CHICKEN_SIZE / 512;
  const springStrength = 0.05;
  const damping = 0.9;
  let velScaleX = 0;
  let velScaleY = 0;

  Events.on(engine, "afterUpdate", () => {
    // デルタタイム（フレーム間の経過時間）を取得し、60FPS基準の比率を計算
    const deltaRatio = (engine.timing.lastDelta || 1000 / 60) / (1000 / 60);

    // 速度制限
    const maxSpeed = 30;
    if (chicken.speed > maxSpeed) {
      const ratio = maxSpeed / chicken.speed;
      Matter.Body.setVelocity(chicken, {
        x: chicken.velocity.x * ratio,
        y: chicken.velocity.y * ratio,
      });
    }

    // ぽよぽよ計算にデルタタイムを適用（リフレッシュレートの違いによる挙動変化を防ぐ）
    const forceX = (baseScale - currentScaleX) * springStrength * deltaRatio;
    const forceY = (baseScale - currentScaleY) * springStrength * deltaRatio;

    // 減衰もデルタタイムの影響を受けるため補正
    const currentDamping = Math.pow(damping, deltaRatio);
    velScaleX = (velScaleX + forceX) * currentDamping;
    velScaleY = (velScaleY + forceY) * currentDamping;

    currentScaleX += velScaleX * deltaRatio;
    currentScaleY += velScaleY * deltaRatio;

    let dX = currentScaleX;
    let dY = currentScaleY;

    if (mouseConstraint.constraint.bodyB === chicken) {
      const dist = Matter.Vector.magnitude(
        Matter.Vector.sub(mouse.position, chicken.position),
      );
      const dragSquish = Math.min(dist * 0.0001, 0.03);
      dX *= 1 - dragSquish;
      dY *= 1 + dragSquish;

      // ドラッグ中は掴むカーソル
      document.body.style.cursor = "grabbing";
    } else if (Matter.Query.point([chicken], mouse.position).length > 0) {
      // ニワトリの上にマウスがある時はパーのカーソル
      document.body.style.cursor = "grab";
    } else {
      // それ以外はデフォルト
      document.body.style.cursor = "default";
    }

    // スケールがマイナスにならないよう安全対策
    chicken.render.sprite.xScale = Math.max(0.01, dX);
    chicken.render.sprite.yScale = Math.max(0.01, dY);
  });

  // 衝突時の反応
  Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((pair) => {
      if (pair.bodyA === chicken || pair.bodyB === chicken) {
        const normal = pair.collision.normal;
        if (!normal) return;

        const intensity = Math.min(chicken.speed * 0.005, 0.035);
        if (Math.abs(normal.y) > Math.abs(normal.x)) {
          velScaleX += intensity;
          velScaleY -= intensity;
        } else {
          velScaleX -= intensity;
          velScaleY += intensity;
        }
      }
    });
  });

  // 描画関連（影の処理など）
  Events.on(render, "beforeRender", () => {
    const ctx = render.context;
    if (!ctx) return;

    const groundY = window.innerHeight;
    const distanceToGround = groundY - chicken.position.y;

    // 透過度と影の幅が絶対にマイナスにならないようにガード
    const shadowOpacity = Math.max(
      0,
      Math.min(0.3, 0.3 - distanceToGround / 1000),
    );
    const shadowWidth = Math.max(
      0,
      CHICKEN_SIZE * 0.8 * (1 + distanceToGround / 500),
    );

    // 影の幅が0より大きい場合のみ描画
    if (shadowOpacity > 0 && shadowWidth > 0) {
      ctx.beginPath();
      ctx.ellipse(
        chicken.position.x,
        groundY - 5,
        shadowWidth / 2,
        10,
        0,
        0,
        Math.PI * 2,
      );
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity})`;
      ctx.fill();
    }

    // --- ニワトリ本体の影 ---
    ctx.shadowBlur = 10; // 控えめなぼかし
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)"; // 薄い黒
    ctx.shadowOffsetX = 5; // 少し右にずらす
    ctx.shadowOffsetY = 5; // 少し下にずらす
  });

  // リセット用の処理
  Events.on(render, "afterRender", () => {
    const ctx = render.context;
    if (!ctx) return;
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  });

  // リサイズ処理（デバウンス処理を追加して負荷とエラーを激減）
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      render.canvas.width = window.innerWidth;
      render.canvas.height = window.innerHeight;
      createWalls();

      // チキンが画面外に落ちていた場合は中央に戻す
      if (
        chicken.position.y > window.innerHeight ||
        chicken.position.x > window.innerWidth ||
        chicken.position.x < 0
      ) {
        Matter.Body.setPosition(chicken, {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
        });
        Matter.Body.setVelocity(chicken, { x: 0, y: 0 });
      }
    }, 150); // 150ms 待ってから1回だけ再計算
  });

  // 物理演算のランナー
  const runner = Runner.create();
  Runner.run(runner, engine);
  Render.run(render);
});
