export function initLinks() {
    const linksToggleButton = document.querySelector("#links-toggle");
    const linksGrid = document.querySelector(".js-links-grid");
    linksToggleButton.onclick = () => {
        if (linksGrid.hasAttribute("collapsed")) {
            linksGrid.removeAttribute("collapsed");
            linksGrid.setAttribute("expanded", true);
        } else {
            linksGrid.removeAttribute("expanded");
            linksGrid.setAttribute("collapsed", true);      
        }
    };
}