import { useCallback, useEffect, useRef, useState } from "react";
import { getEmotionWebsocketUrl } from "@/app/lib/emotionConfig";
import type {
  EmotionConnectionStatus,
  EmotionFace,
  EmotionInferenceResult,
} from "@/app/lib/emotionTypes";

const CAPTURE_WIDTH = 320;
const CAPTURE_HEIGHT = 240;
const FRAME_INTERVAL_MS = 120;
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 10000;

export function useEmotionWebSocket(
  videoRef: React.RefObject<HTMLVideoElement>,
  enabled: boolean
) {
  const [status, setStatus] = useState<EmotionConnectionStatus>("idle");
  const [faces, setFaces] = useState<EmotionFace[]>([]);
  const [count, setCount] = useState(0);
  const [inferenceMs, setInferenceMs] = useState<number | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pendingRef = useRef(false);
  const mountedRef = useRef(false);
  const sendTimerRef = useRef<number | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const requestNextFrameRef = useRef<() => void>(() => {});

  const clearSendTimer = () => {
    if (sendTimerRef.current !== null) {
      window.clearTimeout(sendTimerRef.current);
      sendTimerRef.current = null;
    }
  };

  const clearReconnectTimer = () => {
    if (reconnectTimerRef.current !== null) {
      window.clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const closeSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const createCanvas = useCallback(() => {
    if (!canvasRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = CAPTURE_WIDTH;
      canvas.height = CAPTURE_HEIGHT;
      canvasRef.current = canvas;
    }
  }, []);

  const scheduleNextFrame = useCallback((delay = FRAME_INTERVAL_MS) => {
    clearSendTimer();
    sendTimerRef.current = window.setTimeout(() => {
      sendTimerRef.current = null;
      requestNextFrameRef.current();
    }, delay);
  }, []);

  const handleInferenceResult = useCallback((result: EmotionInferenceResult) => {
    if (result.error) {
      console.error("Emotion inference error:", result.error);
      setLastError(result.error);
      setFaces([]);
      setCount(0);
      setInferenceMs(result.inference_ms ?? null);
      return;
    }

    setLastError(null);
    setFaces(Array.isArray(result.faces) ? result.faces : []);
    setCount(typeof result.count === "number" ? result.count : result.faces?.length ?? 0);
    setInferenceMs(typeof result.inference_ms === "number" ? result.inference_ms : null);
  }, []);

  const requestNextFrame = useCallback(() => {
    const socket = wsRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (
      !enabled ||
      !socket ||
      socket.readyState !== WebSocket.OPEN ||
      pendingRef.current ||
      !video ||
      !canvas
    ) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      scheduleNextFrame(FRAME_INTERVAL_MS);
      return;
    }

    context.drawImage(video, 0, 0, CAPTURE_WIDTH, CAPTURE_HEIGHT);

    try {
      const jpegDataUrl = canvas.toDataURL("image/jpeg", 0.7);
      pendingRef.current = true;
      socket.send(jpegDataUrl);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to send camera frame to emotion service.";
      console.error(message);
      setLastError(message);
      pendingRef.current = false;
      scheduleNextFrame(FRAME_INTERVAL_MS);
    }
  }, [enabled, scheduleNextFrame]);

  useEffect(() => {
    requestNextFrameRef.current = requestNextFrame;
  }, [requestNextFrame]);

  const scheduleReconnect = useCallback(() => {
    if (!mountedRef.current) return;
    clearReconnectTimer();
    const backoff = Math.min(
      RECONNECT_BASE_MS * 2 ** reconnectAttemptsRef.current,
      RECONNECT_MAX_MS
    );
    reconnectAttemptsRef.current += 1;
    reconnectTimerRef.current = window.setTimeout(() => {
      reconnectTimerRef.current = null;
      if (mountedRef.current) {
        setStatus("connecting");
        connectSocket();
      }
    }, backoff);
  }, []);

  const connectSocket = useCallback(() => {
    createCanvas();

    let websocketUrl: string;
    try {
      websocketUrl = getEmotionWebsocketUrl();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Emotion websocket URL is not configured.";
      setStatus("error");
      setLastError(message);
      setFaces([]);
      setCount(0);
      return;
    }

    closeSocket();
    clearSendTimer();
    clearReconnectTimer();

    setStatus("connecting");
    setLastError(null);

    const socket = new WebSocket(websocketUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      reconnectAttemptsRef.current = 0;
      setStatus("connected");
      pendingRef.current = false;
      scheduleNextFrame(0);
    };

    socket.onmessage = (event: MessageEvent) => {
      pendingRef.current = false;
      try {
        const payload = JSON.parse(event.data) as EmotionInferenceResult;
        handleInferenceResult(payload);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to parse emotion response.";
        console.error(message, event.data);
        setLastError(message);
      }

      scheduleNextFrame(FRAME_INTERVAL_MS);
    };

    socket.onerror = () => {
      if (mountedRef.current) {
        setStatus("error");
        setLastError("WebSocket connection error.");
      }
    };

    socket.onclose = () => {
      if (!mountedRef.current) {
        return;
      }
      setStatus("disconnected");
      pendingRef.current = false;
      scheduleReconnect();
    };
  }, [closeSocket, createCanvas, handleInferenceResult, scheduleNextFrame, scheduleReconnect]);

  useEffect(() => {
    mountedRef.current = true;
    if (enabled) {
      connectSocket();
    } else {
      setStatus("idle");
    }

    return () => {
      mountedRef.current = false;
      clearSendTimer();
      clearReconnectTimer();
      closeSocket();
    };
  }, [enabled, connectSocket, closeSocket]);

  return {
    status,
    faces,
    count,
    inferenceMs,
    lastError,
  };
}
