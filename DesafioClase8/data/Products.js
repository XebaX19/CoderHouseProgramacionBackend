const products = [
  {
    id: 1,
    title: 'Escuadra',
    price: 323.45,
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/3/3c/Squadra_45.jpg'
  },
  {
    id: 2,
    title: 'Calculadora',
    price: 234.56,
    thumbnail: 'https://exitocol.vtexassets.com/arquivos/ids/257195/Calculadora-Cientifica-Graficadora.jpg'
  },
  {
    id: 3,
    title: 'Globo Terráqueo',
    price: 45.67,
    thumbnail: 'https://panamericana.vteximg.com.br/arquivos/ids/256800-600-690/globo-terraqueo-politico-40-cm-7701016736787.jpg?v=636381897120030000'
  },
  {
    id: 4,
    title: 'Paleta Pintura',
    price: 456.78,
    thumbnail: 'https://www.botiga.com.uy/media/catalog/product/cache/1/image/600x600/0dc2d03fe217f8c83829496872af24a0/p/a/paleta_pintora_tempera_infantozzi_materiales.jpg'
  },
  {
    id: 5,
    title: 'Reloj',
    price: 67.89,
    thumbnail: 'https://us.123rf.com/450wm/monticello/monticello1911/monticello191100379/135078958-reloj-de-pared-aislado-sobre-fondo-blanco-nueve-.jpg?ver=6'
  },
  {
    id: 6,
    title: 'Agenda',
    price: 78.90,
    thumbnail: 'https://cloudfront-eu-central-1.images.arcpublishing.com/prisa/AGYRBXKZQH6C4KYQU6IGD2BDIE.jpg'
  },
  {
    id: 7,
    title: 'Escudo caballero templario',
    price: 456.78,
    thumbnail: 'https://www.tienda-medieval.com/blog/wp-content/uploads/2010/09/escudo_templario1.jpg'
  },
  {
    id: 8,
    title: 'Escorpión de juguete',
    price: 1000.87,
    thumbnail: 'https://sc04.alicdn.com/kf/H5794a667d8844b0592a7a76e8724842bt.jpg'
  },
];

class Products {
  static lastProductId = products[products.length - 1].id;

  constructor() {
    this.list = products;
  }

  getAll() {
    return this.list;
  }

  getById(productoId) {
    return this.list.find(product => product.id === +productoId);
  }

  save(title, price, thumbnail) {
    if (!title || !price || !thumbnail) {
      return null;
    }

    Products.lastProductId++;
    const newProduct = {
      id: Products.lastProductId,
      title,
      price,
      thumbnail
    }

    this.list.push(newProduct);
    return newProduct;
  }

  update(producto, productoIndex) {
    if (!productoIndex) {
      return null;
    }

    const {title, price, thumbnail} = producto;
    
    if (!title || !price || !thumbnail) {
      return null;
    }

    this.list[productoIndex] = producto;

    return this.list[productoIndex];
  }

  delete(productoIndex) {
    if (productoIndex < 0) {
      return null;
    }

    this.list.splice(productoIndex, 1);

    return true;
  }
}

module.exports = Products