// проверяет файл на заданный массив типов
export default function checkUrl(type) {
  const types = [
    'image/jpeg',
    'image/png',
  ];

  const img = types.includes(type, 0);

  return img;
}
