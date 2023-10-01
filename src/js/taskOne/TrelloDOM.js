require('../../css/TaskOne.css');

export default class TrelloDOM {
  constructor() {
    this.container = null; // for container

    this.cardTextListeners = [];
    this.boardClickListeners = [];
    this.boardDownListeners = [];
    this.mouseMoveListeners = [];
    this.mouseUpListeners = [];

    this.mouseUp = this.onMouseUp.bind(this);
    this.mouseMove = this.onMouseMove.bind(this);
  }

  // присваиваем классу контейнер
  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  // проверка на наличие контейнера
  checkBinding() {
    if (this.container === null) {
      throw new Error('ListEditPlay not bind to DOM');
    }
  }

  addBoardClickListeners(callback) { this.boardClickListeners.push(callback); }

  addBoardDownListeners(callback) { this.boardDownListeners.push(callback); }

  addMouseMoveListeners(callback) { this.mouseMoveListeners.push(callback); }

  addMouseUpListeners(callback) { this.mouseUpListeners.push(callback); }

  // отрисовка HTML
  drawUI() {
    this.checkBinding();

    this.container.innerHTML = `
      <H3>
        Задача № 1<br>
        Trello - система управления задачами.
      </H3>
      <div class="board" data-id="board">
        <div class="list-container" data-id="todo" data-board="column">
          <div class="list-name">Сделать</div>
          <!-- список карточек -->
          <ul class="list-card" data-id="card-list"></ul>
          <div class="card-creator hide" data-id="creator-div">
            <div class="card-creator-text-container card">
              <textarea class="card-creator-text" data-id="creator-text" placeholder="Текст карточки"></textarea>
            </div>
            <div class="card-creator-controls">
              <div class="card-creator-add" data-id="create-card">Добавить карточку</div>
              <div class="card-creator-close" data-id="creator-close"></div>
            </div>
          </div>
          <div class="card-add-btn" data-id="creator-open">+ Добавить карточку</div>
        </div>
        
        <div class="list-container" data-id="progress" data-board="column">
          <div class="list-name">В процессе</div>
          <!-- список карточек -->
          <ul class="list-card" data-id="card-list"></ul>
          <div class="card-creator hide" data-id="creator-div">
            <div class="card-creator-text-container card">
              <textarea class="card-creator-text" data-id="creator-text" placeholder="Текст карточки"></textarea>
            </div>
            <div class="card-creator-controls">
              <div class="card-creator-add" data-id="create-card">Добавить карточку</div>
              <div class="card-creator-close" data-id="creator-close"></div>
            </div>
          </div>
          <div class="card-add-btn" data-id="creator-open">+ Добавить карточку</div>
        </div>

        <div class="list-container" data-id="done" data-board="column">
          <div class="list-name">Готово</div>
          <!-- список карточек -->
          <ul class="list-card" data-id="card-list"></ul>
          <div class="card-creator hide" data-id="creator-div">
            <div class="card-creator-text-container card">
              <textarea class="card-creator-text" data-id="creator-text" placeholder="Текст карточки"></textarea>
            </div>
            <div class="card-creator-controls">
              <div class="card-creator-add" data-id="create-card">Добавить карточку</div>
              <div class="card-creator-close" data-id="creator-close"></div>
            </div>
          </div>
          <div class="card-add-btn" data-id="creator-open">+ Добавить карточку</div>
        </div>
        
      </div>
      <div class="card card-drag hide"></div>
    `;

    this.container.classList.add('task-one');

    this.todo = this.container.querySelector('[data-id="todo"]');
    this.progress = this.container.querySelector('[data-id="progress"]');
    this.done = this.container.querySelector('[data-id="done"]');

    this.board = this.container.querySelector('[data-id="board"]');

    this.board.addEventListener('click', (event) => this.onBoardClick(event));
    // this.board.addEventListener('mousedown', (event) => this.onBoardDown(event));
    this.board.addEventListener('pointerdown', (event) => this.onBoardDown(event));

    this.cardDrag = this.container.querySelector('.card-drag');
  }

  // очищает container в DOM
  clearHTML() {
    this.container.classList.remove('task-one');
    this.container.innerHTML = '';
  }

  // HTML карточки
  static cardHtml(value, idCard = 'card') {
    const card = document.createElement('li');
    const cardText = document.createElement('div');
    const cardDel = document.createElement('div');

    cardText.textContent = value;
    cardText.classList.add('card-text');
    cardText.dataset.id = 'card-text';

    cardDel.classList.add('card-del');
    cardDel.dataset.id = 'card-del';

    card.classList.add('card');
    card.dataset.id = idCard;

    card.appendChild(cardText);
    card.appendChild(cardDel);

    return card;
  }

  // отрисовывает столбцы с карточками задач
  renderCardList(containerCard, cards) {
    for (let i = 0; i < containerCard.length; i += 1) {
      const cardList = document.createElement('div');
      const list = this[containerCard[i]].querySelector('[data-id="card-list"]');
      list.innerHTML = '';

      for (let j = 0; j < cards[containerCard[i]].length; j += 1) {
        cardList.appendChild(this.constructor.cardHtml(cards[containerCard[i]][j]));
      }

      list.innerHTML = cardList.innerHTML;
    }
  }

  // возвращает данные из переданного контейнера
  static containerElements(listContainer) {
    const creator = listContainer.querySelector('[data-id="creator-div"]');
    const btnOpen = listContainer.querySelector('[data-id="creator-open"]');

    return { creator, btnOpen };
  }

  // открывает окно добавления карточки
  static onBtnForOpenCard(listContainer) {
    const { creator, btnOpen } = TrelloDOM.containerElements(listContainer);
    creator.classList.remove('hide');
    btnOpen.classList.add('hide');
  }

  // закрывает окно добавления карточки
  static onBtnForCloseCreator(listContainer) {
    const { creator, btnOpen } = TrelloDOM.containerElements(listContainer);
    creator.classList.add('hide');
    btnOpen.classList.remove('hide');
  }

  // обрабатывает нужные классы во время содания карточки
  static onCreateCard(listContainer) {
    const { creator, btnOpen } = TrelloDOM.containerElements(listContainer);
    const text = creator.querySelector('[data-id="creator-text"]');
    text.value = '';
    creator.classList.add('hide');
    btnOpen.classList.remove('hide');
  }

  // обрабатывает клик по доске
  onBoardClick(event) {
    event.preventDefault();

    if (!this.listContainer) { return; } // остановка, если область клика шире контейнера

    const { dataIdTarget, dataIdCardList } = this;

    // проверка на то, является ли кликнутый элемент кнопкой
    const condition = dataIdTarget === 'card-del' || dataIdTarget === 'creator-open' || dataIdTarget === 'create-card' || dataIdTarget === 'creator-close';

    if (!condition) { return; } // останвка, если клик не по кнопкам

    // текст из поля создания карточки
    const text = this.listContainer.querySelector('[data-id="creator-text"]').value;

    this.boardClickListeners.forEach((o) => o.call(null, {
      dataIdTarget,
      text,
      dataIdCardList,
    }));
  }

  // зажатия мышки
  onBoardDown(event) {
    this.targetEl = event.target; // элемент по которому был клик
    this.listContainer = this.targetEl.closest('.list-container'); // активный контейнер

    if (!this.listContainer) { return; } // остановка, если область клика шире контейнера

    this.dataIdTarget = this.targetEl.dataset.id; // id кликнутого элемента
    this.dataIdCardList = this.listContainer.dataset.id; // id контейнера

    // если клик в целом по карточке, то записываем карточку в переменную
    if (this.dataIdTarget === 'card-text' || this.dataIdTarget === 'card-del') {
      this.card = this.targetEl.closest('.card'); // нажатая карточка
    }

    // остановка, если клик не по карточке в обалсти текста
    if (this.dataIdTarget !== 'card-text') { return; }
    event.preventDefault();

    // кординаты курсора на странице
    const { clientX, clientY } = event;

    // координаты курсора относительно карточки
    this.cursorX = clientX - this.card.getBoundingClientRect().left;
    this.cursorY = clientY - this.card.getBoundingClientRect().top;

    this.boardDownListeners.forEach((o) => o.call(null, { clientX, clientY }));
  }

  // находит индекс карточки и её значение
  cardDraggedIndex() {
    const { card } = this;
    if (!card) { return false; }

    const list = card.closest('[data-board="column"]');
    const cards = list.querySelectorAll('[data-id="card"]');
    const index = Array.from(cards).indexOf(card);

    const textEl = card.querySelector('[data-id="card-text"]').textContent;

    const listID = list.dataset.id;

    return { index, textEl, listID };
  }

  // работа с внешним и внутренним видом нажатой карточка
  dragged(condition) {
    if (condition) {
      this.card.classList.add('dragged'); // изменяем класс
      this.cardDrag.innerHTML = this.card.innerHTML; // заполняем html передвигаемой карточки
      this.cardDrag.classList.remove('hide'); // изменяем класс
    }

    if (!condition) {
      this.card.classList.remove('dragged'); // изменяем класс
      this.cardDrag.innerHTML = ''; // заполняем html передвигаемой карточки
      this.cardDrag.classList.add('hide'); // изменяем класс
    }
  }

  // вешает на страницу обработчики
  addMouseEventsDND() {
    // document.addEventListener('mouseup', this.mouseUp);
    // document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('pointerup', this.mouseUp);
    document.addEventListener('pointermove', this.mouseMove);
  }

  // удаляет со страницы обработчики
  delMouseEventsDND() {
    // document.removeEventListener('mousemove', this.mouseMove);
    // document.removeEventListener('mouseup', this.mouseUp);
    document.removeEventListener('pointermove', this.mouseMove);
    document.removeEventListener('pointerup', this.mouseUp);
  }

  // отжатие мышки
  onMouseUp(event) {
    event.preventDefault();
    this.mouseUpListeners.forEach((o) => o.call(null, ''));
  }

  // передвижение мышки
  onMouseMove(event) {
    event.preventDefault();
    const { clientX, clientY } = event;
    this.mouseMoveListeners.forEach((o) => o.call(null, { clientX, clientY }));
  }

  // Координаты передвигаемого клона и карточки под ней
  dragAndBotCardRect(clientY) {
    // координаты передвигаемого клона
    const dragRect = this.cardDrag.getBoundingClientRect();

    // Массив элементов. Где Y - это Y курсора, а Х - это середина карточки по горизонтали.
    // Массив содержит все элементы DOM под клоном передвигаемой карточки
    this.bottomEls = document.elementsFromPoint(dragRect.left + dragRect.width / 2, clientY);

    // поиск столбца под клоном передвигаемой карточки
    this.cardBotElColumn = this.bottomEls.find((el) => el.dataset.board === 'column');

    // поиск карточки под клоном передвигаемой карточки
    this.cardBotEl = this.bottomEls.find((el) => el.dataset.id === 'card');

    // если есть столбец, но нет карточки
    if (this.cardBotElColumn && !this.cardBotEl) {
      // поиск списка для вставки карточеки
      this.cardBotElList = this.cardBotElColumn.querySelector('[data-id="card-list"]');
      // поиск карточек в списке.
      const cards = this.cardBotElList.querySelectorAll('[data-id="card"]');

      // если в столбце нет карточек
      if (cards.length === 0) {
        // возврат объекта, где говорится, что нужна вставка в столбец
        return { dragRect: {}, cardBotRect: {}, column: true };
      }

      return false;
    }

    // если есть карточка под клоном
    if (this.cardBotEl) {
      // поиск оригинала под клоном передвигаемой карточки
      const dragged = this.cardBotEl.classList.contains('dragged');

      // остановка, если под клоном находится оригинал.
      if (dragged) { return false; }

      // координаты карточки под клоном передвигаемой карточки
      const cardBotRect = this.cardBotEl.getBoundingClientRect();

      return { dragRect, cardBotRect, column: false };
    }

    return false;
  }

  // вырезание и вставка карточки в DOM
  dragAndDropDOM(value) {
    // вставка карточки в пустой столбец
    if (value.column) {
      this.cardBotElList.appendChild(this.card);
      return true;
    }

    // вставка карточки ДО
    if (value.dragX && value.dragTopY) {
      if (this.cardBotEl.previousSibling !== this.card) {
        this.cardBotEl.before(this.card);
        return true;
      }
    }

    // вставка карточки ПОСЛЕ
    if (value.dragX && value.dragBotY) {
      if (this.cardBotEl.nextSibling !== this.card) {
        this.cardBotEl.after(this.card);
        return true;
      }
    }

    return false;
  }

  // позиционирует карточку при перемещении
  position(clientX, clientY) {
    // отнимает от кординат курсора относительно экрана, кординаты курсора относительно карточки
    const top = clientY - this.cursorY;
    const left = clientX - this.cursorX;

    this.cardDrag.style.top = `${top}px`;
    this.cardDrag.style.left = `${left}px`;
  }
}
