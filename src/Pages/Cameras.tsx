import "./Cameras.css"
import { useRef, useState, useEffect } from "react";
import { Canvas, FabricText, Rect, Group, Path, Circle } from "fabric";

function Cameras() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState<Canvas | null>(null);
    const cameraList = ["Front Camera", "Back Camera", "Arm Camera", "Camera #4", "Camera #5", "Camera #6", "Camera #7"];

    // Fabric JS Canvas initialization
    useEffect(() => {
        let page = document.getElementById("Page");
        if (page) {
            if (canvasRef.current) {
                const initCanvas = new Canvas(canvasRef.current, {
                    width: page.offsetWidth,
                    height: page.offsetHeight,
                });
                initCanvas.renderAll();
                setCanvas(initCanvas);
                return () => {
                    initCanvas.dispose();
                };
            }
        }
    }, []);

    // Draws initial cameras on Fabric JS Canvas
    useEffect(() => {
        let page = document.getElementById("Page");
        if (page) {
            let width = page.offsetWidth;
            let scale = width/1770;
            
            let leftPadding = 20*scale;
            let topPadding = 10*scale;
            let horizontalGap = 20*scale;
            let verticalGap = 50*scale;
            
            let size = 500*scale;

            createCamera({left: leftPadding, top: topPadding, size: size, scale: 1.0, cameraType: cameraList[0]});
            createCamera({left: leftPadding + horizontalGap + size*1.0, top: topPadding, size: size, scale: 1.0, cameraType: cameraList[1]});
            createCamera({left: leftPadding + horizontalGap*2 + size*2*1.0, top: topPadding, size: size, scale: 0.75, cameraType: cameraList[2]});
            createCamera({left: leftPadding + horizontalGap*2 + size*2*1.0, top: topPadding + verticalGap + size*0.75, size: size, scale: 0.75, cameraType: cameraList[3]});
            createCamera({left: leftPadding, top: topPadding + verticalGap + size*1.0, size: size, scale: 0.6, cameraType: cameraList[4]});
            createCamera({left: leftPadding + horizontalGap + size*0.6, top: topPadding + verticalGap + size*1.0, size: size, scale: 0.6, cameraType: cameraList[5]});
            createCamera({left: leftPadding + horizontalGap*2 + size*2*0.6, top: topPadding + verticalGap + size*1.0, size: size, scale: 0.6, cameraType: cameraList[6]});

            addButton();
        }
        // Logic to prevent object dragging out of canvas boundaries
        if (canvas) {
            canvas.on("object:moving", (options: any) => {
                let obj = options.target;
                let width = obj.width * obj.scaleX;
                let height = obj.height * obj.scaleY;
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
    })

    // Add button in the top right
    const addButton = () => {
        if (canvas) {
            let circleColors = ["#4EBC3B", "#60E549"];
            let circle = new Circle({
                fill: circleColors[0],
                originX: "center",
                originY: "center",
                radius: 20,
            });
            let cross = new Path("M -6 0 L 6 0 M 0 -6 L 0 6", {
                strokeWidth: 3,
                stroke: "white",
                strokeLineCap: "round",
                originX: "center",
                originY: "center",
                top: 0,
                left: 0,
            });
            let button = new Group([circle, cross], {
                left: canvas.width - 50,
                top: 10,
                hoverCursor: "pointer",
                subTargetCheck: true,
                selectable: false,
            });
            button.on("mouseover", () => {
                circle.set("fill", circleColors[1]);
                canvas.renderAll();
            });
            button.on("mouseout", () => {
                circle.set("fill", circleColors[0]);
                canvas.renderAll();
            });
            button.on("mousedown", () => {
                let page = document.getElementById("Page");
                if (page) {
                    let width = page.offsetWidth;
                    let scale = width/1770;                    
                    let size = 500*scale;
                    createCamera({left: 20, top: 10, size: size, scale: 1.0, cameraType: cameraList[0], setActive: true});
                    canvas.renderAll();
                }
            });
            canvas.add(button);
        }
    }

    // Creates a camera canvas element
    const createCamera = ({left, top, size, scale, cameraType, setActive} : {left:number, top: number, size: number, scale: number, cameraType: string, setActive?: boolean}) => {
        if (canvas) {
            let camera = new Rect({
                left: 0,
                top: 30,
                originX: "center",
                width: size,
                height: size,
                fill: "#636363",
                stroke: "white",
                strokeWidth: 1,
            });

            // Black bar on top of each camera
            let topBar = new Rect({
                left: 0,
                top: 0,
                originX: "center",
                width: size,
                height: 30,
                fill: "#2D2D2D",
                stroke: "white",
                strokeWidth: 1,
            });
            let selectedColors = ["#EFEFEF", "#B398FC"];
            let selected = new Rect({
                left: 0,
                top: 0,
                width: 150,
                height: 20,
                fill: "white",
                stroke: selectedColors[0],
                strokeWidth: 1,
                rx: 2,
                ry: 2,
            });
            let selectedText = new FabricText(cameraType, {
                fontSize: 14,
                originY: "center",
                left: 5,
                top: 10,
                fontFamily: "League Spartan",
                fontWeight: "bold",
            });
            let arrow = new Path("M 0 0 L -6 6 M 0 0 L 6 6", {
                strokeWidth: 3,
                stroke: "#494949",
                strokeLineCap: "round",
                originX: "center",
                originY: "center",
                top: 10,
                left: 135,
                angle: 180,
            });
            let exitColors = ["#FF5959", "#FF8C8C"];
            let exit = new Path("M -6 -6 L 6 6 M -6 6 L 6 -6", {
                strokeWidth: 3,
                stroke: "#FF5959",
                strokeLineCap: "round",
                originX: "center",
                originY: "center",
                top: 15,
                left: size/2 - 20,
                angle: 180,
                hoverCursor: "pointer",
            });
            exit.on("mouseover", () => {
                exit.stroke = exitColors[1];
                canvas.renderAll();
            });
            exit.on("mouseout", () => {
                exit.stroke = exitColors[0];
                canvas.renderAll();
            });
            let padding = (30-20)/2;
            let dropdown = new Group([selected, selectedText, arrow], {
                left: -size/2 + padding,
                top: padding,
                hoverCursor: "pointer",
                subTargetCheck: true,
            });

            let dropdownBorder = new Rect({
                left: 0,
                top: 0,
                width: 150,
                height: 20 * cameraList.length - cameraList.length + 1,
                fill: "transparent",
                strokeWidth: 1,
                stroke: selectedColors[1],
                selectable: false,
            });
            let menuMargin = 25;
            let dropdownMenu = new Group([dropdownBorder], {
                left: -size/2 + padding,
                top: menuMargin,
                hoverCursor: "pointer",
                subTargetCheck: true,
                visible: false,
            });
            for (let i = 0; i < cameraList.length; i++) {
                let hoverColor = "#ECF1FE";
                let dropdownItemBackground = new Rect({
                    left: 0,
                    top: 0,
                    width: 150,
                    height: 20,
                    fill: "white",
                });
                let dropdownItemText = new FabricText(cameraList[i], {
                    fontSize: 14,
                    originY: "center",
                    left: 5,
                    top: 10,
                    fontFamily: "League Spartan",
                    fontWeight: "bold",
                });
                let dropdownItem = new Group([dropdownItemBackground, dropdownItemText], {
                    left: -size/2 + padding,
                    top: menuMargin + i * 19,
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
                arrow.angle = 0;
                dropdownMenu.visible = true;
                canvas.renderAll();
            });
            dropdown.on("mouseout", () => {
                selected.stroke = selectedColors[0];
                arrow.angle = 180;
                dropdownMenu.visible = false;
                canvas.renderAll();
            });

            let group = new Group([camera, topBar, dropdown, dropdownMenu, exit], {
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