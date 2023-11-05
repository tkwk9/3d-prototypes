import { onMount } from "solid-js";
import * as PIXI from "pixi.js";

import "./PixiDemo.scss";

const PixiDemo = () => {
  let container;

  onMount(() => {
    let app = new PIXI.Application({
      width: 256,
      height: 256,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    container.appendChild(app.view);

    const originalColor = 0x5bba6f;
    const hoverColor = 0xffbd01;
    const clickColor = 0xff3333;

    let button = new PIXI.Graphics();
    button.lineStyle(4, 0xffffff, 1);
    button.beginFill(originalColor);
    button.drawRoundedRect(0, 0, 150, 50, 10);
    button.endFill();

    button.x = (app.screen.width - 150) / 2;
    button.y = (app.screen.height - 50) / 2;

    button.interactive = true;
    button.buttonMode = true;
    button.cursor = "pointer";

    button.on("mouseover", () => {
      button.tint = hoverColor;
    });

    button.on("mouseout", () => {
      button.tint = 0xffffff;
    });

    button.on("pointerdown", () => {
      button.tint = clickColor;
    });

    button.on("pointerup", () => {
      button.tint = hoverColor;
    });
    button.on("pointerupoutside", () => {
      button.tint = 0xffffff;
    });

    const style = new PIXI.TextStyle({
      fontFamily: "Arial",
      fontSize: 24,
      fill: "#ffffff",
      align: "center",
    });
    let buttonText = new PIXI.Text("clickme", style);
    buttonText.x = button.width / 2;
    buttonText.y = button.height / 2;
    buttonText.anchor.set(0.5);

    button.addChild(buttonText);
    app.stage.addChild(button);

    app.start();
  });

  return <div class="PixiDemo" ref={container} />;
};

export default PixiDemo;
