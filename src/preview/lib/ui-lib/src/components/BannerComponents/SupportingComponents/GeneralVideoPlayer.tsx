"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  url: string;
  thumbnail: string;
  aspectRatio: number;
  radius?: number;
}

const GeneralVideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  thumbnail,
  aspectRatio,
  radius,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [aspectRatioVal, setAspectRatio] = useState(1);

  const handleMetadataLoad = (e) => {
    const { videoWidth, videoHeight } = e.target;
    const newRatio = videoHeight ? videoWidth / videoHeight : 1;
    setAspectRatio(newRatio);
  };
  useEffect(() => {
    setAspectRatio(aspectRatio);
  }, [aspectRatio]);
  // New IntersectionObserver to pause when out of view
  useEffect(() => {
    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          try {
            if (!entry.isIntersecting && videoRef.current) {
              videoRef.current.pause();
            }
            if (entry.isIntersecting && videoRef.current) {
              videoRef.current.play();
            }
          } catch (error: any) {
            console.error("Error handling video playback:", error);
          }
        },
        { threshold: 0.5 }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        try {
          observer.disconnect();
        } catch (error) {
          console.error("Error disconnecting observer:", error);
        }
      };
    } catch (error) {
      console.error("Error setting up IntersectionObserver:", error);
    }
  }, []);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    const loadAndPlayVideo = () => {
      if (!url) return;

      const isHls = url.endsWith(".m3u8");

      if (isHls && video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
      } else if (isHls && Hls.isSupported()) {
        hls = new Hls({ enableWorker: false });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }

      // Add a small delay before attempting to play
      setTimeout(() => {
        video
          .play()
          .then()
          .catch((error) => {
            console.error("Autoplay was prevented:", error);
            // Optionally, you can show a play button here
          });
      }, 100);
    };

    loadAndPlayVideo();

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [url]); // This effect will run whenever the url changes

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-full overflow-hidden"
      style={{ borderRadius: radius || 0, aspectRatio: aspectRatioVal }}
    >
      <div className="relative">
        {!isVideoLoaded && (
          <img
            src={thumbnail}
            alt="Video thumbnail"
            className="w-full h-full object-cover"
          />
        )}
        <video
          ref={videoRef}
          className={`w-full object-cover transition-opacity duration-300 ${
            isVideoLoaded ? "opacity-100 h-full" : "opacity-0 h-0"
          }`}
          onCanPlayThrough={handleVideoLoaded}
          onLoadedMetadata={handleMetadataLoad}
          muted
          loop
          preload="auto"
          playsInline
        />
      </div>
    </div>
  );
};

export default GeneralVideoPlayer;
