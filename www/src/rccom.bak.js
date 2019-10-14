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
  
  <button id="myBtn">Send A Message to My Parent</button>
  <script>
    this.shadowRoot.getElementById("myBtn").addEventListener("click", (e)=>{
      console.log('added event listener')
    });
  </script>
    
  <div>
  <slot name="header"></slot>
  </div>
  
  <div> <img src="rc.jpeg" id="rcimage" width="50%" height="50%"/></div>
  <div id="box">
    <span slot="data_message" id="data_message"><img src="pawn.png" width="50%" height="50%">
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

    const loadPubnub = ()=> {
      var pubnub = new PubNub({publishKey: 'NA', subscribeKey: 'sub-c-55e637e0-584c-11e7-b679-0619f8945a4f'});
      pubnub.subscribe({channels: ['data']}); // Subscribe to a channel.
      pubnub.addListener({
        message: function (m) {
          console.log('Message Function:',m.message)
          var f = m.message.Functions;
          if (f.action === 'eval') {

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
