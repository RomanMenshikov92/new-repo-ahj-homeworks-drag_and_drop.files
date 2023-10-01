import bookStorageStandard from '../../files/Storage Standard.pdf';
import bookStreamsStandard from '../../files/Streams Standard.pdf';
import bookXMLHttpRequestStandard from '../../files/XMLHttpRequest Standard.pdf';

export default class DownManControl {
  constructor(downManDOM) {
    this.downManDOM = downManDOM; // класс который управляет DOM
    this.totalSize = 0;

    this.books = [
      {
        name: 'Storage Standard',
        size: '',
        url: bookStorageStandard,
      },
      {
        name: 'Streams Standard',
        size: '',
        url: bookStreamsStandard,
      },
      {
        name: 'XMLHttpRequest Standard',
        size: '',
        url: bookXMLHttpRequestStandard,
      },
    ];
  }

  async init() {
    this.downManDOM.addFilesClickListeners(this.onFilesClick.bind(this));

    await this.chengeUrl(); // замена URL на Data URL
    this.renderingFiles(); // отрисовка списка файлов
  }

  // замена обычного URL на Data URL
  async chengeUrl() {
    // цикл по массиву книг
    for (let i = 0; i < this.books.length; i += 1) {
      const { url } = this.books[i];
      if (!url) { return; }

      // eslint-disable-next-line no-await-in-loop
      const dataUrl = await this.downManDOM.pdfToBase64(url);
      if (!dataUrl) { return; }

      const { size, urlBase64 } = dataUrl;

      this.books[i].size = DownManControl.size(size); // размер книги
      this.books[i].url = urlBase64; // Data URL
    }
  }

  // обработка клика по ссылке
  onFilesClick(condition) {
    if (!condition) { return; }

    const sizeFile = this.downManDOM.sizeFile(); // размер файла
    this.totalSize += sizeFile; // складываем размер файла с предыдущими

    // преобразуем размер в читаемый вид
    const totalSizeDom = DownManControl.size(this.totalSize);

    // вставляем размер в дом
    this.downManDOM.sizeDownlodedDom(totalSizeDom);
  }

  // отрисовка списка файлов
  renderingFiles() {
    this.downManDOM.clearFiles(); // очистка списка файлов

    const arr = this.books;
    for (let i = 0; i < arr.length; i += 1) {
      this.downManDOM.htmlFilecontainer(arr[i].name, arr[i].size, arr[i].url);
    }
  }

  // преобразовывает размер в КБ или МБ
  static size(value) {
    if (!value) { return false; }

    const Kb = value / 1024;
    const Mb = Kb / 1024;

    if (Mb < 1 && Kb > 0) {
      return `${(Kb).toFixed(0)} Kb`;
    }

    if (Mb > 1) {
      return `${(Mb).toFixed(2)} Mb`;
    }

    return false;
  }
}
