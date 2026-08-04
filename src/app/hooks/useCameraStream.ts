import { useEffect, useRef, useState } from "react";

export function useCameraStream(enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const stopStream = () => {
      const videoElement = videoRef.current;
      const stream = videoElement?.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        videoElement!.srcObject = null;
      }
      setReady(false);
    };

    const initializeCamera = async () => {
      if (!enabled) {
        stopStream();
        setPermissionError(null);
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setPermissionError("Camera access is not supported by this browser.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
          audio: false,
        });

        if (!active) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        const videoElement = videoRef.current;
        if (!videoElement) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        videoElement.srcObject = stream;
        videoElement.muted = true;
        videoElement.playsInline = true;

        await videoElement.play();
        if (active) {
          setPermissionError(null);
          setReady(true);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to access webcam. Please allow camera permission.";
        setPermissionError(message);
        setReady(false);
      }
    };

    initializeCamera();

    return () => {
      active = false;
      stopStream();
    };
  }, [enabled]);

  return { videoRef, ready, permissionError };
}
