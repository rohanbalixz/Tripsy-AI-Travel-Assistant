import time, json, logging
from starlette.middleware.base import BaseHTTPMiddleware

# Use our own logger (NOT uvicorn.access)
logger = logging.getLogger("tripsy.request")
if not logger.handlers:
    h = logging.StreamHandler()
    h.setFormatter(logging.Formatter('%(message)s'))
    logger.addHandler(h)
logger.propagate = False
logger.setLevel(logging.INFO)

class RequestLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        start = time.perf_counter()
        response = await call_next(request)
        try:
            duration_ms = round((time.perf_counter() - start) * 1000, 2)
            log = {
                "method": request.method,
                "path": request.url.path,
                "status_code": getattr(response, "status_code", 0),
                "duration_ms": duration_ms,
                "client": request.client.host if request.client else None,
            }
            logger.info(json.dumps(log))
        except Exception:
            # Never let logging break the request
            pass
        return response
