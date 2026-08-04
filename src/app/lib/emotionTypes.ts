export interface EmotionFace {
  box: [number, number, number, number];
  emotion: string;
  confidence: number;
  probabilities: Record<string, number>;
}

export interface EmotionInferenceResult {
  faces: EmotionFace[];
  count: number;
  inference_ms: number;
  error?: string;
}

export type EmotionConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";
