(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5405],{8581:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(9530)}])},7129:function(e,t,n){"use strict";n.d(t,{L:function(){return r}});var r=n(7294).useLayoutEffect},9530:function(e,t,n){"use strict";n.r(t),n.d(t,{__N_SSG:function(){return ae},default:function(){return oe},getServerSideProps_DISABLED:function(){return se}});var r=n(8520),i=n.n(r),a=n(5893),o=n(7294),s=n(7129);function l(){return new Worker(n.p+"static/chunks/postcss.worker-387dbc81114b2927.worker.js")}var c=n(7498),u=n(296),d=n(5152),h=n(3805),f=n.n(h),m=(0,d.default)((function(){return Promise.all([n.e(3069),n.e(9201),n.e(3460)]).then(n.bind(n,3460))}),{loadableGenerated:{webpack:function(){return[3460]},modules:["../components/Editor.js -> ./EditorDesktop"]},ssr:!1}),g=(0,d.default)((function(){return Promise.all([n.e(3126),n.e(6531),n.e(7745)]).then(n.bind(n,7745))}),{loadableGenerated:{webpack:function(){return[7745]},modules:["../components/Editor.js -> ./EditorMobile"]},ssr:!1}),v=f()()?g:m,y=n(5884),p=n(9501);function w(e){return new Promise((function(t){var n="throw new Error('Parsing successful!');function _hmm(){\n".concat(e,"\n}"),r=document.createElement("script");r.innerHTML=n,window.addEventListener("error",(function e(n){n.preventDefault(),window.removeEventListener("error",e),r.parentNode.removeChild(r),-1===n.message.indexOf("Parsing successful")?t({isValid:!1,error:{line:n.lineno-1,message:n.error.toString()}}):t({isValid:!0})})),document.body.appendChild(r)}))}function x(e,t){var n=void 0===t?100:t,r=(0,o.useState)({value:e}),i=r[0],a=r[1],s=(0,o.useState)(e),l=s[0],c=s[1],u=(0,o.useRef)();return(0,o.useEffect)((function(){return u.current=window.setTimeout((function(){c(i.value)}),n),function(){window.clearTimeout(u.current)}}),[i,n]),[l,function(e){a({value:e})},function(e){window.clearTimeout(u.current),c(e)},function(){return window.clearTimeout(u.current)}]}var b=n(6010);function k(e){return e.targetTouches?1===e.targetTouches.length?{x:e.targetTouches[0].clientX,y:e.targetTouches[0].clientY}:null:{x:e.clientX,y:e.clientY}}function j(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var C=(0,o.forwardRef)((function(e,t){var n=e.responsiveDesignMode,r=e.responsiveSize,i=e.onChangeResponsiveSize,l=e.onLoad,c=e.iframeClassName,u=void 0===c?"":c,d=function(e){var t=k(e);null!==t&&(e.preventDefault(),N({handle:"left",startWidth:S.width,startX:t.x}))},h=function(e){var t=k(e);null!==t&&(e.preventDefault(),N({handle:"right",startWidth:S.width,startX:t.x}))},f=function(e){var t=k(e);null!==t&&(e.preventDefault(),N({handle:"bottom-left",startWidth:S.width,startHeight:S.height,startX:t.x,startY:t.y}))},m=function(e){var t=k(e);null!==t&&(e.preventDefault(),N({handle:"bottom",startHeight:S.height,startY:t.y}))},g=function(e){var t=k(e);null!==t&&(e.preventDefault(),N({handle:"bottom-right",startWidth:S.width,startHeight:S.height,startX:t.x,startY:t.y}))},v=(0,o.useRef)(),y=(0,o.useState)({width:0,height:0}),p=y[0],w=y[1],x=(0,o.useState)(),C=x[0],N=x[1],M=(0,o.useRef)(),S=function(e,t){var n=function(e){var t=e>p.width-34?(p.width-34)/e:1;return{width:Math.min(Math.max(50,Math.round(e*(1/t))),Math.round((p.width-34)*(1/t))),zoom:t}}(e),r=n.width,i=n.zoom,a=function(e){var t=e>p.height-17-40?(p.height-17-40)/e:1;return{height:Math.min(Math.max(50,Math.round(e*(1/t))),Math.round((p.height-17-40)*(1/t))),zoom:t}}(t),o=a.height,s=a.zoom;return{width:r,height:o,zoom:Math.min(i,s)}}(r.width,r.height);return(0,o.useEffect)((function(){var e=!0,t=new ResizeObserver((function(){window.clearTimeout(M.current);var t=v.current.getBoundingClientRect(),n=Math.round(t.width),r=Math.round(t.height);w({visible:!e&&0!==n&&0!==r,width:n,height:r}),M.current=window.setTimeout((function(){w((function(e){return function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){j(e,t,n[t])}))}return e}({},e,{visible:!1})}))}),1e3),e=!1}));return t.observe(v.current),function(){t.disconnect()}}),[]),(0,s.L)((function(){if(p.width>50&&p.height>50&&i((function(e){return{width:e.width,height:e.height}})),C){var e=function(e){e.preventDefault();var t=k(e),n=t.x,r=t.y;"bottom"===C.handle?(document.body.classList.add("cursor-ns-resize"),i((function(e){return{width:e.width,height:C.startHeight+(r-C.startY)}}))):"left"===C.handle?(document.body.classList.add("cursor-ew-resize"),i((function(e){var t=e.height;return{width:C.startWidth-2*(n-C.startX),height:t}}))):"right"===C.handle?(document.body.classList.add("cursor-ew-resize"),i((function(e){var t=e.height;return{width:C.startWidth+2*(n-C.startX),height:t}}))):"bottom-left"===C.handle?(document.body.classList.add("cursor-nesw-resize"),i((function(){return{width:C.startWidth-2*(n-C.startX),height:C.startHeight+(r-C.startY)}}))):"bottom-right"===C.handle&&(document.body.classList.add("cursor-nwse-resize"),i((function(){return{width:C.startWidth+2*(n-C.startX),height:C.startHeight+(r-C.startY)}})))},t=function(e){e.preventDefault(),"bottom"===C.handle?document.body.classList.remove("cursor-ns-resize"):"left"===C.handle||"right"===C.handle?document.body.classList.remove("cursor-ew-resize"):"bottom-left"===C.handle?document.body.classList.remove("cursor-nesw-resize"):"bottom-right"===C.handle&&document.body.classList.remove("cursor-nwse-resize"),N()};return window.addEventListener("mousemove",e),window.addEventListener("mouseup",t),window.addEventListener("touchmove",e),window.addEventListener("touchend",t),function(){window.removeEventListener("mousemove",e),window.removeEventListener("mouseup",t),window.removeEventListener("touchmove",e),window.removeEventListener("touchend",t)}}}),[C,p]),(0,a.jsxs)("div",{className:"absolute inset-0 top-12 lg:top-0 flex flex-col border-t border-gray-200 dark:border-white/10 lg:border-0 bg-gray-50 dark:bg-black",ref:v,children:[n&&(0,a.jsxs)("div",{className:"flex-none text-center text-xs leading-4 tabular-nums whitespace-pre py-3 text-gray-900 dark:text-gray-400",children:[S.width,"  ","\xd7","  ",S.height,"  ",(0,a.jsxs)("span",{className:"text-gray-500",children:["(",Math.round(100*S.zoom),"%)"]})]}),(0,a.jsxs)("div",{className:"flex-auto grid justify-center",style:n?{gridTemplateColumns:"1.0625rem min-content 1.0625rem",gridTemplateRows:"min-content 1.0625rem"}:{gridTemplateColumns:"100%"},children:[n&&(0,a.jsx)("div",{className:"cursor-ew-resize select-none bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors duration-150 flex items-center justify-center",onMouseDown:d,onTouchStart:d,children:(0,a.jsx)("svg",{viewBox:"0 0 6 16",width:6,height:16,fill:"none",stroke:"currentColor",children:(0,a.jsx)("path",{d:"M 0.5 0 V 16 M 5.5 0 V 16"})})}),(0,a.jsx)("div",{className:(0,b.Z)("relative",{"border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden":n}),style:n?{width:Math.round(S.width*S.zoom),height:Math.round(S.height*S.zoom)}:{},children:(0,a.jsx)("iframe",{ref:t,title:"Preview",style:n?{width:S.width,height:S.height,marginLeft:(S.width-Math.round(S.width*S.zoom))/-2,transformOrigin:"top",transform:"scale(".concat(S.zoom,")")}:{},onLoad:l,className:(0,b.Z)(u,"absolute inset-0 w-full h-full bg-white",{"pointer-events-none select-none":C}),sandbox:"allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals",srcDoc:"\n                <!DOCTYPE html>\n                <html>\n                  <head>\n                    <meta charset=\"utf-8\">\n                    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n                    <style id=\"_style\"></style>\n                    <script>\n                    var hasHtml = false\n                    var hasCss = false\n                    var visible = false\n                    window.addEventListener('message', (e) => {\n                      if (typeof e.data.clear !== 'undefined') {\n                        setHtml()\n                        setCss()\n                        checkVisibility()\n                        return\n                      }\n                      if (typeof e.data.css !== 'undefined') {\n                        setCss(e.data.css)\n                      }\n                      if (typeof e.data.html !== 'undefined') {\n                        setHtml(e.data.html)\n                      }\n                      checkVisibility()\n                    })\n                    function checkVisibility() {\n                      if (!visible && hasHtml && hasCss) {\n                        visible = true\n                        document.body.style.display = ''\n                      } else if (visible && (!hasHtml || !hasCss)) {\n                        visible = false\n                        document.body.style.display = 'none'\n                      }\n                    }\n                    function setHtml(html) {\n                      if (typeof html === 'undefined') {\n                        document.body.innerHTML = ''\n                        hasHtml = false\n                      } else {\n                        document.body.innerHTML = html\n                        hasHtml = true\n                      }\n                    }\n                    function setCss(css) {\n                      const style = document.getElementById('_style')\n                      const newStyle = document.createElement('style')\n                      newStyle.id = '_style'\n                      newStyle.innerHTML = typeof css === 'undefined' ? '' : css\n                      style.parentNode.replaceChild(newStyle, style)\n                      hasCss = typeof css === 'undefined' ? false : true\n                    }\n                    <\/script>\n                  </head>\n                  <body style=\"display:none\">\n                  </body>\n                  <script>\n                  // https://github.com/sveltejs/svelte-repl/blob/master/src/Output/srcdoc/index.html\n                  // https://github.com/sveltejs/svelte-repl/blob/master/LICENSE\n                  document.body.addEventListener('click', event => {\n                    if (event.which !== 1) return;\n                    if (event.metaKey || event.ctrlKey || event.shiftKey) return;\n                    if (event.defaultPrevented) return;\n\n                    // ensure target is a link\n                    let el = event.target;\n                    while (el && el.nodeName !== 'A') el = el.parentNode;\n                    if (!el || el.nodeName !== 'A') return;\n\n                    if (el.hasAttribute('download') || el.getAttribute('rel') === 'external' || el.target) return;\n\n                    event.preventDefault();\n                    window.open(el.href, '_blank');\n                  });\n                  <\/script>\n                </html>\n              "})}),n&&(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("div",{className:"cursor-ew-resize select-none bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors duration-150 flex items-center justify-center",onMouseDown:h,onTouchStart:h,children:(0,a.jsx)("svg",{viewBox:"0 0 6 16",width:6,height:16,fill:"none",stroke:"currentColor",children:(0,a.jsx)("path",{d:"M 0.5 0 V 16 M 5.5 0 V 16"})})}),(0,a.jsx)("div",{className:"cursor-nesw-resize select-none bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors duration-150 flex items-center justify-center",onMouseDown:f,onTouchStart:f,children:(0,a.jsx)("svg",{viewBox:"0 0 16 6",width:16,height:6,fill:"none",stroke:"currentColor",className:"transform translate-x-0.5 -translate-y-0.5 rotate-45",children:(0,a.jsx)("path",{d:"M 0 0.5 H 16 M 0 5.5 H 16"})})}),(0,a.jsx)("div",{className:"cursor-ns-resize select-none bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors duration-150 flex items-center justify-center",onMouseDown:m,onTouchStart:m,children:(0,a.jsx)("svg",{viewBox:"0 0 16 6",width:16,height:6,fill:"none",stroke:"currentColor",children:(0,a.jsx)("path",{d:"M 0 0.5 H 16 M 0 5.5 H 16"})})}),(0,a.jsx)("div",{className:"cursor-nwse-resize select-none bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 hover:text-gray-700 dark:hover:text-gray-400 transition-colors duration-150 flex items-center justify-center",onMouseDown:g,onTouchStart:g,children:(0,a.jsx)("svg",{viewBox:"0 0 16 6",width:16,height:6,fill:"none",stroke:"currentColor",className:"transform -translate-x-0.5 -translate-y-0.5 -rotate-45",children:(0,a.jsx)("path",{d:"M 0 0.5 H 16 M 0 5.5 H 16"})})})]})]}),!n&&p.visible&&(0,a.jsxs)("div",{className:"absolute top-4 right-4 rounded-full h-6 flex items-center text-xs leading-4 whitespace-pre px-3 tabular-nums bg-white border border-gray-300 shadow dark:bg-gray-700 dark:border-transparent",children:[p.width,"  ","\xd7","  ",p.height]})]})})),N=n(2918);function M(e){var t=e.error;return t?(0,a.jsxs)("div",{className:"absolute inset-0 w-full h-full p-6 bg-red-50 text-red-700 mt-10 border-t border-gray-200 dark:border-gray-600 md:mt-0 md:border-0",children:[(0,a.jsxs)("h2",{className:"text-base leading-6 font-semibold text-red-900 mb-4 flex items-center",children:[(0,a.jsx)("span",{className:"bg-red-500 rounded-full w-4 h-4 border-4 border-red-200"}),(0,a.jsxs)("span",{className:"ml-3.5",children:[t.file," Error"]}),"undefined"!==typeof t.line?(0,a.jsxs)("dl",{className:"text-sm leading-6 font-medium text-red-700 bg-red-100 rounded-full px-3 ml-4",children:[(0,a.jsx)("dt",{className:"inline",children:"Line"})," ",(0,a.jsx)("dd",{className:"inline",children:t.line})]}):null]}),(0,a.jsx)("p",{className:"font-mono text-sm leading-5",children:t.message})]}):null}var S=n(1163);function L(e){e.className;return(0,a.jsx)("div",{style:{width:171,height:21},children:"Code in the Wind"})}var z=n(8873),E=n(9195),O=n(7321),T=n(2631),D=n(482);function P(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],r=!0,i=!1,a=void 0;try{for(var o,s=e[Symbol.iterator]();!(r=(o=s.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(l){i=!0,a=l}finally{try{r||null==s.return||s.return()}finally{if(i)throw a}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var _={1:E.i,2:O.i,3:T.i};function H(e){var t=e.layout,n=e.onChangeLayout,r=e.responsiveDesignMode,i=e.onToggleResponsiveDesignMode,o=e.tailwindVersion,s=e.onChangeTailwindVersion,l=e.children;return(0,a.jsxs)("header",{className:"relative z-20 flex-none py-3 pl-5 pr-3 sm:pl-6 sm:pr-4 md:pr-3.5 lg:px-6 flex items-center space-x-4 antialiased",style:{fontFeatureSettings:'"cv02", "cv03", "cv04", "cv11"'},children:[(0,a.jsxs)("div",{className:"flex-auto flex items-center min-w-0 space-x-6",children:[(0,a.jsx)(L,{className:"flex-none text-black dark:text-white"}),l]}),(0,a.jsxs)("div",{className:"flex items-center",children:[(0,a.jsx)(R,{value:o,onChange:s}),(0,a.jsxs)("div",{className:"hidden lg:flex items-center ml-6 rounded-md ring-1 ring-gray-900/5 shadow-sm dark:ring-0 dark:bg-gray-800 dark:shadow-highlight/4",children:[(0,a.jsxs)(V,{isActive:"vertical"===t,label:"Switch to vertical split layout",onClick:function(){return n("vertical")},children:[(0,a.jsx)("path",{d:"M12 3h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-9",fill:"none"}),(0,a.jsx)("path",{d:"M3 17V5a2 2 0 0 1 2-2h7a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2Z"})]}),(0,a.jsxs)(V,{isActive:"horizontal"===t,label:"Switch to horizontal split layout",onClick:function(){return n("horizontal")},children:[(0,a.jsx)("path",{d:"M23 11V3H3v8h20Z",strokeWidth:"0"}),(0,a.jsx)("path",{d:"M23 17V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2ZM22 11H4",fill:"none"})]}),(0,a.jsx)(V,{isActive:"preview"===t,label:"Switch to preview-only layout",onClick:function(){return n("preview")},children:(0,a.jsx)("path",{d:"M23 17V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z",fill:"none"})}),(0,a.jsxs)(V,{isActive:r,label:"Toggle responsive design mode",onClick:i,className:"hidden md:block",children:[(0,a.jsx)("path",{d:"M15 19h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H4a1 1 0 0 0-1 1",fill:"none"}),(0,a.jsx)("path",{d:"M12 17V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2Z"})]})]}),(0,a.jsx)("div",{className:"hidden sm:block mx-6 lg:mx-4 w-px h-6 bg-gray-200 dark:bg-gray-700"}),(0,a.jsxs)(V,{className:"ml-4 sm:ml-0 ring-1 ring-gray-900/5 shadow-sm hover:bg-gray-50 dark:ring-0 dark:bg-gray-800 dark:hover:bg-gray-700 dark:shadow-highlight/4",naturalWidth:24,naturalHeight:24,width:36,height:36,label:(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("span",{className:"dark:hidden",children:"Switch to dark theme"}),(0,a.jsx)("span",{className:"hidden dark:inline",children:"Switch to light theme"})]}),onClick:z.X8,iconClassName:"stroke-sky-500 fill-sky-100 group-hover:stroke-sky-600 dark:stroke-gray-400 dark:fill-gray-400/20 dark:group-hover:stroke-gray-300",ringClassName:"focus-visible:ring-sky-500 dark:focus-visible:ring-2 dark:focus-visible:ring-gray-400",children:[(0,a.jsxs)("g",{className:"dark:opacity-0",children:[(0,a.jsx)("path",{d:"M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"}),(0,a.jsx)("path",{d:"M12 4v.01M17.66 6.345l-.007.007M20.005 12.005h-.01M17.66 17.665l-.007-.007M12 20.01V20M6.34 17.665l.007-.007M3.995 12.005h.01M6.34 6.344l.007.007",fill:"none"})]}),(0,a.jsxs)("g",{className:"opacity-0 dark:opacity-100",children:[(0,a.jsx)("path",{d:"M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"}),(0,a.jsx)("path",{d:"M12 3v1M18.66 5.345l-.828.828M21.005 12.005h-1M18.66 18.665l-.828-.828M12 21.01V20M5.34 18.666l.835-.836M2.995 12.005h1.01M5.34 5.344l.835.836",fill:"none"})]})]})]})]})}function V(e){var t=e.isActive,n=void 0!==t&&t,r=e.label,i=e.onClick,o=e.width,s=void 0===o?42:o,l=e.height,c=void 0===l?36:l,u=e.naturalWidth,d=void 0===u?26:u,h=e.naturalHeight,f=void 0===h?22:h,m=e.className,g=e.children,v=e.iconClassName,y=e.ringClassName;return(0,a.jsxs)("button",{type:"button",className:(0,b.Z)(m,"group focus:outline-none focus-visible:ring-2 rounded-md",y||(n?"focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400":"focus-visible:ring-gray-400/70 dark:focus-visible:ring-gray-500")),onClick:i,children:[(0,a.jsx)("span",{className:"sr-only",children:r}),(0,a.jsx)("svg",{width:s,height:c,viewBox:"".concat((s-d)/-2," ").concat((c-f)/-2," ").concat(s," ").concat(c),strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",className:v||(n?"fill-sky-100 stroke-sky-500 dark:fill-sky-400/50 dark:stroke-sky-400":"fill-gray-100 stroke-gray-400/70 hover:fill-gray-200 hover:stroke-gray-400 dark:fill-gray-400/20 dark:stroke-gray-500 dark:hover:fill-gray-400/30 dark:hover:stroke-gray-400"),children:g})]})}function R(e){var t=e.value,n=e.onChange;return(0,a.jsxs)(D.R,{value:t,onChange:n,as:"div",className:"relative",children:[(0,a.jsxs)(D.R.Button,{className:"text-gray-500 text-xs leading-5 font-semibold bg-gray-400/10 rounded-full py-1 px-3 flex items-center hover:bg-gray-400/20 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:shadow-highlight/4",children:["v",_[t],(0,a.jsx)("svg",{width:"6",height:"3",className:"ml-2 overflow-visible","aria-hidden":"true",children:(0,a.jsx)("path",{d:"M0 0L3 3L6 0",fill:"none",stroke:"currentColor",strokeWidth:"1.5",strokeLinecap:"round",strokeLinejoin:"round"})})]}),(0,a.jsx)("div",{className:"absolute top-full right-0 mt-2 rounded-lg shadow-lg",children:(0,a.jsx)(D.R.Options,{className:"overflow-hidden py-1 w-44 rounded-lg bg-white ring-1 ring-gray-900/10 text-sm leading-6 font-semibold text-gray-700 space-y-1 dark:bg-gray-800 dark:ring-0 dark:text-gray-300 dark:shadow-highlight/4",children:Object.entries(_).sort((function(e,t){return parseInt(t,10)-parseInt(e,10)})).map((function(e){var t=P(e,2),n=t[0],r=t[1];return(0,a.jsx)(D.R.Option,{value:n,className:function(e){var t=e.selected,n=e.active;return(0,b.Z)("flex items-center justify-between px-3 py-1 cursor-pointer",n&&!t&&"text-gray-900 dark:text-white",n&&"bg-gray-50 dark:bg-gray-600/30",t&&"text-sky-500 dark:text-sky-400")},children:function(e){var t=e.selected;return(0,a.jsxs)(a.Fragment,{children:["v",r,t&&(0,a.jsx)("svg",{width:"24",height:"24",fill:"none",children:(0,a.jsx)("path",{d:"m6 13 4 4 8-10",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})})]})}},n)}))})})]})}function I(e){var t=e.activeTab,n=e.width,r=e.isLoading,i=e.showPreviewTab,s=e.onChange,l=e.onTidy,c=(0,o.useState)(!1),u=c[0],d=c[1];return(0,o.useEffect)((function(){f()()||d(!0)}),[]),(0,a.jsxs)("div",{className:"flex items-center flex-none pl-5 sm:pl-6 pr-4 lg:pr-6 absolute z-10 top-0 left-0 -mb-px antialiased",style:{width:n,fontFeatureSettings:'"cv02", "cv03", "cv04", "cv11"'},children:[(0,a.jsxs)("div",{className:"flex space-x-5",children:[(0,a.jsx)(A,{isActive:"html"===t,onClick:function(){return s("html")},children:"HTML"}),(0,a.jsx)(A,{isActive:"css"===t,onClick:function(){return s("css")},children:"CSS"}),i&&(0,a.jsx)(A,{isActive:"preview"===t,onClick:function(){return s("preview")},children:"Preview"})]}),(0,a.jsxs)("div",{className:"ml-auto flex items-center",children:[r&&(0,a.jsxs)("p",{children:[(0,a.jsx)("span",{className:"sr-only",children:"Loading"}),(0,a.jsxs)("svg",{fill:"none",viewBox:"0 0 24 24",className:"w-4 h-4 animate-spin",children:[(0,a.jsx)("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),(0,a.jsx)("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]})]}),u&&(0,a.jsxs)("button",{type:"button",className:"ml-4 text-sm font-semibold text-gray-500 flex items-center hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",onClick:l,children:[(0,a.jsxs)("svg",{viewBox:"0 0 24 24",className:"w-6 h-6 mr-1","aria-hidden":"true",children:[(0,a.jsx)("path",{d:"M5 9a2 2 0 0 1 2 2 1 1 0 1 0 2 0 2 2 0 0 1 2-2 1 1 0 1 0 0-2 2 2 0 0 1-2-2 1 1 0 0 0-2 0 2 2 0 0 1-2 2 1 1 0 0 0 0 2Z",fill:"currentColor",className:"text-gray-400 dark:text-gray-500"}),(0,a.jsx)("path",{d:"M11 16a3 3 0 0 1 3 3 1 1 0 1 0 2 0 3 3 0 0 1 3-3 1 1 0 1 0 0-2 3 3 0 0 1-3-3 1 1 0 1 0-2 0 3 3 0 0 1-3 3 1 1 0 1 0 0 2Z",fill:"currentColor",className:"text-gray-300 dark:text-gray-400"})]}),"Tidy",(0,a.jsx)("span",{className:"sr-only",children:", and focus editor"})]})]})]})}function A(e){var t=e.isActive,n=e.onClick,r=e.children;return(0,a.jsxs)("button",{type:"button",className:(0,b.Z)("relative flex py-3 text-sm leading-6 font-semibold focus:outline-none",{"text-sky-500":t,"text-gray-700 hover:text-gray-900 focus:text-gray-900 dark:text-gray-300 dark:hover:text-white":!t}),onClick:n,children:[(0,a.jsx)("span",{className:(0,b.Z)("absolute bottom-0 inset-x-0 bg-sky-500 h-0.5 rounded-full transition-opacity duration-150",{"opacity-0":!t})}),r]})}function W(e){var t=B(e);return t?"".concat(t.width,"x").concat(t.height):null}function B(e){if(!e)return null;if("string"===typeof e){var t=e.match(/^([0-9]+)x([0-9]+)$/);if(null===t)return!1;var n=parseInt(t[1],10),r=parseInt(t[2],10);return n>=50&&r>=50?{width:n,height:r}:null}return e.width>=50&&e.height>=50?e:null}function Z(e){var t=e.layout,n=e.responsiveSize,r=e.file,i={layout:["horizontal","preview"].includes(t)?t:void 0,size:W(n),file:["css","config"].includes(r)?r:void 0};return Object.keys(i).filter((function(e){return i[e]})).reduce((function(e,t,n){return 0===n?"?".concat(t,"=").concat(i[t]):"".concat(e,"&").concat(t,"=").concat(i[t])}),"")}var X=n(4155);function F(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Y(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){F(e,t,n[t])}))}return e}function q(e){return new Promise((function(t,n){fetch(X.env.TW_API_URL+"/api/playgrounds/"+e.ID,{headers:{Accept:"application/json"}}).then((function(e){if(!e.ok)throw e;return e.json()})).then((function(e){t({Item:Y({},e,{ID:e.uuid})})})).catch((function(e){n(e)}))}))}function G(e,t){var n=void 0===t?"3":t;return["1","2","3"].includes(e)?e:n}var K=n(9008),Q=n(8125);function U(e,t,n,r,i,a,o){try{var s=e[a](o),l=s.value}catch(N){return void n(N)}s.done?t(l):Promise.resolve(l).then(r,i)}function $(e){return function(){var t=this,n=arguments;return new Promise((function(r,i){var a=e.apply(t,n);function o(e){U(a,r,i,o,s,"next",e)}function s(e){U(a,r,i,o,s,"throw",e)}o(void 0)}))}}function J(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function ee(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},r=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(r=r.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),r.forEach((function(t){J(e,t,n[t])}))}return e}function te(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function ne(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],r=!0,i=!1,a=void 0;try{for(var o,s=e[Symbol.iterator]();!(r=(o=s.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(l){i=!0,a=l}finally{try{r||null==s.return||s.return()}finally{if(i)throw a}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var re={width:540,height:720};function ie(e){var t=e.initialContent,n=(e.initialPath,e.initialLayout),r=e.initialResponsiveSize,d=e.initialActiveTab,h=(0,o.useRef)(),f=(0,o.useRef)(),m=(0,o.useState)({percentage:.5,layout:n}),g=m[0],b=m[1],k=(0,o.useState)(!1),j=k[0],N=k[1],L=(0,o.useState)(d),z=L[0],E=L[1],O=(0,o.useState)("preview"===n?"preview":"editor"),T=O[0],D=O[1],P=(0,p.Z)("(min-width: 1024px)"),_=(0,o.useState)(!1),V=_[0],R=_[1],A=(0,o.useState)(!1),W=A[0],B=A[1],Z=ne(x(void 0,1e3),4),X=Z[0],F=Z[1],Y=Z[2],q=Z[3],U=(0,o.useRef)(),J=(0,o.useRef)(),te=(0,o.useState)(!!r),ie=te[0],ae=te[1],oe=(0,o.useState)(!0),se=oe[0],le=oe[1],ce=ne(x(!1,1e3),3),ue=ce[0],de=ce[1],he=ce[2],fe=(0,o.useState)(r||re),me=fe[0],ge=fe[1],ve=(0,o.useState)(G(t.version)),ye=ve[0],pe=ve[1],we=(0,o.useState)(!1),xe=we[0],be=we[1],ke=(0,o.useRef)(""),je=(0,o.useState)([]),Ce=je[0],Ne=je[1];(0,o.useEffect)((function(){R(!0)}),[z,g.layout,me.width,me.height,ie,ye]),(0,o.useEffect)((function(){if(V){var e=function(e){e.preventDefault(),e.returnValue=""};return window.addEventListener("beforeunload",e),function(){window.removeEventListener("beforeunload",e)}}}),[V]),(0,o.useEffect)((function(){R(!1),pe(G(t.version)),se&&h.current&&h.current.contentWindow&&(h.current.contentWindow.postMessage({clear:!0},"*"),Se({html:t.html}),Le({html:t.html,css:t.css,config:t.config,tailwindVersion:G(t.version)}))}),[t.ID]);var Me=(0,o.useCallback)((function(e,t){J.current.setValue((0,Q.Q)(e,Ce));var n=J.current.getModel();(null===t||void 0===t?void 0:t.forceTokenization)&&n.forceTokenization(n.getLineCount()),J.current.setScrollPosition({scrollTop:0})}),[Ce]),Se=(0,o.useCallback)((function(e,t){h.current.contentWindow.postMessage(e,"*"),e.css&&(ke.current=e.css),(null===t||void 0===t?void 0:t.updateCssOutput)&&e.css&&J.current&&Me(e.css,{forceTokenization:Boolean(null===t||void 0===t?void 0:t.jit)})}),[Me]);function Le(e){return ze.apply(this,arguments)}function ze(){return(ze=$(i().mark((function e(t){var n,r,a,o,s,l,u;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(!t.config){e.next=6;break}return e.next=3,w(t.config);case 3:if((n=e.sent).isValid){e.next=6;break}return e.abrupt("return",F(ee({},n.error,{file:"Config"})));case 6:return q(),de(!0),e.next=10,(0,c.L)(f.current,t);case 10:if(r=e.sent,a=r.css,o=r.html,s=r.jit,l=r.canceled,u=r.error,!l){e.next=18;break}return e.abrupt("return");case 18:if(he(!1),!u){e.next=22;break}return F(u),e.abrupt("return");case 22:Y(),be(Boolean(s)),(a||o)&&Se({css:a,html:o},{updateCssOutput:!t.transient,jit:Boolean(s)});case 25:case"end":return e.stop()}}),e)})))).apply(this,arguments)}(0,o.useEffect)((function(){J.current&&Me(ke.current,{forceTokenization:Boolean(xe)})}),[Ce]);var Ee=(0,o.useCallback)((0,u.debounce)(Le,200),[Se]),Oe=(0,o.useCallback)((function(e,t,n){R(!0),"html"!==e||xe?Ee({html:t.html,css:t.css,config:t.config,skipIntelliSense:"html"===e,tailwindVersion:ye,transient:null===n||void 0===n?void 0:n.transient}):Se({html:t.html},{jit:xe})}),[Se,Ee,xe,ye]);(0,o.useEffect)((function(){return f.current=new l,function(){f.current.terminate()}}),[]),(0,s.L)((function(){var e=function(){b((function(e){var t="horizontal"===e.layout?document.documentElement.clientHeight-59:document.documentElement.clientWidth;if(P&&"preview"!==e.layout){var n="vertical"===e.layout?320:360,r="vertical"===e.layout?t-n-1:t-320-1;return ee({},e,{min:n,max:r,current:Math.max(Math.min(Math.round(t*e.percentage),r),n)})}var i=P&&"preview"!==e.layout||!P&&"editor"===T?t:0;return ee({},e,{current:i,min:i,max:i})}))};return e(),window.addEventListener("resize",e),function(){window.removeEventListener("resize",e)}}),[P,b,g.layout,T]),(0,o.useEffect)((function(){P?"preview"!==g.layout&&B(!0):"editor"===T&&B(!0)}),[T,P,g.layout]),(0,o.useEffect)((function(){j?document.body.classList.add("vertical"===g.layout?"cursor-ew-resize":"cursor-ns-resize"):document.body.classList.remove("vertical"===g.layout?"cursor-ew-resize":"cursor-ns-resize")}),[j]);var Te=(0,o.useCallback)((function(e){b((function(t){var n="vertical"===t.layout?document.documentElement.clientWidth:document.documentElement.clientHeight-59,r=e/n;return ee({},t,{current:e,percentage:1===r||0===r?t.percentage:r})}))}),[]);(0,o.useCallback)((function(){R(!1)}),[]),(0,o.useCallback)((function(e){le(!1),S.default.push(e).then((function(){le(!0)}))}),[g.layout,ie,me]);return(0,o.useEffect)((function(){b((function(e){return ee({},e,{layout:n})}))}),[n]),(0,o.useEffect)((function(){ae(Boolean(r)),ge(r||re)}),[r]),(0,o.useEffect)((function(){E(d)}),[d]),(0,a.jsxs)(a.Fragment,{children:[(0,a.jsxs)(K.default,{children:[(0,a.jsx)("meta",{property:"og:url",content:"https://play.tailwindcss.com".concat(t.ID?"/".concat(t.ID):"")}),(0,a.jsx)("meta",{name:"twitter:card",content:t.ID?"summary":"summary_large_image"}),(0,a.jsx)("meta",{name:"twitter:image",content:t.ID?"https://play.tailwindcss.com/social-square.jpg":"https://play.tailwindcss.com/social-card.jpg"}),!t.ID&&(0,a.jsx)("meta",{property:"og:image",content:"https://play.tailwindcss.com/social-card.jpg"})]}),(0,a.jsx)(H,{layout:g.layout,onChangeLayout:function(e){return b((function(t){return ee({},t,{layout:e})}))},responsiveDesignMode:ie,onToggleResponsiveDesignMode:function(){return ae(!ie)},tailwindVersion:ye,onChangeTailwindVersion:function(e){pe(e),Le({_recompile:!0,tailwindVersion:e})}}),(0,a.jsx)("main",{className:"flex-auto relative border-t border-gray-200 dark:border-gray-800",children:t&&"undefined"!==typeof g.current?(0,a.jsxs)(a.Fragment,{children:[(!P||"preview"!==g.layout)&&(0,a.jsx)(I,{width:"vertical"===g.layout&&P?g.current:"100%",isLoading:ue,showPreviewTab:!P,activeTab:P||"editor"===T?z:"preview",onChange:function(e){"preview"===e?D("preview"):(D("editor"),E(e))},onTidy:function(){U.current.editor.trigger("","editor.action.formatDocument"),U.current.editor.focus()}}),(0,a.jsxs)(y.Z,{split:"horizontal"===g.layout?"horizontal":"vertical",minSize:g.min,maxSize:g.max,size:g.current,onChange:Te,paneStyle:{marginTop:-1},pane1Style:{display:"flex",flexDirection:"column"},onDragStarted:function(){return N(!0)},onDragFinished:function(){return N(!1)},allowResize:P&&"preview"!==g.layout,resizerClassName:P&&"preview"!==g.layout?"Resizer":"Resizer-collapsed",children:[(0,a.jsx)("div",{className:"flex flex-auto",children:W&&(0,a.jsx)(v,{editorRef:function(e){return U.current=e},cssOutputEditorRef:function(e){return J.current=e},initialCssOutput:ke.current,initialContent:t,onChange:Oe,worker:f,activeTab:z,tailwindVersion:ye,cssOutputFilter:Ce,onFilterCssOutput:Ne})}),(0,a.jsxs)("div",{className:"absolute inset-0 w-full h-full",children:[(0,a.jsx)(C,{ref:h,responsiveDesignMode:P&&ie,responsiveSize:me,onChangeResponsiveSize:ge,iframeClassName:j?"pointer-events-none":"",onLoad:function(){Se(ee({html:t.html},t.compiledCss?{css:t.compiledCss}:{})),Le({css:t.css,config:t.config,html:t.html,tailwindVersion:t.version})}}),(0,a.jsx)(M,{error:X})]})]})]}):null})]})}var ae=!0;function oe(e){var t=e.errorCode,n=te(e,["errorCode"]);return t?(0,a.jsx)(N.default,{statusCode:t}):(0,a.jsx)(ie,ee({},n))}function se(e){return le.apply(this,arguments)}function le(){return(le=$(i().mark((function e(t){var n,r,a,o,s,l;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=t.params,r=t.res,a=t.query,o={initialLayout:["vertical","horizontal","preview"].includes(a.layout)?a.layout:"vertical",initialResponsiveSize:B(a.size),initialActiveTab:["html","css","config"].includes(a.file)?a.file:"html"},console.log(n.slug),n.slug&&(1!==n.slug.length||"index"!==n.slug[0])){e.next=13;break}return r.setHeader("cache-control","public, max-age=0, must-revalidate, s-maxage=31536000"),e.t0=ee,e.next=8,getDefaultContent();case 8:return e.t1=e.sent,e.t2={initialContent:e.t1},e.t3=o,e.t4=(0,e.t0)(e.t2,e.t3),e.abrupt("return",{props:e.t4});case 13:if(1===n.slug.length){e.next=15;break}return e.abrupt("return",{props:{errorCode:404}});case 15:return e.prev=15,e.next=18,q({ID:n.slug[0]});case 18:return s=e.sent,l=s.Item,r.setHeader("cache-control","public, max-age=0, must-revalidate, s-maxage=31536000"),e.abrupt("return",{props:ee({initialContent:l,initialPath:"/".concat(l.ID).concat(Z({layout:a.layout,responsiveSize:a.size,file:a.file}))},o)});case 24:return e.prev=24,e.t5=e.catch(15),e.abrupt("return",{props:{errorCode:e.t5.status||500}});case 27:case"end":return e.stop()}}),e,null,[[15,24]])})))).apply(this,arguments)}},8125:function(e,t,n){"use strict";function r(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=[],r=!0,i=!1,a=void 0;try{for(var o,s=e[Symbol.iterator]();!(r=(o=s.next()).done)&&(n.push(o.value),!t||n.length!==t);r=!0);}catch(l){i=!0,a=l}finally{try{r||null==s.return||s.return()}finally{if(i)throw a}}return n}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function i(e,t){var n=e,i=/\s*\/\*\s*__play_start_(base|components|utilities)__\s*\*\/(.*?)\/\*\s*__play_end_\1__\s*\*\//gs;if(0===t.length)n=n.replace(i,(function(e,t,n){return n}));else{for(var a,o=[];null!==(a=i.exec(n));){var s=r(a,3),l=s[1],c=s[2];if(t.includes(l)){var u=c.trim();u&&o.push(u)}}n=o.join("\n\n")}return""!==(n=n.trim().replace(/\n{3,}/g,"\n\n")).trim()&&(n+="\n"),n}n.d(t,{Q:function(){return i}})},8873:function(e,t,n){"use strict";function r(){return document.querySelector("html").classList.contains("dark")?"dark":"light"}function i(e){var t=document.querySelector("html"),n=new MutationObserver((function(n){var r=!0,i=!1,a=void 0;try{for(var o,s=n[Symbol.iterator]();!(r=(o=s.next()).done);r=!0){var l=o.value;"attributes"===l.type&&"class"===l.attributeName&&(t.classList.contains("dark")?e("dark"):e("light"))}}catch(c){i=!0,a=c}finally{try{r||null==s.return||s.return()}finally{if(i)throw a}}}));return n.observe(t,{attributes:!0}),function(){n.disconnect()}}function a(){var e=document.querySelector("html");if(e.classList.add("disable-transitions"),e.classList.contains("dark")){e.classList.remove("dark");try{window.localStorage.setItem("theme","light")}catch(t){}}else{e.classList.add("dark");try{window.localStorage.setItem("theme","dark")}catch(t){}}window.setTimeout((function(){e.classList.remove("disable-transitions")}),0)}n.d(t,{gh:function(){return r},GT:function(){return i},X8:function(){return a}})},7498:function(e,t,n){"use strict";n.d(t,{L:function(){return a}});n(5860);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},i=Object.keys(n);"function"===typeof Object.getOwnPropertySymbols&&(i=i.concat(Object.getOwnPropertySymbols(n).filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable})))),i.forEach((function(t){r(e,t,n[t])}))}return e}function a(e,t){return new Promise((function(n){var r=Math.random().toString(36).substr(2,5);e.addEventListener("message",(function t(i){i.data._id===r&&(e.removeEventListener("message",t),n(i.data))})),e.postMessage(i({},t,{_id:r}))}))}}},function(e){e.O(0,[9774,2252,2888,179],(function(){return t=8581,e(e.s=t);var t}));var t=e.O();_N_E=t}]);