import checkUrl from './checkUrl';

export default class GalleryControl {
  constructor(galleryDOM) {
    this.galleryDOM = galleryDOM; // класс который управляет DOM
    this.imgs = [
      {
        name: 'Фронтенд',
        fileUrl:
          'https://i.pinimg.com/originals/9e/91/61/9e91614e573ebbbefbfda1ae2a76dc6f.jpg',
      },
      {
        name: 'Бэкенд',
        fileUrl: 'http://static.uicit.uz/crop/1/7/736_736_90_1719082062.jpg',
      },
    ];
  }

  init() {
    this.galleryDOM.addDelImgListeners(this.onDelImg.bind(this));
    this.galleryDOM.addInputChangeListeners(this.onInputChange.bind(this));

    this.renderingTask(); // отрисовка картинок
  }

  // загрузка картинки в инпут
  onInputChange({ name, type, fileUrl }) {
    const imgTrue = checkUrl(type);

    if (!imgTrue) {
      return;
    }

    this.imgs.push({ name, fileUrl });
    this.renderingTask(); // отрисовка картинок
  }

  // удаление картинки
  onDelImg({ imgIndex, src, alt }) {
    const img = this.imgs[imgIndex];

    if (!img) {
      return;
    } // остановка, если под нет картинки под индексом

    // если название и ссылка совпадает, то удаляется картинка из объекта
    if (img.name === alt && img.fileUrl === src) {
      this.imgs.splice(imgIndex, 1);
    }

    this.renderingTask(); // отрисовка картинок
  }

  // отрисовка картинок
  renderingTask() {
    this.galleryDOM.clearImgs(); // очистка картинок

    const arr = this.imgs;
    for (let i = 0; i < arr.length; i += 1) {
      this.galleryDOM.htmlImg(arr[i].name, arr[i].fileUrl);
    }
  }
}
