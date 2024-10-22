import './Cameras.css'
import { useRef, useState, useEffect } from "react";
import { Canvas, FabricText, Rect, Group } from "fabric";

function Cameras() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState<Canvas | null>(null);

    useEffect(() => {
        let page = document.getElementById('Page');
        if (canvasRef.current && page) {
            const initCanvas = new Canvas(canvasRef.current, {
                width: page.offsetWidth,
                height: page.offsetHeight-6,
            });

            initCanvas.renderAll();

            setCanvas(initCanvas);

            return () => {
                initCanvas.dispose();
            };
        }
    }, []);

    let leftPadding = 20;
    let topPadding = 10;
    let horizontalGap = 20;
    let verticalGap = 60;

    useEffect(() => {
        createCamera({left: leftPadding, top: topPadding, size: 600, cameraType: "Front Camera"});
        createCamera({left: leftPadding + 600 + horizontalGap, top: topPadding, size: 600, cameraType: "Back Camera"});
        createCamera({left: leftPadding + 1200 + horizontalGap*2, top: topPadding, size: 400, cameraType: "Arm Camera"});
        createCamera({left: leftPadding + 1200 + horizontalGap*2, top: topPadding + 400 + verticalGap, size: 200, cameraType: "Camera #4"});
        createCamera({left: leftPadding + 1400 + horizontalGap*3, top: topPadding + 400 + verticalGap, size: 200, cameraType: "Camera #5"});
        createCamera({left: leftPadding, top: topPadding + 600 + verticalGap, size: 200, cameraType: "Camera #6"});
        createCamera({left: leftPadding + 200 + horizontalGap, top: topPadding + 600 + verticalGap, size: 200, cameraType: "Camera #8"});
        createCamera({left: leftPadding + 400 + horizontalGap*2, top: topPadding + 600 + verticalGap, size: 200, cameraType: "Camera #9"});
        createCamera({left: leftPadding + 600 + horizontalGap*3, top: topPadding + 600 + verticalGap, size: 200, cameraType: "Camera #10"});
    })

    const createCamera = ({left, top, size, cameraType} : {left:number, top: number, size: number, cameraType: string}) => {
        if (canvas) {
            let text = new FabricText(cameraType, {
                fontSize: 25,
                originX: "center",
                originY: "top",
                fontFamily: 'League Spartan',
                fontWeight: 'bold',
            });
            let camera = new Rect({
                left: 0,
                top: 35,
                originX: 'center',
                width: size,
                height: size,
                fill: "#636363",
            });
            let group = new Group([text, camera], {
                left: left,
                top: top,
            });
            group.setControlsVisibility({
                mt: false,
                mb: false,
                ml: false,
                mr: false,
            })
            canvas.add(group);
        }
    }

    return (
        <div id="Page" className="Page">
            <canvas id="canvas" ref={canvasRef} />
        </div>
    )
}

export default Cameras