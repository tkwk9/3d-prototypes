import { onMount } from "solid-js";
import * as PIXI from "pixi.js";

import "./PixiDemo.scss";

const PixiDemo = () => {
  let container;

  onMount(() => {
    let app = new PIXI.Application({ width: 256, height: 256 });
    container.appendChild(app.view);

    let button = new PIXI.Graphics();
    button.lineStyle(4, 0xffffff, 1);

    button.beginFill(0x5bba6f);
    button.drawRoundedRect(0, 0, 150, 50, 10);
    button.endFill();

    button.x = (app.screen.width - 150) / 2;
    button.y = (app.screen.height - 50) / 2;

    button.interactive = true;
    button.buttonMode = true;
    button.cursor = "pointer";

    function animateColor(fromColor, toColor, duration, onUpdate) {
      let currentTime = 0;
      const tick = (delta) => {
        currentTime += delta;
        const progress = Math.min(currentTime / duration, 1);
        const currentColor = PIXI.utils.rgb2hex([
          fromColor[0] + (toColor[0] - fromColor[0]) * progress,
          fromColor[1] + (toColor[1] - fromColor[1]) * progress,
          fromColor[2] + (toColor[2] - fromColor[2]) * progress,
        ]);
        onUpdate(currentColor);
        if (progress >= 1) {
          app.ticker.remove(tick);
        }
      };
      app.ticker.add(tick);
    }

    button.on("mouseover", function onMouseOver() {
      animateColor(
        [0x5b / 0xff, 0xba / 0xff, 0x6f / 0xff],
        [0xff / 0xff, 0xbd / 0xff, 0x01 / 0xff],
        30,
        (color) => {
          button.clear();
          button.lineStyle(4, 0xffffff, 1);
          button.beginFill(color);
          button.drawRoundedRect(0, 0, 150, 50, 10);
          button.endFill();
        }
      );
    });

    button.on("mouseout", function onMouseOut() {
      animateColor(
        [0xff / 0xff, 0xbd / 0xff, 0x01 / 0xff],
        [0x5b / 0xff, 0xba / 0xff, 0x6f / 0xff],
        30,
        (color) => {
          button.clear();
          button.lineStyle(4, 0xffffff, 1);
          button.beginFill(color);
          button.drawRoundedRect(0, 0, 150, 50, 10);
          button.endFill();
        }
      );
    });

    app.stage.addChild(button);

    app.start();
  });

  return <div class="PixiDemo" ref={container} />;
};

export default PixiDemo;
