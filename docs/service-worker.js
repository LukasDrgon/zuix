/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "app/content/api/api_template.css",
    "revision": "61474ac5fc5b338a98f960811cd01194"
  },
  {
    "url": "app/content/api/api_template.html",
    "revision": "e969389732c602102897181a8496b1ad"
  },
  {
    "url": "app/content/api/api_template.js",
    "revision": "31ebcceb3611dbe0a5cb429831485e4c"
  },
  {
    "url": "app/content/api/data/ComponentCache.json",
    "revision": "0d1b9236f9d61ca6541f29fe5a1b55c6"
  },
  {
    "url": "app/content/api/data/ComponentContext.json",
    "revision": "76a6ec8cc42d58a3e97c8a94caaeb276"
  },
  {
    "url": "app/content/api/data/ContextController.json",
    "revision": "2f9706ac9f7820028e38ca4c8dd89b04"
  },
  {
    "url": "app/content/api/data/Localizer.json",
    "revision": "b8d4d18a76d4fdb112c232374e85743b"
  },
  {
    "url": "app/content/api/data/Zuix.json",
    "revision": "0a05939d145f43eab0c77327c57e3854"
  },
  {
    "url": "app/content/api/data/ZxQuery.json",
    "revision": "83772ae313c85d143db762f4316c1ea3"
  },
  {
    "url": "app/content/docs/examples/links.css",
    "revision": "300f68df4ae2415d93a52a566b256dbf"
  },
  {
    "url": "app/content/docs/examples/links.html",
    "revision": "b9d9dd3877f514fb4a90a4d14daef5fd"
  },
  {
    "url": "app/templates/mdl_card.css",
    "revision": "a64525215fefa93fb3c2fe40c48bea02"
  },
  {
    "url": "app/templates/mdl_card.html",
    "revision": "ecaa9aeb44f0e845c1f42a641f02b45c"
  },
  {
    "url": "config.js",
    "revision": "b3f927651bc0af878c86cbcb5e980b50"
  },
  {
    "url": "css/flex-layout-attribute.min.css",
    "revision": "c55488315343d9afb4d13ebf9cc8f97b"
  },
  {
    "url": "index.css",
    "revision": "588f075779ca17aa0b949aba18a12493"
  },
  {
    "url": "index.html",
    "revision": "e2cc703df44599120a6d0313d6bf6825"
  },
  {
    "url": "index.js",
    "revision": "fac616709cdf228aa8081d1257de26ca"
  },
  {
    "url": "js/animate-3.5.2.min.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/mdl/material.css",
    "revision": "57313781c72269db589ebea903725dcc"
  },
  {
    "url": "js/mdl/material.js",
    "revision": "d4d04abe369dc10ce86e42c00ee62ccd"
  },
  {
    "url": "js/mdl/material.min.css",
    "revision": "8ce4631006b601c6253396365879a7a9"
  },
  {
    "url": "js/mdl/material.min.js",
    "revision": "df211fcb13a5c100eeb182f14fd37b44"
  },
  {
    "url": "js/prism/clipboard.min.js",
    "revision": "3e5e0fa949e0e7c5ed5fed7b4cc0ee00"
  },
  {
    "url": "js/prism/prism.css",
    "revision": "485c9fc9787ea73d7c802822096c5dfe"
  },
  {
    "url": "js/prism/prism.js",
    "revision": "dac215c15573fb5907885ef1094829fa"
  },
  {
    "url": "js/showdown.min.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix-bundler.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix-bundler.min.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix.min.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix/zuix-bundler.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix/zuix-bundler.min.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix/zuix.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix/zuix.min.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "manifest.json",
    "revision": "fac3401654e32b3003f57571497bdbec"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_1_1.png",
    "revision": "f13e634f4f4767f426a791ddf85ba9b0"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_1_2.png",
    "revision": "a40e24033ce25edb5169d5f50a1783d7"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_1_3.png",
    "revision": "9325671498a60f3e05c6bfdcb6001bac"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_2_1.png",
    "revision": "ffd9b2ce17eb5cf4b6e0c2e88128e7bc"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_2_2.png",
    "revision": "c0aa4864727b53a82614fb098c286bca"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_2_3.png",
    "revision": "45b8f2b32fa463cbbf478693354bb676"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_2_4.png",
    "revision": "5175980071714ec946d815b4180b23bc"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_3_1.png",
    "revision": "0b58afb90669a0c00dd796f64872b141"
  },
  {
    "url": "app/content/docs/examples/alice/img/ch_3_2.png",
    "revision": "6f21a396f2c8b7f3a5a884dc9a8932c0"
  },
  {
    "url": "images/api.png",
    "revision": "ba62975c85636fe9b08d5f842c2023f0"
  },
  {
    "url": "images/documentation.png",
    "revision": "d3ca9f4ad8b31f6f4141cb594e99ddc3"
  },
  {
    "url": "images/example_picture.jpg",
    "revision": "b2519b8b7ef1a2026b40f9feeaa7d64c"
  },
  {
    "url": "images/icons/desktop/android-chrome-192x192.png",
    "revision": "93d5e77e9ee1e9c6975f3c0bd1a21574"
  },
  {
    "url": "images/icons/desktop/android-chrome-512x512.png",
    "revision": "6df83c6c13be17a2ea70d29e340c5ddb"
  },
  {
    "url": "images/icons/desktop/apple-touch-icon.png",
    "revision": "2b78ed332644d19d9779c069c5842538"
  },
  {
    "url": "images/icons/desktop/favicon-16x16.png",
    "revision": "6c047cdbd3d5c4c962a3a692a5025d27"
  },
  {
    "url": "images/icons/desktop/favicon-32x32.png",
    "revision": "7413528d5e59c22af1ccf38187bc950b"
  },
  {
    "url": "images/icons/desktop/mstile-150x150.png",
    "revision": "540caa78f56655281b2d4b17ad52f2ce"
  },
  {
    "url": "images/icons/desktop/safari-pinned-tab.svg",
    "revision": "a0ab2c612c6a5019b3e4ae7c38043b98"
  },
  {
    "url": "images/image_place_holder.png",
    "revision": "587f8d42c812f26f176b2e3b45514614"
  },
  {
    "url": "images/wallpaper.jpg",
    "revision": "7885e42f532c3e40db3cfbff68e42c56"
  },
  {
    "url": "images/zuix_web_starter.png",
    "revision": "7d3fc094f12897efebda1109d55b9721"
  },
  {
    "url": "images/zuix-logo.svg",
    "revision": "cd8baa13270a24886c2f335322aa4814"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/\.(?:png|jpg|jpeg|svg)$/, workbox.strategies.cacheFirst({ cacheName: "images", plugins: [new workbox.expiration.Plugin({"maxEntries":50,"purgeOnQuotaError":false})] }), 'GET');
workbox.routing.registerRoute(/\.(?:html|json|js|css)$/, workbox.strategies.cacheFirst({ cacheName: "default", plugins: [new workbox.expiration.Plugin({"maxEntries":50,"purgeOnQuotaError":false})] }), 'GET');
