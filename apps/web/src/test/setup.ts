import {
  afterEach,
} from "vitest";

import "@testing-library/jest-dom/vitest";

function createMediaQueryList(
  query: string,
): MediaQueryList {
  return {
    matches: false,
    media: query,
    onchange: null,

    addListener() {
      // Legacy browser compatibility.
    },

    removeListener() {
      // Legacy browser compatibility.
    },

    addEventListener() {
      // No-op test implementation.
    },

    removeEventListener() {
      // No-op test implementation.
    },

    dispatchEvent() {
      return true;
    },
  };
}

Object.defineProperty(
  window,
  "matchMedia",
  {
    writable: true,
    configurable: true,

    value: (
      query: string,
    ): MediaQueryList =>
      createMediaQueryList(
        query,
      ),
  },
);

afterEach(() => {
  document.body.innerHTML = "";
  localStorage.clear();

  document.documentElement
    .removeAttribute(
      "data-theme",
    );

  document.documentElement
    .removeAttribute(
      "data-theme-preference",
    );
});
