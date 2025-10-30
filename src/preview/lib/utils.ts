import { ScreenSize } from "@/preview/utils";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export const safeImageUrl = async (url: string): Promise<string> => {
    // If it's already a normal URL, just return it
    if (url.startsWith("http")) return url;

    // If it's a blob URL, convert to base64
    if (url.startsWith("blob:")) {
        const blob = await fetch(url).then((res) => res.blob());
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    return url;
};
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getScreenCategory = (): ScreenSize => {
  const width = window.innerWidth;
  if (width < 768) return "sm";
  if (width < 1024) return "md";
  return "lg";
};

export const detectDeviceAndBrowser = () => {
  const userAgent = typeof window !== "undefined" ? navigator.userAgent : "";

  // Detect browsers
  const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  const isFirefox = /Firefox/.test(userAgent);
  const isEdge = /Edg/.test(userAgent);

  // Detect devices
  const isIphone = /iPhone/.test(userAgent);
  const isAndroid = /Android/.test(userAgent);
  const isMac = /Macintosh/.test(userAgent); // Detect Mac

  // Detect Safari on macOS
  const isSafariMac = isSafari && isMac;

  return {
    isChrome,
    isSafari,
    isFirefox,
    isEdge,
    isIphone,
    isAndroid,
    isSafariMac, // True if it's Safari on macOS
    isChromeIphone: isIphone && isChrome,
    isSafariIphone: isIphone && isSafari,
    isChromeAndroid: isAndroid && isChrome,
  };
};

export const genQueryString = (query) => {
  if (Object.keys(query).length > 0) {
    // Convert query parameters to a valid string format for URLSearchParams
    const queryString = new URLSearchParams(
      Object.entries(query).reduce(
        (acc, [key, value]) => {
          if (typeof value === "string") {
            acc[key] = value;
          } else if (Array.isArray(value)) {
            acc[key] = value.join(","); // Join array values if necessary
          }
          return acc;
        },
        {} as Record<string, string>
      )
    ).toString();
    return queryString;
  } else {
    return new URLSearchParams(query).toString();
  }
};
export const getFullDeviceInfoSSr = async ({ req }) => {
  const userAgent = req.headers["user-agent"] || "Unknown";

  return {
    type: "Server Side Call",
    userAgent,
    language: req.headers["accept-language"] || "Unknown",
    maxTouchPoints: 0,
  };
};

export const getFullDeviceInfo = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      info: "no window or navigator,probably an ssr call",
    };
  }

  return {
    platform: navigator.platform || "Unknown",
    userAgent: navigator.userAgent || "Unknown",
    vendor: navigator.vendor || "Unknown",
    language: navigator.language || "Unknown",
    deviceMemory: (navigator as any).deviceMemory || "Unknown",
    hardwareConcurrency: navigator.hardwareConcurrency || "Unknown",
    maxTouchPoints: navigator.maxTouchPoints || 0,
  };
};

export const isTrue = (value) => `${value}`.toLowerCase() === "true";

export const sortSizes = (sizes) => {
  const sizeOrder = {
    "3xs": 0,
    xxxs: 1,
    "2xs": 2,
    xxs: 3,
    xs: 4,
    s: 5,
    m: 6,
    l: 7,
    xl: 8,
    "2xl": 9,
    xxl: 10,
    "3xl": 11,
    xxxl: 12,
    "4xl": 13,
    xxxxl: 14,
    fs: 15,
    freesize: 16,
    // Add more sizes as needed
  };

  // Helper function to check if a size is numeric
  const isNumeric = (size) => /^\d*.{0,1}\d+$/.test(size);

  // Custom sorting function to handle complex sizes like 'xl-xxl', 'xs/s', etc.
  const customSort = (c, d) => {
    let a = `${c}`.toLowerCase();
    let b = `${d}`.toLowerCase();
    // Remove spaces around hyphen or slash for consistency
    const cleanSize = (size) => size.replace(/\s*[-/]\s*/, "-");

    // Clean up both sizes
    a = cleanSize(a);
    b = cleanSize(b);

    // Check if both are numeric sizes
    if (isNumeric(a) && isNumeric(b)) {
      return Number(a) - Number(b); // Sort numeric sizes in ascending order
    }

    // If one is numeric and the other is not, numeric sizes come first
    if (isNumeric(a) && !isNumeric(b)) return -1;
    if (!isNumeric(a) && isNumeric(b)) return 1;

    // Check if both are range-like (contain a hyphen or slash)
    const isRangeA = a.includes("-") || a.includes("/");
    const isRangeB = b.includes("-") || b.includes("/");

    // If both are ranges, compare them
    if (isRangeA && isRangeB) {
      const getRangeParts = (range) =>
        range.includes("-") ? range.split("-") : range.split("/");

      const [startA, endA] = getRangeParts(a);
      const [startB, endB] = getRangeParts(b);

      if (sizeOrder[startA] !== sizeOrder[startB]) {
        return sizeOrder[startA] - sizeOrder[startB]; // Compare by the smallest part
      }

      // If both have the same smallest size, compare by the largest part
      return sizeOrder[endA] - sizeOrder[endB];
    }

    // If one of them is a range and the other is a base size, the base size comes first
    if (isRangeA && !isRangeB) {
      const baseSize = a.includes("-") ? a.split("-")[0] : a.split("/")[0];
      if (baseSize === b) return 1; // Range comes after its base size
      return sizeOrder[baseSize] - sizeOrder[b];
    }
    if (!isRangeA && isRangeB) {
      const baseSize = b.includes("-") ? b.split("-")[0] : b.split("/")[0];
      if (baseSize === a) return -1; // Range comes after its base size
      return sizeOrder[a] - sizeOrder[baseSize];
    }

    // If neither are ranges nor numeric, simply compare based on the order in sizeOrder
    return sizeOrder[a] - sizeOrder[b];
  };

  // Sort the array
  const sorted = sizes.sort(customSort);

  return sorted;
};
export const sortSizeVariants = (sizeVariants) => {
  // Extract the sizes from the products
  const sizes = sizeVariants.map((product) => product.size);

  // Sort the sizes using the existing sortSizes function
  const sortedSizes = sortSizes(sizes);

  // Sort the products based on the sorted sizes
  const sortedProducts = sortedSizes.map((size) => {
    return sizeVariants.find((product) => product.size === size);
  });
  return sortedProducts;
}; 
//example
// const sizes = [
//   "xl",
//   "2xl",
//   "xxl",
//   "xl-xxl",
//   "xl-2xl",
//   "m",
//   "l",
//   "m-l",
//   "xs/s",
//   "xxl/3xl",
// ];

// const sortedSizes = sortSizes(sizes);
// console.log(sortedSizes);
