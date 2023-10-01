export default class TrelloController {
  constructor(trelloDOM) {
    this.trelloDOM = trelloDOM;
    this.cardCut = {};
    this.cardPaste = {};
    this.board = {
      done: [],
      progress: [],
      todo: [],
    };
  }

  init() {
    this.loadSave();
    this.renderingAndSave();

    this.trelloDOM.addBoardClickListeners(this.onBoardClick.bind(this));
    this.trelloDOM.addBoardDownListeners(this.onBoardDown.bind(this));
    this.trelloDOM.addMouseMoveListeners(this.onMouseMove.bind(this));
    this.trelloDOM.addMouseUpListeners(this.onMouseUp.bind(this));
  }

  loadSave() {
    const saveBoard = JSON.parse(localStorage.getItem('Trello'));
    if (saveBoard) { this.board = saveBoard; }
  }

  // клик по кнопкам на доске
  onBoardClick({ dataIdTarget, text, dataIdCardList }) {
    // открытие окна создания карточки
    if (dataIdTarget === 'creator-open') {
      this.trelloDOM.constructor.onBtnForOpenCard(this.trelloDOM.listContainer);
    }

    // закрытие окна создания карточки
    if (dataIdTarget === 'creator-close') {
      this.trelloDOM.constructor.onBtnForCloseCreator(this.trelloDOM.listContainer);
    }

    // создания карточки
    if (dataIdTarget === 'create-card' && text) {
      this.trelloDOM.constructor.onCreateCard(this.trelloDOM.listContainer);

      this.board[dataIdCardList].push(text);
      this.renderingAndSave([dataIdCardList]); // перерисовка DOM списка и сохранение
    }

    // удаление карточки
    if (dataIdTarget === 'card-del') {
      // находим индекс и текст карточки
      const { index, textEl } = this.trelloDOM.cardDraggedIndex();

      // если DOM элемент не совпадает с памятью, то список перерировывается по памяти
      if (this.board[dataIdCardList][index] !== textEl) {
        this.renderingAndSave();
        return;
      }

      this.board[dataIdCardList].splice(index, 1); // удаление элемента из массива
      this.renderingAndSave([dataIdCardList]); // перерисовка DOM списка и сохранение
    }
  }

  // зажатие карточки
  onBoardDown({ clientX, clientY }) {
    this.cardCut = this.trelloDOM.cardDraggedIndex(); // данный зажатой карточка для вырезания

    this.trelloDOM.position(clientX, clientY); // позиционируем копию зажатой карточки
    this.trelloDOM.dragged(true); // зажату карточку делаем похожую на тень
    this.trelloDOM.addMouseEventsDND(); // добавляем прослушиватели событий
  }

  // передвижение карточки мышкой
  onMouseMove({ clientX, clientY }) {
    this.trelloDOM.position(clientX, clientY); // позиционируем копию зажатой карточки
    let DND = false;

    // Координаты передвигаемого клона и карточки под ней
    this.dragged = this.trelloDOM.dragAndBotCardRect(clientY);

    if (!this.dragged) { return; } // отановка, если координатов нет

    // координаты передвигаемого клона и координаты карточки под клоном
    const { dragRect, cardBotRect, column } = this.dragged;

    // если вставка в пустой столбец не нужна, то стандартная обработка втавки
    if (!column) {
      // центр по вертикали карточки под клоном
      const cardBotCentrY = cardBotRect.top + cardBotRect.height / 2;

      // Координаты Х и Y, где Х и Y это центр клона передвигаемой карточки
      const dragCardCentrX = dragRect.left + dragRect.width / 2;
      const dragCardCentrY = dragRect.top + dragRect.height / 2;

      // истина, если Х клона находится внутри карточки по горизонтали
      const dragX = cardBotRect.right > dragCardCentrX && cardBotRect.left < dragCardCentrX;
      // истина, если Y клона внутри верхней половине карточки по вертикали
      const dragTopY = cardBotCentrY > dragCardCentrY && cardBotRect.top < dragCardCentrY;
      // истина, если Y клона внутри нижней половине карточки по вертикали
      const dragBotY = cardBotCentrY < dragCardCentrY && cardBotRect.bottom > dragCardCentrY;

      // вырезание и вставка карточки в DOM
      DND = this.trelloDOM.dragAndDropDOM({ dragX, dragTopY, dragBotY });
    }

    // если нужна вставка именно в путой столбец
    if (column) {
      // объект с подставными значениями
      const value = {
        dragX: false,
        dragTopY: false,
        dragBotY: false,
        column,
      };
      // вырезание и вставка карточки в DOM
      DND = this.trelloDOM.dragAndDropDOM(value);
    }

    if (!DND) { return; } // отановка, если не произошло вырезания и вставки

    this.cardPaste = this.trelloDOM.cardDraggedIndex(); // данные куда вставить зажатую карточку

    // удаление карточки из массива - вставка карточки в массив
    this.board[this.cardCut.listID].splice(this.cardCut.index, 1);
    this.board[this.cardPaste.listID].splice(this.cardPaste.index, 0, this.cardPaste.textEl);

    this.cardCut = this.cardPaste; // перезаписываем данные карточки для вырезания
  }

  // отжатие мышки
  onMouseUp() {
    this.trelloDOM.dragged(false); // убираем стили для передвигаемой карточки
    this.trelloDOM.delMouseEventsDND(); // удаляем обработчики
    this.renderingAndSave(); // перерисовка DOM списка и сохранение
  }

  // перерисовка DOM списка и сохранение
  renderingAndSave(value = ['todo', 'progress', 'done']) {
    this.trelloDOM.renderCardList(value, this.board); // перерисовка DOM списка

    localStorage.setItem('Trello', JSON.stringify(this.board)); // сохранение
  }
}
