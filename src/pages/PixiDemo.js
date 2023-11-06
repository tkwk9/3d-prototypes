import { onMount } from "solid-js";
import * as PIXI from "pixi.js";

import "./PixiDemo.scss";

const PixiDemo = () => {
  let container;

  onMount(() => {
    const cols = 30;
    const rows = 30;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const paddingPercentage = 0.05;
    const buttonWidth = (containerWidth / cols) * (1 - paddingPercentage * 2);
    const buttonHeight = (containerHeight / rows) * (1 - paddingPercentage * 2);
    const paddingWidth = (containerWidth / cols) * paddingPercentage;
    const paddingHeight = (containerHeight / rows) * paddingPercentage;

    let app = new PIXI.Application({
      width: containerWidth,
      height: containerHeight,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: "#7a7a7a",
    });
    container.appendChild(app.view);

    const originalColor = "#42987d";
    const hoverColor = "#346052";
    const clickColor = "#272e2c";

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let button = new PIXI.Graphics();
        button.lineStyle(1, "#6e988b", 1);
        button.beginFill(originalColor);
        button.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 5);
        button.endFill();

        button.x = j * (buttonWidth + paddingWidth * 2) + paddingWidth;
        button.y = i * (buttonHeight + paddingHeight * 2) + paddingHeight;

        button.interactive = true;
        button.buttonMode = true;
        button.cursor = "pointer";

        button.on("mouseover", () => {
          button.clear();
          button.lineStyle(1, "#6e988b", 1);
          button.beginFill(hoverColor);
          button.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 5);
          button.endFill();
        });
        button.on("mouseout", () => {
          console.log("out");
          button.clear();
          button.lineStyle(1, "#6e988b", 1);
          button.beginFill(originalColor);
          button.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 5);
          button.endFill();
        });
        button.on("pointerdown", () => {
          button.clear();
          button.lineStyle(1, "#6e988b", 1);
          button.beginFill(clickColor);
          button.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 5);
          button.endFill();
        });
        button.on("pointerup", () => {
          button.clear();
          button.lineStyle(1, "#6e988b", 1);
          button.beginFill(hoverColor);
          button.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 5);
          button.endFill();
        });
        button.on("pointerupoutside", () => {
          button.clear();
          button.lineStyle(1, "#6e988b", 1);
          button.beginFill(originalColor);
          button.drawRoundedRect(0, 0, buttonWidth, buttonHeight, 5);
          button.endFill();
        });

        app.stage.addChild(button);
      }
    }

    app.start();
  });

  return <div class="PixiDemo" ref={container} />;
};

export default PixiDemo;
