from fastapi import FastAPI, WebSocket
import asyncio, random, json
import time
app = FastAPI()

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

    defect_info=[
        ("Scratch", "./scratched-bottle.jpg",40),
        ("Dent", "./dented-bottle.jpg",25),
        ("Hole", "./holed-bottle.jpg",1)
        ]

    try:
        while True:
            r=random.random()
            totalInspectedProducts+=1

            if r<0.25:
                defect_type,defect_image,threshold=random.choice(defect_info)
                rejectedProducts+=1
                defect={
                    "type":defect_type,
                    "location":{
                        "x":random.randint(10,100),
                        "y":random.randint(10,100)
                    },
                    "size":{
                        "width":random.randint(10,50),
                        "height":random.randint(10,50)
                    },
                    "severity":'Critical' if defect_type=='Hole' else 'High' if defect_type=='Dent' else 'Medium',
                    "threshold":threshold
                }
                image=defect_image
                confidence=random.randint(10,30)
            else:
                defect=None
                image="./bottle.png"
                confidence=random.randint(30,100)

            msg = json.dumps({
                "type":'result',
                "productId": str(productId),
                "batchNo": 'B101',
                "imageUrl":image,
                "defectDetails":defect,
                "confidence":confidence,
                "inspectedAt":int(time.time()*1000),

                "stats":{
                    "inspected":totalInspectedProducts,
                    "fail":rejectedProducts
                }

                # "status": random.choice(["PASS", "PASS", "PASS", "FAIL"]),
                # "confidence": round(random.uniform(0.4, 0.99), 2),
                # "timestamp": datetime.now().isoformat(),
            })


            await websocket.send_text(msg)
            productId+=1
            await asyncio.sleep(0.2)

    
    except Exception:
        pass  # client disconnected — we'll handle this properly next
import uvicorn

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)