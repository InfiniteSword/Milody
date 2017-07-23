function showToast (message, bg) {
  const ctn = document.body;
  let toast = document.createElement('div');
  bg = bg || '#ff5252';
  toast.className = 'toast';
  toast.innerHTML = message;
  toast.style.background = bg;
  ctn.appendChild(toast);
  setTimeout(function () {
    toast.style.opacity = '.6';
    toast.style.top = '40px';
  }, 100);
  setTimeout(function () {
    toast.style.opacity = '0';
    toast.style.top = '0';
  }, 3000);
  setTimeout(function () {
    ctn.removeChild(toast);
  }, 4000);
}

export default showToast;
