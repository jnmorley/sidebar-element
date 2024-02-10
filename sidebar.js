const htmlText = `
    <style>
        #container {
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 22rem;
            position: fixed;
            left: -22rem;
            top: 0;
            bottom: 0;
            transition-duration: var(--transition-duration, 0.3s);
            transition-property: left;     
        }

        ::slotted(*[slot="layer"]) {
            display: none;
            overflow-y: auto;
            flex: 1;
        }

        #footer {
            flex: 0 0 auto;
        }
    </style>
    <div id="container" part="container">
        <header id="header" part="header"><slot name="header"><div id="default-header"></div></slot></header>
        <slot id="layer" name="layer"></slot>
        <footer id="footer" part="footer"><slot name="footer"><div id="default-footer"></div></slot></footer>
    </div>
`;
const template = document.createElement("template");
template.innerHTML = htmlText;

export class sidebar extends HTMLElement {
    static get observedAttributes() {
        return ["layer", "side"];
    }

    constructor() {
        super()
        this.shadow = this.attachShadow({mode: "open"})
        this.shadow.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        if (this.layerVal === undefined) {
            this.updateSidebar(0);
        }
    }

    updateSidebar(newLayer) {
        const container = this.shadow.getElementById("container");
        if (newLayer !== 0) {
            const slotItems = this.shadow.getElementById("layer").assignedElements();
            if (this.layerVal) {
                slotItems[this.layerVal - 1].style.display = "none";
            }
            if (slotItems.length >= newLayer) {
                slotItems[newLayer - 1].style.display = "block";
                this.layerVal = newLayer
            }
            container.style.display = "flex";
            container.style.left = 0;
        } else {
            container.style.left = -container.offsetWidth + "px";
            container.style.display = "none";
        }
    }

    set layer(newValue) {
        this.setAttribute("layer", newValue);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "layer":
                this.updateSidebar(parseInt(newValue));
                break;
        }
    }
    
}
