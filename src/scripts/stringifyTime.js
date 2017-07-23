export default function stringifyTime (t) {
  let min = parseInt(t / 60);
  let sec = t % 60;
  let minString = min.toString();
  let secString = sec.toString();
  if (min < 10) {
    minString = '0' + minString;
  }
  if (sec < 10) {
    secString = '0' + secString;
  }
  return minString + ':' + secString;
}