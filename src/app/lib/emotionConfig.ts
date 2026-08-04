const env = import.meta.env as Record<string, string | undefined>;

export const EMOTION_WEBSOCKET_URL =
  env.VITE_EMOTION_WEBSOCKET_URL?.trim() ||
  env.VITE_EMOTION_WS_URL?.trim() ||
  env.VITE_EMOTION_BACKEND_URL?.trim() ||
  "";

export function getEmotionWebsocketUrl() {
  if (!EMOTION_WEBSOCKET_URL) {
    throw new Error(
      "Missing environment variable VITE_EMOTION_WEBSOCKET_URL or VITE_EMOTION_WS_URL."
    );
  }

  try {
    const url = new URL(EMOTION_WEBSOCKET_URL);
    if (!/^wss?:$/i.test(url.protocol)) {
      throw new Error(`Emotion websocket URL must use ws:// or wss://, got ${url.protocol}`);
    }
    return EMOTION_WEBSOCKET_URL;
  } catch (error) {
    throw new Error(`Invalid emotion websocket URL: ${EMOTION_WEBSOCKET_URL}`);
  }
}
