"use client";

import { ScreenSize, TimerConfig } from "@/preview/utils";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function CountdownTimer({
  config,
  size,
}: {
  config: TimerConfig;
  size: ScreenSize;
}) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(config.timeout || "").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [config.timeout]);

  const padNumber = (num: number) => num.toString().padStart(2, "0");

  const timerTextStyle = {
    fontSize:
      size === "lg"
        ? `${(config.timer_font_size || 10) * 1.5}px`
        : `${config.timer_font_size}px`,
    fontWeight: "semibold",
    color: config.timer_text_color || "#FFFFFF",
  };

  const getFlexDirection = (position: string) => {
    switch (position) {
      case "left":
        return "flex-row";
      case "right":
        return "flex-row-reverse";
      case "top":
        return "flex-col";
      case "bottom":
      default:
        return "flex-col-reverse";
    }
  };

  const getTextAlign = (position: string) => {
    switch (position) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      case "top":
      case "bottom":
      default:
        return "text-center";
    }
  };
  const timerBgColor = config.timer_bg_color || "#0F2BFF";

  // Function to darken a hex color by 50%
  const darkenColor = (hexColor, percentage) => {
    const rgb = parseInt(hexColor.slice(1), 16);
    const r = Math.max(0, (rgb >> 16) * (1 - percentage));
    const g = Math.max(0, ((rgb >> 8) & 0x00ff) * (1 - percentage));
    const b = Math.max(0, (rgb & 0x0000ff) * (1 - percentage));
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  };
  const darkerColor = darkenColor(timerBgColor, 0.5);

  // Create a gradient where the first color occupies 0% to 50% and the darker color 50% to 100%
  const gradientBackground = `linear-gradient(to bottom, ${timerBgColor} 0%, ${timerBgColor} 50%, ${darkerColor} 50%, ${darkerColor} 100%)`;

  return (
    <div
      className={`w-full ${
        size === "lg" ? "w-11/12" : "max-w-lg"
      } mx-auto p-4 sm:p-8 md:rounded-lg`}
      style={{ backgroundColor: config.bg_color || "black" }}
    >
      <div
        className={`flex items-center  justify-center ${getFlexDirection(
          config.timer_text_position || "left"
        )}`}
        style={{ gap: config.timer_gap }}
      >
        <p
          className={`${getTextAlign(config.timer_text_position || "left")}  `}
          style={timerTextStyle}
        >
          {config.timer_text}
        </p>
        <div className={`flex `} style={{ gap: 4 }}>
          {["hours", "minutes", "seconds"].map((unit, index) => (
            <>
              <div
                key={unit}
                className={clsx("text-center mb-4 sm:mb-0", size == "sm" && "w-16")}
              >
                <div className="flex gap-1 justify-center">
                  {padNumber(timeLeft[unit as keyof typeof timeLeft])
                    .split("")
                    .map((digit, i) => (
                      <div
                        key={i}
                        className={`text-2xl sm:text-3xl ${
                          size === "lg" ? "lg:text-5xl" : ""
                        } font-bold w-8 sm:w-10 ${
                          size === "lg" ? "lg:w-14" : ""
                        } h-12 sm:h-14 ${
                          size === "lg" ? "lg:h-20" : ""
                        } rounded flex items-center justify-center`}
                        style={{
                          background: gradientBackground,
                          color: config.timer_color || "#a7a7a7",
                        }}
                      >
                        {digit}
                      </div>
                    ))}
                </div>
                <div
                  className="mt-2"
                  style={{
                    color: config.timer_text_color || "#FFFFFF",
                    fontSize:
                      size === "lg"
                        ? `${(config.timer_font_size || 32) / 1.5}px`
                        : `${(config.timer_font_size || 32) / 2}px`,
                  }}
                >
                  {unit.toUpperCase()}
                </div>
              </div>
              {index < 2 && (
                <div className="flex items-start justify-center">
                  <span
                    className={`text-2xl sm:text-4xl ${
                      size === "lg" ? "lg:text-6xl" : ""
                    } font-bold`}
                    style={{ color: config.timer_color || "#a7a7a7" }}
                  >
                    :
                  </span>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
