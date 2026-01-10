import os, uuid, json, asyncio
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from agents.writer import WriterAgent
from agents.voice import VoiceAgent
from agents.video import VideoAgent
from agents.montage import MontageAgent

# 🔴 BU SATIR EN ÖNEMLİ
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# ROOT ENDPOINT
@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "STRUTER Backend",
        "message": "API is running"
    }

OUTPUT_DIR = os.path.join(os.getcwd(), "storage", "outputs")
os.makedirs(OUTPUT_DIR, exist_ok=True)

class VideoRequest(BaseModel):
    prompt: str
    duration: str
    platform: str
    voice: str

writer, voice_gen, video_fetcher, montage = WriterAgent(), VoiceAgent(), VideoAgent(), MontageAgent()

@app.get("/list-videos")
async def list_videos():
    # storage/outputs klasöründeki mp4 dosyalarını listeler
    output_path = "storage/outputs"
    if not os.path.exists(output_path):
        return []
    files = os.listdir(output_path)
    # Sadece .mp4 olanları dön
    return [{"id": i, "title": f, "url": f"/outputs/{f}"} for i, f in enumerate(files) if f.endswith('.mp4')]

@app.post("/generate-video")
async def generate_video(request: VideoRequest):
    async def event_generator():
        try:
            yield f"data: {json.dumps({'message': '🤖 Senaryo yazılıyor...', 'type': 'info'})}\n\n"
            script_data = writer.generate_script(request.prompt, int(request.duration))
            segments = script_data.get('segments', [])
            
            for i, segment in enumerate(segments):
                yield f"data: {json.dumps({'message': f'🎬 Sahne {i+1} hazırlanıyor...', 'type': 'info'})}\n\n"
                voice_gen.generate_audio(segment['text'], f"speech_{i}")
                video_fetcher.download_video(segment['visual_query'], f"clip_{i}")
                await asyncio.sleep(0.1)

            yield f"data: {json.dumps({'message': '⚙️ Render başladı...', 'type': 'info'})}\n\n"
            final_name = f"struter_{uuid.uuid4().hex[:8]}.mp4"
            final_path = montage.create_final_video (
    segments,
    final_name,
    total_target_duration=request.duration
)
            
            if final_path:
                yield f"data: {json.dumps({'message': '🚀 Video Üretimi Tamamlandı!', 'type': 'success'})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'message': f'❌ Hata: {str(e)}', 'type': 'error'})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

app.mount("/outputs", StaticFiles(directory=OUTPUT_DIR), name="outputs")

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8001)