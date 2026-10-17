# Scrubby

A Chrome extension that adds a seek bar to Instagram Reels and videos, so you can jump to any part of the video.

Instagram's web player has no scrubber. Scrubby puts a slider and a time label (`0:12 / 1:14`) along the bottom of whichever video is on screen, and follows you as you scroll.

Not affiliated with or endorsed by Instagram or Meta.

## Install (from source)

1. Download or clone this repo.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and pick the repo folder.
4. Open or reload Instagram.

## How it works

`content.js` runs on `instagram.com`. Every animation frame it finds the `<video>` closest to the centre of the screen, positions a fixed slider over its bottom edge, and sets `video.currentTime` when you drag. It never reads Instagram's class names, which change often, and it collects no data. The extension requests no permissions.

## Package for the Chrome Web Store

```sh
tar -a -c -f scrubby.zip manifest.json content.js icon128.png
```

## License

MIT
