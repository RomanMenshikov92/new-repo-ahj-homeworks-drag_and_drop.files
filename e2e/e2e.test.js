/* eslint-disable no-await-in-loop */
/* eslint-disable no-console */
// import puppeteer from 'puppeteer';
// import server from './e2e.server';

// jest.setTimeout(30000); // default puppeteer timeout

// describe('p2p test', () => {
//   const baseUrl = 'http://localhost:8888';

//   let browser = null;
//   let page = null;

//   beforeAll(async () => {
//     await server.start(); // запуск сервера

//     browser = await puppeteer.launch({
//       headless: false, // show gui
//       slowMo: 100, // скорость
//       devtools: false, // show devTools
//       args: ['--window-size=640,1080'],
//       defaultViewport: {
//         width: 640,
//         height: 1080,
//       },
//     });
//     page = await browser.newPage();
//   });

//   afterAll(async () => {
//     await browser.close(); // закрытие браузера
//     await server.stop(); // остановка сервера
//   });
// });
