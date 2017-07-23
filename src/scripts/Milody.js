export default class Milody {
  constructor (DomAudio) {
    this.audioContext = null;
    this.audio = DomAudio;
    this.source = null;
    this.analyser = null;
  }
  init () {
    this._fixAPI();
    this._createCtx();
    this._getAudioSource();
  }
  _fixAPI () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
    window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) { window.setTimeout(callback, 1000 / 60); };
    window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
  }
  _createCtx () {
    try {
      this.audioContext = new window.AudioContext();
    } catch (e) {
      console.log('Your browser does not support Web Audio API!');
      console.log(e);
    }
  }
  _getAudioSource () {
    this.source = this.audioContext.createMediaElementSource(this.audio);
    this.source.loop = true;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.gain.value = 1;
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.source.connect(this.gainNode);
    this.gainNode.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }
  analyse () {
    let array = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(array);
    return array;
  }
}
