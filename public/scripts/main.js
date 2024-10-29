const keyAttributeSection = document.querySelector("#keyAttributeSection");
const trazHighlights = document.querySelector("#trazHighlights");
const trazServices = document.querySelector("#trazServices");
const whoText = document.querySelector("#whoText");
const whoImage = document.querySelector("#whoImage");
const trazProfile = document.querySelector("#trazProfile");
const footerCard = document.querySelector("#footerCard");
const allLeft = document.querySelectorAll(".left");
const allRight = document.querySelectorAll(".right");

const heroVideo = document.getElementById("heroVideo");
if (heroVideo) {
    heroVideo.addEventListener("loadeddata", function () {
        const heroTexts = document.querySelectorAll(".heroText");
        heroTexts.forEach(function (heroText) {
            heroText.classList.remove("hide");
            heroText.classList.add("visible");
        });
    });
}

function observeElement(element, threshold, classesToAdd) {
    if (element) {
        const options = { threshold: threshold };

        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.remove("hide");
                    classesToAdd.forEach((className) => entry.target.classList.add(className));
                    observerInstance.unobserve(entry.target);
                }
            });
        }, options);

        observer.observe(element);
    }
}

observeElement(keyAttributeSection, 1, ["animate__animated", "animate__fadeInUp"]);
observeElement(trazHighlights, 0.6, ["animate__animated", "animate__fadeInUp"]);
observeElement(trazServices, 0.2, ["animate__animated", "animate__fadeInUp"]);
observeElement(whoImage, 0.7, ["animate__animated", "animate__fadeInBottomRight"]);
observeElement(whoText, 0.7, ["animate__animated", "animate__fadeInBottomLeft"]);
observeElement(trazProfile, 0.8, ["animate__animated", "animate__fadeInUp"]);
observeElement(footerCard, 0.9, ["animate__animated", "animate__slideInUp"]);
allLeft.forEach((element) => {
    observeElement(element, 0.8, ["animate__animated", "animate__fadeInBottomLeft"]);
});
allRight.forEach((element) => {
    observeElement(element, 0.8, ["animate__animated", "animate__fadeInBottomRight"]);
});
