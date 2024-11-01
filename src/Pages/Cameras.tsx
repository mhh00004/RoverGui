import "./Cameras.css"
import { useRef, useState, useEffect } from "react";
import { Canvas, FabricText, Rect, Group, Path, Circle, FabricObject } from "fabric";

function Cameras() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const cameraList = ["Front Camera", "Back Camera", "Arm Camera", "Camera #4", "Camera #5", "Camera #6", "Camera #7"];
    let scale: number, size: number;

    // Fabric JS Canvas initialization
    useEffect(() => {
        let page = document.getElementById("Page");
        if (canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current, {
                width: page?.offsetWidth,
                height: page?.offsetHeight,
            });
            initCanvas.renderAll();
            setCanvas(initCanvas);
            return () => {
                initCanvas.dispose();
            };
        }
    }, []);

    // Draws initial cameras on Fabric JS Canvas
    useEffect(() => {
        let page = document.getElementById("Page");
        if (page) {
            let width = page.offsetWidth;
            scale = width/1770;
            let [leftPadding, topPadding] = [20*scale, 10*scale];
            let [horizontalGap, verticalGap] = [20*scale, 50*scale];
            size = 500*scale; // Camera Size
            createCamera(leftPadding+horizontalGap*0+size*0*1.0, topPadding, 1.0, cameraList[0]);
            createCamera(leftPadding+horizontalGap*1+size*1*1.0, topPadding, 1.0, cameraList[1]);
            createCamera(leftPadding+horizontalGap*2+size*2*1.0, topPadding, 0.75, cameraList[2]);
            createCamera(leftPadding+horizontalGap*2+size*2*1.0, topPadding+verticalGap+size*0.75, 0.75, cameraList[3]);
            createCamera(leftPadding+horizontalGap*0+size*0*1.0, topPadding+verticalGap+size*1.0, 0.6, cameraList[4]);
            createCamera(leftPadding+horizontalGap*1+size*1*0.6, topPadding+verticalGap+size*1.0, 0.6, cameraList[5]);
            createCamera(leftPadding+horizontalGap*2+size*2*0.6, topPadding+verticalGap+size*1.0, 0.6, cameraList[6]);
            addButton();
        }
        // Logic to prevent object dragging out of canvas boundaries
        if (canvas) {
            canvas.on("object:moving", (options: any) => {
                let obj = options.target;
                let [width, height] = [obj.width * obj.scaleX, obj.height * obj.scaleY];
                // Horizontal
                if (obj.left < 0) {
                    obj.left = 0;
                } else if (obj.left + width > canvas.width) {
                    obj.left = canvas.width - width;
                }
                // Vertical
                if (obj.top < 0) {
                    obj.top = 0;
                } else if (obj.top + height > canvas.height) {
                    obj.top = canvas.height - height;
                }
            });
        }
    });

    // Helper function for simple default and hover colors
    const addHoverListeners = (hoverObject: FabricObject, colorObject: FabricObject, defaultColor: string, hoverColor: string) => {
        hoverObject.on("mouseover", () => {
            colorObject.set("fill", hoverColor);
            colorObject.set("stroke", hoverColor);
            canvas?.renderAll();
        });
        hoverObject.on("mouseout", () => {
            colorObject.set("fill", defaultColor);
            colorObject.set("stroke", defaultColor);
            canvas?.renderAll();
        });
    }

    // Add button in the top right
    const addButton = () => {
        if (canvas) {
            let circleColors = ["#4EBC3B", "#60E549"]; // default, hover
            let circle = new Circle({
                fill: circleColors[0],
                originX: "center", originY: "center",
                radius: 20,
            });
            let cross = new Path("M -6 0 L 6 0 M 0 -6 L 0 6", {
                top: 0, left: 0,
                stroke: "white", strokeWidth: 3, strokeLineCap: "round",
                originX: "center", originY: "center",
            });
            let button = new Group([circle, cross], {
                top: 10, left: canvas.width - 50,
                hoverCursor: "pointer",
                subTargetCheck: true,
                selectable: false,
            });
            addHoverListeners(button, circle, circleColors[0], circleColors[1]);
            button.on("mousedown", () => {
                createCamera(20, 10, 1.0, cameraList[0], true);
                canvas.renderAll();
            });
            canvas.add(button);
        }
    }

    // Capture and downloads an image of a section of the canvas
    const captureScreen = (camera: FabricObject) => {
        if (canvas) {
            let dataUrl = canvas.toDataURL({
                format: 'png',
                multiplier: 2,
                top: camera.top,
                left: camera.left,
                width: camera.width * camera.scaleX,
                height: camera.height * camera.scaleY,
            });
            let temp = document.createElement("a");
            temp.download = "Screenshot.png";
            temp.href = dataUrl;
            temp.click();
        }
    }

    // Creates a camera canvas element
    const createCamera = (left: number, top: number, scale: number, cameraType: string, setActive?: boolean) => {
        if (canvas) {
            // Black bar on top of each camera
            let topBar = new Rect({
                top: 0, left: 0,
                originX: "center",
                width: size, height: 30,
                fill: "#2D2D2D",
                stroke: "white", strokeWidth: 1,
            });
            // Selector at the top left
            let padding = (30-20)/2;
            let selectedColors = ["#EFEFEF", "#B398FC"];
            let selected = new Rect({
                top: 0, left: 0,
                width: 150, height: 20,
                fill: "white",
                stroke: selectedColors[0], strokeWidth: 1,
                rx: 2, ry:2,
            });
            let selectedText = new FabricText(cameraType, {
                top: 10, left: 5,
                originY: "center",
                fontSize: 14, fontFamily: "League Spartan", fontWeight: "bold",
            });
            let arrow = new Path("M 0 0 L -6 6 M 0 0 L 6 6", {
                top: 10, left: 135,
                originX: "center", originY: "center",
                angle: 180,
                stroke: "#494949", strokeWidth: 3, strokeLineCap: "round",
            });
            // Close Camera Button
            let exitColors = ["#FF5959", "#FF8C8C"];
            let exit = new Path("M -6 -6 L 6 6 M -6 6 L 6 -6", {
                top: 15, left: size/2-20,
                originX: "center", originY: "center",
                angle: 180,
                stroke: "#FF5959", strokeWidth: 3, strokeLineCap: "round",
                hoverCursor: "pointer",
            });
            addHoverListeners(exit, exit, exitColors[0], exitColors[1]);
            // screenshot button
            let screenshotColors = ["#E0E0E0", "#EFEFEF"];
            let screenshotBackground = new Rect({
                top: 0, left: 0,
                width: 90, height: 20,
                fill: screenshotColors[0],
                rx: 2, ry:2,
            });
            let screenshotText = new FabricText("Screenshot", {
                top: 10, left: 45,
                originX: "center", originY: "center",
                fontSize: 14, fontFamily: "League Spartan", fontWeight: "bold",
            });
            let screenshot = new Group([screenshotBackground, screenshotText], {
                top: padding, left: -size/2 + padding*2 + selected.width,
                hoverCursor: "pointer",
                subTargetCheck: true,
            });
            addHoverListeners(screenshot, screenshotBackground, screenshotColors[0], screenshotColors[1]);

            // Groups everything in the selector
            let dropdown = new Group([selected, selectedText, arrow], {
                top: padding, left: -size/2 + padding,
                hoverCursor: "pointer",
                subTargetCheck: true,
            });

            // Dropdown Menu
            let dropdownBorder = new Rect({
                top: 0, left: 0,
                width: 150, height: 20*cameraList.length-cameraList.length+1,
                fill: "transparent",
                stroke: selectedColors[1], strokeWidth: 1,
                selectable: false,
            });
            let menuMargin = 25;
            let dropdownMenu = new Group([dropdownBorder], {
                top: menuMargin, left: -size/2 + padding,
                hoverCursor: "pointer",
                subTargetCheck: true,
                visible: false,
            });
            for (let i = 0; i < cameraList.length; i++) {
                let hoverColor = "#ECF1FE";
                let dropdownItemBackground = new Rect({
                    top: 0, left: 0,
                    width: 150, height: 20,
                    fill: "white",
                });
                let dropdownItemText = new FabricText(cameraList[i], {
                    top: 10, left: 5,
                    originY: "center",
                    fontSize: 14, fontFamily: "League Spartan", fontWeight: "bold",
                });
                let dropdownItem = new Group([dropdownItemBackground, dropdownItemText], {
                    top: menuMargin + i * 19, left: -size/2 + padding,
                    subTargetCheck: true,
                });
                dropdownItem.on("mouseover", () => {
                    dropdownItemBackground.fill = hoverColor;
                    dropdownMenu.visible = true;
                    canvas.renderAll();
                });
                dropdownItem.on("mouseout", () => {
                    dropdownItemBackground.fill = "white";
                    dropdownMenu.visible = false;
                    canvas.renderAll();
                });
                dropdownItem.on("mousedown", () => {
                    selectedText.set('text', dropdownItemText.text);
                    dropdownMenu.visible = false;
                    canvas.renderAll();
                });
                dropdownMenu.add(dropdownItem);
            }
            dropdown.on("mouseover", () => {
                selected.stroke = selectedColors[1];
                dropdownMenu.visible = true;
                canvas.renderAll();
            });
            dropdown.on("mouseout", () => {
                selected.stroke = selectedColors[0];
                dropdownMenu.visible = false;
                canvas.renderAll();
            });

            // Camera
            let camera = new Rect({
                top: 30, left: 0,
                originX: "center",
                width: size, height: size,
                fill: "#636363",
                stroke: "white", strokeWidth: 1,
            });

            // Groups the entire camera together
            let group = new Group([camera, topBar, dropdown, dropdownMenu, exit, screenshot], {
                left: left,
                top: top,
                subTargetCheck: true,
                scaleX: scale,
                scaleY: scale,
            });
            group.on("selected", () => {
                canvas.bringObjectToFront(group);
            });
            exit.on("mousedown", () => {
                canvas.remove(group);
            });
            screenshot.on("mousedown", () => {
                captureScreen(group);
            });

            // Hides the vertical/horizontal scaling selectors, leaving only the corners
            group.setControlsVisibility({
                mt: false,
                mb: false,
                ml: false,
                mr: false,
            });
            canvas.add(group);
            if (setActive) {
                canvas.setActiveObject(group);
            }
        }
    }

    return (
        <div id="Page" className="Page">
            <canvas id="canvas" ref={canvasRef} />
        </div>
    )
}

export default Cameras