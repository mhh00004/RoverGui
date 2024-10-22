import './Cameras.css'
import { useRef, useState, useEffect } from "react";
import { Canvas, FabricText, Rect, Group } from "fabric";

function Cameras() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState<Canvas | null>(null);

    useEffect(() => {
        let page = document.getElementById('Page');
        if (page) {
            let width = page.offsetWidth;
            let height = page.offsetHeight - 6;
            if (canvasRef.current) {
                const initCanvas = new Canvas(canvasRef.current, {
                    width: width,
                    height: height,
                });
    
                initCanvas.renderAll();
    
                setCanvas(initCanvas);
    
                return () => {
                    initCanvas.dispose();
                };
            }
        }

    }, []);

    useEffect(() => {
        let page = document.getElementById('Page');
        if (page) {
            let width = page.offsetWidth;
            let scale = width/1770;
            
            let leftPadding = 20*scale;
            let topPadding = 10*scale;
            let horizontalGap = 20*scale;
            let verticalGap = 60*scale;
            
            let largeCamera = 600*scale;
            let mediumCamera = 400*scale;
            let smallCamera = 200*scale;

            createCamera({left: leftPadding, top: topPadding, size: largeCamera, cameraType: "Front Camera"});
            createCamera({left: leftPadding + horizontalGap + largeCamera, top: topPadding, size: largeCamera, cameraType: "Back Camera"});
            createCamera({left: leftPadding + horizontalGap*2 + largeCamera*2, top: topPadding, size: mediumCamera, cameraType: "Arm Camera"});
            createCamera({left: leftPadding + horizontalGap*2 + largeCamera*2, top: topPadding + verticalGap + mediumCamera, size: smallCamera, cameraType: "Camera #4"});
            createCamera({left: leftPadding + horizontalGap*3 + largeCamera*2 + smallCamera, top: topPadding + verticalGap + mediumCamera, size: smallCamera, cameraType: "Camera #5"});
            createCamera({left: leftPadding, top: topPadding + verticalGap + largeCamera, size: smallCamera, cameraType: "Camera #6"});
            createCamera({left: leftPadding + horizontalGap + smallCamera, top: topPadding + verticalGap + largeCamera, size: smallCamera, cameraType: "Camera #7"});
            createCamera({left: leftPadding + horizontalGap*2 + smallCamera*2, top: topPadding + verticalGap + largeCamera, size: smallCamera, cameraType: "Camera #8"});
            createCamera({left: leftPadding + horizontalGap*3 + smallCamera*3, top: topPadding + verticalGap + largeCamera, size: smallCamera, cameraType: "Camera #9"});
            createCamera({left: leftPadding + horizontalGap*4 + smallCamera*4, top: topPadding + verticalGap + largeCamera, size: smallCamera, cameraType: "Camera #10"});
        }
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