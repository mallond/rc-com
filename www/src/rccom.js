const template = document.createElement('template');
template.innerHTML = `
  <style>
    div {
      padding: 8px;
      border: 1px solid #ccc;
      width: 150px;
    }
  </style>
  <div>  <img src="rc.jpeg" id="rcimage"/></div>

      
  <button></button>
  <div>This is a Div we want to inspect
    <slot></slot>
  </div>
  
`;


export class RCCOM extends HTMLElement {
  static get observedAttributes() {
    return ['title'];
  }

  get title() {
    return this._title;
  }

  set title(value) {
    this._title = value;
    this.buttonElement.innerText = this._title;
  }

  constructor() {
    super();
    this._title = 'rccom';
    this.show = false;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    this.buttonElement = this.shadowRoot.querySelector('button');
    this.buttonElement.innerText = this.title;
    this.buttonElement.addEventListener('click', () => this.toggle());

    this.contentElement = this.shadowRoot.querySelector('div');
    this.contentElement.style.display = 'none';
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === 'title' && this.buttonElement) {
      this.title = newValue;
    }
  }

  toggle() {
    this.show = !this.show;
    this.contentElement.style.display = this.show ? 'block' : 'none';
    this.dispatchEvent(new CustomEvent('show', { detail: this.show }));
  }


}

customElements.define('x-rccom', RCCOM);
