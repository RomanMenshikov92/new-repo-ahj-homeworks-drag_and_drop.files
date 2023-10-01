import TrelloDOM from './taskOne/TrelloDOM';
import TrelloController from './taskOne/TrelloController';
import GalleryDOM from './taskTwo/GalleryDOM';
import GalleryControl from './taskTwo/GalleryControl';
import DownManDOM from './taskThree/DownManDOM';
import DownManControl from './taskThree/DownManControl';

require('../css/HomeWorkMenu.css');

export default class HomeWorkMenu {
  constructor() {
    this.container = null; // для контейнера в DOM
    this.taskOneInited = false;
    this.taskTwoInited = false;
    this.taskThreeInited = false;
  }

  static checkContainer(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
  }

  // присваиваем классу контейнер
  bindToDOM(container) {
    HomeWorkMenu.checkContainer(container);
    this.container = container;
  }

  bindTaskOneToDOM(container) {
    HomeWorkMenu.checkContainer(container);
    this.containerTaskOne = container;
  }

  bindTaskTwoToDOM(container) {
    HomeWorkMenu.checkContainer(container);
    this.containerTaskTwo = container;
  }

  bindTaskThreeToDOM(container) {
    HomeWorkMenu.checkContainer(container);
    this.containerTaskThree = container;
  }

  // проверка на наличие контейнера
  checkBinding() {
    if (this.container === null) {
      throw new Error('... not bind to DOM');
    }
  }

  // отрисовка HTML
  drawUI() {
    this.checkBinding();
    this.container.innerHTML = `
      <div class="controls">
        <button data-id="taskOne" class="btn">Задача № 1</button>
        <button data-id="taskTwo" class="btn">Задача № 2</button>
        <button data-id="taskThree" class="btn">Задача № 3</button>
      </div>
    `;

    this.taskOne = this.container.querySelector('[data-id=taskOne]'); // элемент Задача № 1
    this.taskTwo = this.container.querySelector('[data-id=taskTwo]'); // элемент Задача № 2
    this.taskThree = this.container.querySelector('[data-id=taskThree]'); // элемент Задача № 3

    this.taskOne.addEventListener('click', (event) => this.onTaskOneClick(event));
    this.taskTwo.addEventListener('click', (event) => this.onTaskTwoClick(event));
    this.taskThree.addEventListener('click', (event) => this.onTaskThreeClick(event));
  }

  // клик Задача № 1
  onTaskOneClick(event) {
    event.preventDefault();

    this.taskRemover(); // удаление задач

    if (!this.taskOneInited) { this.taskOneInit(); } // инициализация Задачи № 1

    this.taskOneInited = !this.taskOneInited; // состояние задачи № 1
    this.taskTwoInited = false; // состояние задачи № 2
    this.taskThreeInited = false; // состояние задачи № 3
  }

  // клик Задача № 2
  onTaskTwoClick(event) {
    event.preventDefault();

    this.taskRemover(); // удаление задач

    if (!this.taskTwoInited) { this.taskTwoInit(); } // инициализация Задачи № 2

    this.taskOneInited = false; // состояние задачи № 1
    this.taskTwoInited = !this.taskTwoInited; // состояние задачи № 2
    this.taskThreeInited = false; // состояние задачи № 3
  }

  // клик Задача № 3
  onTaskThreeClick(event) {
    event.preventDefault();

    this.taskRemover(); // удаление задач

    if (!this.taskThreeInited) { this.taskThreeInit(); } // инициализация Задачи № 3

    this.taskOneInited = false; // состояние задачи № 1
    this.taskTwoInited = false; // состояние задачи № 2
    this.taskThreeInited = !this.taskThreeInited; // состояние задачи № 3
  }

  // удаляет все запущенные задачи
  taskRemover() {
    if (this.taskOneInited) { this.taskOneRemove(); } // удаление Задачи № 1
    if (this.taskTwoInited) { this.taskTwoRemove(); } // удаление Задачи № 2
    if (this.taskThreeInited) { this.taskThreeRemove(); } // удаление Задачи № 3
  }

  // создание Задачи № 1
  taskOneInit() {
    this.taskOneDOM = new TrelloDOM(); // создаём класс управления DOM
    this.taskOneDOM.bindToDOM(this.containerTaskOne); // присваеваем ему div taskOne из DOM
    this.taskOneDOM.drawUI(); // отрисовываем HTML в DOM

    this.taskOneController = new TrelloController(this.taskOneDOM); // создаём класс логики
    this.taskOneController.init(); // инициализируем класс логики
  }

  // создание Задачи № 2
  taskTwoInit() {
    this.taskTwoDOM = new GalleryDOM(); // создаём класс управления DOM
    this.taskTwoDOM.bindToDOM(this.containerTaskTwo); // присваеваем ему div taskTwo из DOM
    this.taskTwoDOM.drawUI(); // отрисовываем HTML в DOM

    this.taskTwoController = new GalleryControl(this.taskTwoDOM); // создаём класс логики
    this.taskTwoController.init(); // инициализируем класс логики
  }

  // создание Задачи № 3
  taskThreeInit() {
    this.taskThreeDOM = new DownManDOM(); // создаём класс управления DOM
    this.taskThreeDOM.bindToDOM(this.containerTaskThree); // присваеваем div taskThree из DOM
    this.taskThreeDOM.drawUI(); // отрисовываем HTML в DOM

    this.taskThreeController = new DownManControl(this.taskThreeDOM);
    this.taskThreeController.init(); // инициализируем класс логики
  }

  // удаление Задачи № 1
  taskOneRemove() {
    this.taskOneController.trelloDOM.clearHTML();
    this.taskOneDOM = '';
    this.taskOneController = '';
  }

  // удаление Задачи № 2
  taskTwoRemove() {
    this.taskTwoController.galleryDOM.clearHTML();
    this.taskTwoDOM = '';
    this.taskTwoController = '';
  }

  // удаление Задачи № 3
  taskThreeRemove() {
    this.taskThreeController.downManDOM.clearHTML();
    this.taskThreeDOM = '';
    this.taskThreeController = '';
  }
}
