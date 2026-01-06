"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Loader2, XCircle } from "lucide-react";

// Plyr will be dynamically imported on the client-side to avoid SSR issues.
let Plyr: any = null;

interface LessonVideoPlayerProps {
  videoUrl: string;
}

export function LessonVideoPlayer({ videoUrl }: LessonVideoPlayerProps) {
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  // Use a different ref for the player instance to avoid conflicts.
  const playerInstanceRef = useRef<any>(null);

  // Memoize default options to prevent re-initializing the player on every render.
  const defaultPlyrOptions = useMemo(
    () => ({
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "duration",
        "mute",
        "volume",
        "settings",
        "fullscreen",
      ],
      settings: ["quality", "speed"],
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        modestbranding: 1,
      },
    }),
    []
  );

  useEffect(() => {
    // This function will execute only on the client side.
    const initializePlayer = async () => {
      // 1. Dynamically import the Plyr library.
      if (!Plyr && typeof window !== "undefined") {
        try {
          const PlyrModule = await import("plyr");
          Plyr = PlyrModule.default;

          // Also dynamically inject the CSS to the document's head.
          if (
            !document.querySelector(
              'link[href="https://cdn.plyr.io/3.7.8/plyr.css"]'
            )
          ) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "https://cdn.plyr.io/3.7.8/plyr.css";
            document.head.appendChild(link);
          }
        } catch (e) {
          console.error("Failed to load Plyr", e);
          return;
        }
      }

      const container = videoContainerRef.current;
      if (!container || !videoUrl || !Plyr) {
        return;
      }

      // 2. Extract video ID and prepare the HTML structure for Plyr.
      const getYouTubeVideoId = (url: string) => {
        const regExp =
          /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
      };

      const youtubeVideoId = getYouTubeVideoId(videoUrl);

      if (youtubeVideoId) {
        // Important: Clean up previous instances before creating a new one.
        if (playerInstanceRef.current) {
          playerInstanceRef.current.destroy();
        }
        container.innerHTML = `<div data-plyr-provider="youtube" data-plyr-embed-id="${youtubeVideoId}"></div>`;
        const plyrElement = container.querySelector(
          "[data-plyr-provider]"
        ) as HTMLElement;

        if (plyrElement) {
          // 3. Create a new Plyr instance.
          const player = new Plyr(plyrElement, defaultPlyrOptions);
          playerInstanceRef.current = player;

          // 4. Attach event listeners.
          player.on("ready", () => {
            setIsVideoLoading(false);
          });
        }
      } else {
        // Handle non-youtube or invalid URLs
        setIsVideoLoading(false);
      }
    };

    initializePlayer();

    // Cleanup function to destroy the player instance when the component unmounts.
    return () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
      }
    };
  }, [videoUrl, defaultPlyrOptions]);

  const youtubeVideoId = useMemo(() => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoUrl.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }, [videoUrl]);

  return (
    <div className="w-full relative aspect-video bg-black rounded-lg overflow-hidden">
      {isVideoLoading && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
          <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
        </div>
      )}

      {!youtubeVideoId && !isVideoLoading && (
        <div className="w-full h-full flex flex-col items-center justify-center z-10 text-destructive-foreground bg-destructive">
          <XCircle className="w-12 h-12 mx-auto mb-3" />
          <p className="font-medium">Geçersiz Video Kaynağı</p>
        </div>
      )}

      {/* This div is the container where Plyr will mount the video player. */}
      <div ref={videoContainerRef} className="w-full h-full" />
    </div>
  );
}
