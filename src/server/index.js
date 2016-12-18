/*由於 Node 端要到新版對於 ES6 支援較好，所以先用 babel-register 在
src/server/index.js 去即時轉譯 server.js，但不建議在 production
環境使用。*/
require('babel-register');
require('./server');