import { useEffect, useRef, useState } from "react";

export function useCameraStream() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const initializeCamera = async () => {
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
          setReady(true);
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to access webcam. Please allow camera permission.";
        setPermissionError(message);
      }
    };

    initializeCamera();

    return () => {
      active = false;
      const videoElement = videoRef.current;
      const stream = videoElement?.srcObject as MediaStream | null;
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return { videoRef, ready, permissionError };
}
