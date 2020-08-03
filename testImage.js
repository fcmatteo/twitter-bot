var Jimp = require('jimp');

const maxWidth = 325;
const maxHeight = 600;
const text = `The roman to viewings and employed for he merit a one then the attention same because considerable, of allows ran abandon with a economics, support of a starting of presented. Very in work, us, there own, the on it the so chance into expand some little phase. Client derivative a.`;
const avatarUrl =
  'https://pbs.twimg.com/profile_images/1228271279511363584/RaGyf2YG_400x400.jpg';
// open a file called "lenna.png"
(async function () {
  const img = await Jimp.read('cry.jpg');
  const avatar = await Jimp.read(avatarUrl.replace('normal', '200x200'));
  await avatar.resize(100, 100);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  await img.composite(avatar, 100, 75);
  await img.print(
    font,
    275,
    10,
    {
      text,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    maxWidth,
    maxHeight,
  );

  return img.write('arre.jpg');
})();
