from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.templating import Jinja2Templates

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


# @app.get("/get-ply/")
# async def get_ply():
#     file_path = "/home/beelzebub/Downloads/fused_mesh_reflection_aligned_hNQV5QP (1).ply"
#     try:
#         return FileResponse(path=file_path, media_type='application/octet-stream', filename=file_path.split("/")[-1])
#     except FileNotFoundError:
#         raise HTTPException(status_code=404, detail="File not found.")
        
@app.get("/", response_class=HTMLResponse)
async def root(request: Request, modelurl1: str = None, modelurl2: str = None):
    return templates.TemplateResponse("index.html", {"request": request, "modelurl1": modelurl1, "modelurl2": modelurl2})