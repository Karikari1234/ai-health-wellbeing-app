if(!self.define){let e,s={};const a=(a,n)=>(a=new URL(a+".js",n).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(n,c)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let i={};const r=e=>a(e,t),o={module:{uri:t},exports:i,require:r};s[t]=Promise.all(n.map((e=>o[e]||r(e)))).then((e=>(c(...e),i)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"c06d2d6131d521d4329be819ce6ace8c"},{url:"/_next/static/Peeg6QTTAC2gsrsqfWVPJ/_buildManifest.js",revision:"39c04c408085e9912adc25c833c9fca1"},{url:"/_next/static/Peeg6QTTAC2gsrsqfWVPJ/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/382-10fab7efe4265b0f.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/472-76991f2357b2d55b.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/528-6bb9d19f47deb317.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/583-58574b2bbac133ca.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/656.29b1375d5b1b1bac.js",revision:"29b1375d5b1b1bac"},{url:"/_next/static/chunks/app/_not-found-948f94c61ae7cc76.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/app/diagnostic/page-b8a47b40875ef7cc.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/app/layout-026fd6fecce1323c.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/app/page-c614e674d4355a3f.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/app/reset-password/page-191778a0b3f825af.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/ca377847-2cc0748e4b100359.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/fd9d1056-9f9d9e6672fd643d.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/framework-c5181c9431ddc45b.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/main-55536793abbd9080.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/main-app-ca9c52e203367533.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/pages/_app-ee276fea40a4b191.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/pages/_error-deeb844d2074b9d8.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/chunks/polyfills-c67a75d1b6f99dc8.js",revision:"837c0df77fd5009c9e46d446188ecfd0"},{url:"/_next/static/chunks/webpack-fb5121956a03a164.js",revision:"Peeg6QTTAC2gsrsqfWVPJ"},{url:"/_next/static/css/26a1a5c22ee4e247.css",revision:"26a1a5c22ee4e247"},{url:"/_next/static/css/a3e2e0a4aca98ae2.css",revision:"a3e2e0a4aca98ae2"},{url:"/_next/static/media/027647acf05c7ff8-s.woff2",revision:"3591b7c787c0714852651cebcf68a08f"},{url:"/_next/static/media/02faed21c8c8b4c6-s.woff2",revision:"1af76ff14c7020289c7e60c433f0b127"},{url:"/_next/static/media/1f3fe8c6df3d47c1-s.woff2",revision:"c355ec2df77a650bba34b592b711cb81"},{url:"/_next/static/media/3e8ab5100a4aa694-s.woff2",revision:"639aed42fb4050938f7dca6956047319"},{url:"/_next/static/media/b78b37b810acce9f-s.woff2",revision:"84178643d3301be33c644418edb5428e"},{url:"/_next/static/media/de9485acf2d04987-s.woff2",revision:"ae5682f733ad941d4fbaaf52629d97b3"},{url:"/_next/static/media/fe4c52824bfaed3e-s.woff2",revision:"805d9d0a89317c31018ba4093b57970a"},{url:"/icons/chall_resized_512_512.jpg",revision:"5f9b5e5fb4fc860d98c5f5daf021169c"},{url:"/icons/cropped.jpg",revision:"1ca9ad577ded4c897785861a9b74321a"},{url:"/manifest.json",revision:"5e36cd2b7995b8fbcc29804c85396e03"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/vercel.svg",revision:"61c6b19abff40ea7acd577be818f3976"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:a,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
