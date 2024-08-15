/*$(document).ready(function(){
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
});*/

let elementoAnterior = null;
let originalContent = document.getElementById('content').innerHTML;

function loadDefaultContent(element) {
    if (elementoAnterior) {
        elementoAnterior.style.borderBottom = "";
    }
    element.style.borderBottom = "2px solid";
    elementoAnterior = element;

    document.getElementById('content').innerHTML = originalContent;
}

function loadContent(url, element) {
    const xhr = new XMLHttpRequest();
    
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            document.getElementById('content').innerHTML = xhr.responseText;

            if (elementoAnterior) {
                elementoAnterior.style.borderBottom = "";
            }

            document.getElementById('buttonMain').style.borderBottom = "";

            element.style.borderBottom = "2px solid";
            elementoAnterior = element;
        }
    };
    xhr.send();
}

