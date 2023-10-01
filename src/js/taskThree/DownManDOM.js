// import bookBase64 from './bookBase64';
require('../../css/TaskThree.css');

export default class DownManDOM {
  constructor() {
    this.container = null; // для контейнера в DOM
    this.filesClickListeners = [];
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
  async drawUI() {
    this.checkBinding();

    this.container.innerHTML = `
      <div class="cell">
        <H3 class="header">
          Задача № 3<br>
          Download Manager* (задача со звёздочкой)
        </H3>
        <div class="downloader-container">
          <div class="file-header">Доступные файлы (без смс и регистрации):</div>
          <div class="file-list">
            <!-- контейнеры с файлами -->
          </div>
        </div>
        <div class="file-size-text">Вы уже скачали: <span class="file-size-number">0</span></div>
      </div>
    `;

    this.container.classList.add('task-three');

    // элементы DOM
    this.fileList = this.container.querySelector('.file-list');
    this.fileSizeEl = this.container.querySelector('.file-size-number');

    this.fileList.addEventListener('click', (e) => this.onFilesClick(e));
  }

  // создание HTML для книги
  htmlFilecontainer(name, size, url) {
    const fileContainer = document.createElement('li');
    const fileName = document.createElement('div');
    const fileSize = document.createElement('div');
    const fileLink = document.createElement('a');

    fileContainer.classList.add('file-container');
    fileName.classList.add('file-name');
    fileSize.classList.add('file-size');
    fileLink.classList.add('file-link');
    fileLink.dataset.id = 'file-link';

    fileName.textContent = name;
    fileSize.textContent = size;
    fileLink.textContent = 'Download';
    fileLink.href = url;
    fileLink.rel = 'noopener';
    fileLink.download = name;

    fileContainer.appendChild(fileName);
    fileContainer.appendChild(fileSize);
    fileContainer.appendChild(fileLink);

    this.fileList.appendChild(fileContainer);
  }

  addFilesClickListeners(callback) {
    this.filesClickListeners.push(callback);
  }

  // клик по ссылкам
  onFilesClick(event) {
    this.link = event.target;

    if (!this.link.hasAttribute('data-id') || this.link.dataset.id !== 'file-link') { return; }

    this.filesClickListeners.forEach((o) => o.call(null, true));
  }

  // размер скачиваемого файла
  sizeFile() {
    const url = this.link.href;
    const file = new File([url], '');
    const reader = new FileReader();

    reader.readAsDataURL(file);

    const fileSize = file.size;

    if (!fileSize) { return 0; }

    return fileSize;
  }

  // изменение общего кол-ва скаченного объёма на странице
  sizeDownlodedDom(totalSize) {
    this.fileSizeEl.textContent = totalSize;
  }

  // eslint-disable-next-line class-methods-use-this
  async pdfToBase64(url) {
    const response = await fetch(url);

    if (!response.ok) { return false; }

    const file = await response.blob();

    const { size } = file;

    const urlBase64 = await new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.readAsDataURL(file);
    });

    return { size, urlBase64 };
  }

  // очистка галереи
  clearFiles() {
    this.fileList.innerHTML = '';
  }

  // очищаем container в DOM
  clearHTML() {
    this.container.classList.remove('task-three');
    this.container.innerHTML = '';
  }
}
