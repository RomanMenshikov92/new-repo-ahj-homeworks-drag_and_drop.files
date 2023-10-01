require('../../css/TaskTwo.css');

export default class GalleryDOM {
  constructor() {
    this.container = null; // для контейнера в DOM
    this.inputChangeListeners = [];
    this.delImgListeners = [];
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
      throw new Error('GalleryPlay not bind to DOM');
    }
  }

  // отрисовка HTML
  drawUI() {
    this.checkBinding();

    this.container.innerHTML = `
      <H3 class="gallery-header">
        Задача № 2<br>
        Modern Image Manager* (задача со звёздочкой)
      </H3>
      <div class="gallery-container">
        <form data-id="gallery-form" class="gallery-form">
          <div data-id="gallery-file" class="gallery-file-container">
            <input class="gallery-file-input" type="file" accept=".jpg, .jpeg, .png">
            <label class="gallery-file-label">Перетащите файлы сюда или нажмите, чтобы выбрать</label>
          </div>
        </form>
        <div class="gallery-header">Галерея фотографий</div>
        <div data-id="container-galery-img" class="container-galery-img">
        </div>
      </div>
    `;

    this.container.classList.add('task-two');

    // элементы DOM
    this.imgContainer = this.container.querySelector('[data-id=container-galery-img]');
    this.fileContainer = this.container.querySelector('[data-id=gallery-file]');
    this.fileInput = this.container.querySelector('.gallery-file-input');

    this.fileContainer.addEventListener('click', () => {
      this.fileInput.dispatchEvent(new MouseEvent('click'));
    });
    this.fileContainer.addEventListener('dragover', (e) => { e.preventDefault(); });
    this.fileContainer.addEventListener('drop', (e) => this.onInputChange(e));

    this.fileInput.addEventListener('change', (e) => this.onInputChange(e));
    this.imgContainer.addEventListener('click', (e) => this.onDelImg(e));
  }

  htmlImg(name, fileUrl) {
    const figure = document.createElement('figure'); // создаём див
    figure.innerHTML = `
      <img class="galery-img" src="${fileUrl}" alt="${name}">
      <figcaption>${name}</figcaption>
      <div data-id="img-del">X</div>
    `;
    figure.classList.add('gallery-figure');

    this.imgContainer.appendChild(figure);
  }

  addInputChangeListeners(callback) {
    this.inputChangeListeners.push(callback);
  }

  addDelImgListeners(callback) {
    this.delImgListeners.push(callback);
  }

  // загрузка картинки в инпут
  onInputChange(e) {
    e.preventDefault();

    let file = false;

    // проверка есть ли перетаскиваемый файл
    const fileDrop = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    // проверка есть ли выбранный файл
    const filePicked = this.fileInput.files && this.fileInput.files[0];

    // передаём файл который есть из выбранного или перетаскиваемого
    file = fileDrop || filePicked;

    if (!file) { return; } // остановка, если выбранного файла нет

    // создаём ссылку на файл в памяти браузера
    const fileUrl = URL.createObjectURL(file);
    const { name, type } = file; // имя и тип файла

    this.fileInput.value = ''; // очистка импута

    this.inputChangeListeners.forEach((o) => o.call(null, { name, type, fileUrl }));
  }

  // удаление картинки
  onDelImg(e) {
    e.preventDefault();

    if (e.target.dataset.id !== 'img-del') { return; }

    const figureEls = this.imgContainer.querySelectorAll('.gallery-figure');
    const figureEl = e.target.closest('.gallery-figure');

    const imgIndex = Array.from(figureEls).indexOf(figureEl);

    const imgEL = figureEl.querySelector('.galery-img');
    const { src, alt } = imgEL;

    this.delImgListeners.forEach((o) => o.call(null, { imgIndex, src, alt }));
  }

  // очистка галереи
  clearImgs() {
    this.imgContainer.innerHTML = '';
  }

  // очищаем container в DOM
  clearHTML() {
    this.container.classList.remove('task-two');
    this.container.innerHTML = '';
  }
}
