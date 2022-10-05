import { state } from "../state";

type Message = {
    fullName: string,
    message: string
}
export class ChatPage extends HTMLElement {
    fullName: String;
    message: String;
    room:String;
    connectedCallback() {
        state.subscribe(() => {
            const currentState = state.getState();
            this.messages = currentState.messages;
            this.room = currentState.roomId;
            this.render();
        })
        this.render();
    }
    messages:Message[] = [];
    addListeners() {
        const form = this.querySelector(".submit-message") as any;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const target = e.target as any;
            const message = target["new-message"].value;
            state.setMessage(message);
            state.pushMessage(message);
        });
        const messagesContainer = this.querySelector(".messages") as any;
        function scrollToBottom() {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
          
        scrollToBottom();
    }
    render() {

        const currentState = state.getState();
        this.messages = currentState.messages;

        this.innerHTML = `
            <header class="header"></header>
            <div>
                <h1 class="title">Chat</h1>
                <h2 class="room-id">Room: ${this.room}</h2>
                <div class="messages">
                    ${this.messages.map( m => {
                        return `
                        <label class="message-label">${m.fullName === currentState.fullName? "":m.fullName}</label>
                        <div class= "${
                          m.fullName === currentState.fullName ? "mensajes-sent" : "mensajes-received"
                        }">${m.message}</div>`;
                      }).join("")}
                </div>
                <form class="submit-message">
                    <input type="text" name="new-message" class="new-message">
                    <button class="btn">Enviar</button>
                </form>
            </div>
        `;

        const style = document.createElement("style");
        style.innerHTML = `
        * {
            margin: 0;
            padding: 0;
        }
        .header {
            width: 100%;
            height: 10vh;
            background-color: #FF8282;
        }

        .title {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 700;
            font-size: 52px;
            line-height: 61px;
            margin: 23px;
        }

        .messages {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-content: center;
            margin: 0 24px 12px 24px;
            gap: 12px;
        }

        .submit-message {
            display: flex;
            align-items: center;
            justify-content: center;
            align-content: center;
            flex-direction: column;
            gap: 16px;
        }

        .new-message {
            width: 304px;
            height: 55px;
            border: 2px solid #000000;
            border-radius: 4px;
        }


        .btn  {
            width: 312px;
            height: 55px;
            background-color: #9CBBE9;
            border-radius: 4px;
            border: none;
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 500;
            font-size: 22px;
            line-height: 26px;
            text-align: center;
            color: #000000;
        }

        .mensajes-sent {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #B9E97C;
            border-radius: 4px;
            height: 52px;
            width: 50%;
            margin-left: 50%;
        }

        .mensajes-received {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #D8D8D8;
            border-radius: 4px;
            width: 50%;
            height: 52px;
        }

        .message-label {
            font-family: 'Roboto';
            font-style: normal;
            font-weight: 400;
            font-size: 14px;
            line-height: 16px;
            color: #A5A5A5;
        }

        .none {
            display: none;
        }

        .room-id {
            margin: 23px;
        }

        `;

        this.appendChild(style);

        this.addListeners();
    }
}

customElements.define("chat-page", ChatPage);