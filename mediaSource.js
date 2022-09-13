let mediaSource = new MediaSource();
let video = document.getElementById("my-video");
const mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

video.src = URL.createObjectURL(mediaSource);
mediaSource.addEventListener("sourceopen", sourceOpen);

function sourceOpen() {
  const sourceBuffer = mediaSource.addSourceBuffer(mimeCodec); //create new data buffer

  // play and end buffer
  sourceBuffer.addEventListener("updateend", () => {
    mediaSource.endOfStream();
    video.play();
  });

  let link = "https://example.com/my-video.mp4";

  fetch(link)
    .then((r) => r.body)
    .then((readableStream) => {
      const reader = readableStream.getReader();
      function readData({ done, value }) {
        let buf = value.buffer;

        //append data to buffer
        sourceBuffer.appendBuffer(buf);
        if (!done) reader.read().then(readData);
      }
      reader.read().then(readData);
    });
}
