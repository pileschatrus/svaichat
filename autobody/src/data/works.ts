// Портфолио. Положите фото в public/works/ и добавьте запись:
// { title: "Покраска переднего бампера", car: "Kia Rio", service: "pokraska-bampera",
//   before: "/works/rio-before.jpg", after: "/works/rio-after.jpg" }
// Пока список пуст, на сайте показываются ссылки на Instagram с примерами работ.

export type Work = { title: string; car: string; service?: string; before: string; after: string; note?: string };

export const WORKS: Work[] = [];
