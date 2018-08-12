"use strict";

VHSify(document.getElementsByClassName('head-pic')[0]);

function VHSify(image) {
    if (!CSS.supports("mix-blend-mode", "screen") || !CSS.supports("filter", "url()")) {
        return;
    }
    var container = document.createElement("div");
    var images = RGBImages(image);

    images.forEach(function (image) {
        return container.appendChild(image);
    });
    container.classList.add("vhs-filter");

    image.replaceWith(container);
}

function RGBImages(image) {
    var colors = ["r", "g", "b"];
    var images = colors.map(function (color) {
        var img = image.cloneNode();
        img.classList.add("vhs-filter__" + color);
        return img;
    });

    return images;
}
