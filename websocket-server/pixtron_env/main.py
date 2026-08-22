import sys
import os
import asyncio, random, json
import time
from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles

# Add the 'opencv machine' directory to sys.path so we can import process_image
OPENCV_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'opencv machine'))
sys.path.append(OPENCV_DIR)

from process_image import detect_defects  # type: ignore

TEST_IMAGES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'test images'))
REFERENCE_IMAGE_PATH = os.path.join(TEST_IMAGES_DIR, 'bottle.png')

app = FastAPI()

# Mount the processed_images directory to serve images statically
processed_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'processed_images'))
os.makedirs(processed_dir, exist_ok=True)
app.mount("/processed_images", StaticFiles(directory=processed_dir), name="processed_images")

@app.get("/")
def read_root():
    return {"status": "hello "}


async def websocket_heartbeat(websocket):
      while True:
        await asyncio.sleep(5)
        heartbeat=json.dumps({
            "type":"heartbeat",
            "ts":int(time.time()*1000)
        })
        await websocket.send_text(heartbeat)


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    asyncio.create_task(websocket_heartbeat(websocket))

    productId=1
    totalInspectedProducts=0
    rejectedProducts=0

    TEST_IMAGES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'test images'))

    try:
        while True:
          
            totalInspectedProducts+=1

            images = [
                (os.path.join(TEST_IMAGES_DIR, 'dent-bottle.png'), 'Dent'),
                (os.path.join(TEST_IMAGES_DIR, 'hole-bottle.png'), 'Hole'),
                (os.path.join(TEST_IMAGES_DIR, 'scratch-bottle.png'), 'Scratch'),
                (os.path.join(TEST_IMAGES_DIR, 'scratches-bottle.png'), 'Scratches'),
                (os.path.join(TEST_IMAGES_DIR, 'crack-bottle.png'), 'Crack'),
                (os.path.join(TEST_IMAGES_DIR, 'blist-bottle.png'), 'Blist'),
                (os.path.join(TEST_IMAGES_DIR, 'bottle.png'), 'None')  
            ]

            # Weights corresponding to each image (must match length of images list)
            weights = [1, 1, 1, 1, 1, 1, 7]

            select_image, defect = random.choices(images, weights=weights, k=1)[0]
            
            # Run the heavy OpenCV processing in a separate thread so it doesn't block FastAPI's async event loop
            result = await asyncio.to_thread(detect_defects, REFERENCE_IMAGE_PATH, select_image, defect)
            
            if result["status"] == "FAIL":
                rejectedProducts += 1

            msg = json.dumps({
                "type":'result',
                "productId": str(productId),
                "batchNo": 'B101',
                "imageUrl": result["imageUrl"],
                "defectDetails": result["defectDetails"],
                "confidence": 98,
                "inspectedAt": int(time.time()*1000),

                "stats":{
                    "inspected": totalInspectedProducts,
                    "fail": rejectedProducts
                }
            })

            print(msg)

            await websocket.send_text(msg)
            productId+=1
            await asyncio.sleep(0.2)

    
    except Exception:
        pass  # client disconnected — we'll handle this properly next
import uvicorn

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)




    

  