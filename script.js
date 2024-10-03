$(document).ready(function(){
    $('.carousel').slick({
        slidesToShow: 3, 
        slidesToScroll: 1, 
        autoplay: true, 
        autoplaySpeed: 12000, 
        dots: false,  
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                    arrows: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    arrows: true
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: true
                }
            }
        ]
    });
});

/* -- carrossel inhouse
window.onload = () => {
  // (adapted from https://stackoverflow.com/questions/13435604/getting-an-elements-inner-height)
  function getInnerSize(elm) {
    var computed = getComputedStyle(elm),
      paddingH =
        parseInt(computed.paddingRight) + parseInt(computed.paddingLeft),
      paddingV =
        parseInt(computed.paddingTop) + parseInt(computed.paddingBottom);

    return {
      width: elm.clientWidth - paddingH,
      height: elm.clientHeight - paddingV,
    };
  }

  // Limpar conteúdos e elencar imagens
  const carousel = document.getElementById("carousel");
  const images = Array.from(carousel.children);
  while (carousel.firstChild) carousel.firstChild.remove();

  // Criar canvas
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  carousel.appendChild(canvas);

  // Renderizador
  const margin = 5;
  const marginInner = 8;

  let camX = 0;

  function draw() {
    // update sizes
    const bounds = getInnerSize(carousel);
    canvas.width = bounds.width;
    canvas.height = bounds.height;
    canvas.style.width = bounds.width;
    canvas.style.height = bounds.height;

    const size = canvas.height - margin * 2;
    const maxImagePerWidth = Math.ceil(bounds.width / (size + marginInner)) + 1;
    const interval = size + marginInner;

    // draw images
    const drawFirst = -((camX % interval) + interval) % interval;
    const start = camX / interval;

    ctx.clearRect(0, 0, bounds.width, bounds.height);

    for (let i = 0; i < maxImagePerWidth; i++) {
      const which =
        ((Math.floor(start + i) % images.length) + images.length) %
        images.length;
      const image = images[which];
      const drawWidth =
          image.width > image.height
            ? size
            : (size * image.width) / image.height,
        drawHeight =
          image.width > image.height
            ? (size * image.height) / image.width
            : size;
      ctx.drawImage(
        images[which],
        drawFirst + i * interval + (size - drawWidth) / 2,
        margin + (size - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
    }
  }
  draw();

  function drawLoop() {
    if (camX != drawLoop.lastCamX) {
      draw();
      drawLoop.lastCamX = camX;
    }

    requestAnimationFrame(drawLoop);
  }
  drawLoop.lastCamX = camX;
  requestAnimationFrame(drawLoop);

  // Input & inércia
  let velX = 0;
  let lastTimestamp = 0;
  let dragging = false;
  let lastMouseX = null;
  let mouseX = 0;

  function inertia(timestamp) {
    let noTick = lastTimestamp == 0;
    let deltaTime = (timestamp - lastTimestamp) / 1000;
    deltaTime = Math.min(deltaTime, 1000);
    lastTimestamp = timestamp;
    requestAnimationFrame(inertia);

    if (noTick || deltaTime == 0) {
      return;
    }

    while (Math.abs(velX) > 3000) velX /= 1.5;
    camX += velX * deltaTime;
    velX -= velX * 2 * deltaTime;
    if (Math.abs(velX) < 2) {
      velX = 0;
    }

    // mouse input
    if (!dragging) {
      return;
    }

    if (lastMouseX == null) {
      lastMouseX = mouseX;
      return;
    }

    const deltaMouse = mouseX - lastMouseX;
    lastMouseX = mouseX;
    velX -= deltaMouse * deltaTime * 200;
  }

  function thrustCarousel(toward) {
    velX += toward;
  }

  document.getElementById("carousel-right").onclick = function () {
    thrustCarousel(1000);
  };
  document.getElementById("carousel-left").onclick = function () {
    thrustCarousel(-1000);
  };

  inertia(Date.now());
  requestAnimationFrame(inertia);

  carousel.ontouchstart = carousel.onmousedown = () => {
    if (!dragging) {
      while (zoomDiv.firstChild) zoomDiv.firstChild.remove();
    }
    dragging = true;
    lastMouseX = null;
  };
  carousel.ontouchend =
    carousel.ontouchcancel =
    carousel.onmouseup =
      () => (dragging = false);
  carousel.onmouseout = () => (dragging = false);

  function ondrag(e) {
    mouseX = e.offsetX;
  }
  const debugDiv = document.getElementById("debugDiv");

  carousel.onmousemove = ondrag;
  carousel.ontouchmove = (e) => {
    const { touches, changedTouches, targetTouches } = e.originalEvent ?? e;
    const touch =
      [touches[0], changedTouches[0], targetTouches[0]].find(
        (o) => o != null && o.offsetX != null,
      ) ?? {};
    debugDiv.innerHTML = "> " + Object.keys(touch).join(", ");
    if (touch.offsetX != null) {
      ondrag(touch);
    }
  };

  // Zoom
  const zoomDiv = document.getElementById("zoomDiv");
  let zoomedImage = null;
  function click(e) {
    if (dragging || Math.abs(velX) > 100) return;

    const size = canvas.height - margin * 2;
    const interval = size + marginInner;

    const rect = canvas.getBoundingClientRect();
    const cx = e.x - rect.left;
    const cy = e.y - rect.top;

    const gx = cx + camX;
    const within = ((gx % interval) + interval) % interval;
    if (within > size) return;
    const mapped = Math.floor(gx / interval);
    const which = ((mapped % images.length) + images.length) % images.length;
    const image = images[which];

    if (zoomedImage != null) {
      while (zoomDiv.firstChild) zoomDiv.firstChild.remove();
      const skip = zoomedImage === image;
      zoomedImage = null;
      if (skip) return;
    }

    const newImg = document.createElement("img");
    newImg.src = image.src;
    newImg.classList.toggle("carouselImage");
    setTimeout(() => newImg.classList.toggle("grow"), 5);
    zoomDiv.appendChild(newImg);
    zoomedImage = image;
  }

  carousel.onclick = click;
};
*/

let elementoAnterior = null;
let originalContent = document.getElementById("content").innerHTML;

function loadDefaultContent(element) {
  if (elementoAnterior) {
    elementoAnterior.style.borderBottom = "";
  }
  element.style.borderBottom = "2px solid";
  elementoAnterior = element;

  document.getElementById("content").innerHTML = originalContent;
}

function loadContent(url, element) {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      document.getElementById("content").innerHTML = xhr.responseText;

      if (elementoAnterior) {
        elementoAnterior.style.borderBottom = "";
      }

      document.getElementById("buttonMain").style.borderBottom = "";

      element.style.borderBottom = "2px solid";
      elementoAnterior = element;
    }
  };
  xhr.send();
}
