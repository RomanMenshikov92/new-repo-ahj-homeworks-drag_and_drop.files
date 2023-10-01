/* eslint-disable no-console */
import HomeWorkMenu from './HomeWorkMenu';

const containerNav = document.getElementById('nav');
const containerTaskOne = document.getElementById('taskOne');
const containerTaskTwo = document.getElementById('taskTwo');
const containerTaskThree = document.getElementById('taskThree');

const homeWorkMenu = new HomeWorkMenu();

homeWorkMenu.bindToDOM(containerNav);
homeWorkMenu.bindTaskOneToDOM(containerTaskOne);
homeWorkMenu.bindTaskTwoToDOM(containerTaskTwo);
homeWorkMenu.bindTaskThreeToDOM(containerTaskThree);

homeWorkMenu.drawUI();

console.log('app started');
