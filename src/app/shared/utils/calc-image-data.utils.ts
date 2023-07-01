export function calcImageData(containerWidth: number, containerHeight: number, image: any, rand: boolean): any {
  const cofWidth = containerWidth < image.width ? (image.width / containerWidth) * 2 : 1;
  const cofHeight = containerHeight < image.height ? (image.height / containerHeight) * 2 : 1;
  const cof = cofWidth > cofHeight ? cofWidth : cofHeight;
  let randPositionX = (containerWidth / 2) - ((image.width / cof) / 2);
  let randPositionY = (containerHeight / 2) - ((image.height / cof) / 2);
  const newWidth = image.width / cof;
  const newHeight = image.height / cof;
  if (rand) {
    randPositionX = randPositionX + getRandom(-300, 300) || 0;
    randPositionY = randPositionY + getRandom(-300, 300) || 0;
    // tslint:disable-next-line:max-line-length
    randPositionX = randPositionX + newWidth > containerWidth ? randPositionX - (randPositionX + newWidth - containerWidth) - 1 : randPositionX;
    // tslint:disable-next-line:max-line-length
    randPositionY = randPositionY + newHeight > containerHeight ? randPositionY - (randPositionY + newHeight - containerHeight) - 1 : randPositionY;
    randPositionX = randPositionX > 0 ? randPositionX : 0;
    randPositionY = randPositionY > 0 ? randPositionY : 0;
  }
  return  {
    itemWidth: Math.floor(newWidth),
    itemHeight: Math.floor(newHeight),
    itemPositionX: Math.floor(randPositionX),
    itemPositionY: Math.floor(randPositionY),
  };
}

const getRandom = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

