import { Router } from '@vaadin/router';
import { state } from '../state';

export class Home extends HTMLElement {
    connectedCallback(){
        const cs = state.getState();
        if(cs.rtdbRoomId && cs.userId){
            state.accessToRoom();
            Router.go("/chatroom");
        }
        this.render();
        const selection = this.querySelector(".selection") as any;
        selection.addEventListener("change", (e) => {
        const roomIdEl = document.getElementById("room-id__container") as any;
        const targetSel = e.target as any;
        if (targetSel.value == "new-room") {
            roomIdEl.style.display = "none";
        }

        if (targetSel.value == "existant-room") {
            roomIdEl.style.display = "flex";
        }
        });
        const form = this.querySelector(".form") as any;
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const target = e.target as any;
            // console.log(target.nombre.value);
            state.setEmailAndFullname(
                target["email-input"].value,
                target["name-input"].value
            );
            state.signIn((err) => {
                if(err) console.error("Hubo un error en el Sign In");

                if(target["room-id"].value){
                    state.setRoomId(target["room-id"].value);
                    state.accessToRoom();
                } else {
                    state.askNewRoom(() => {
                        state.accessToRoom();
                    })
                }
            })
            Router.go("/chat");
        });
    }
    render(){
        this.innerHTML = `
            <header class="header"></header>
            <div class="home-container"> 
                <h1 class="title">Bienvenidos</h1>
                <form class="form">
                    <div class="form-container">
                        <label>Tu Email</label>
                        <input type="email" name="email-input" class="email">
                    </div>
                    <div class="form-container">
                        <label>Tu nombre</label>
                        <input type="text" name="name-input" class="name">
                    </div>
                    <div class="form-container">
                        <label class="label-input">Room</label>
                        <select id="room-selection" form="form" class="selection">
                        <option value="new-room">Nuevo Room</option>
                        <option value="existant-room" selected>Room existente</option>
                        </select>
                    </div>
                    <div class="form-container" id="room-id__container">
                        <label class="label-input">Room Id</label>
                        <input  class="room-id" type="text" name="room-id"></input>
                    </div>
                    <div class="form-container" >
                        <button class="btn">Comenzar</button>
                    <div>
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

            .home-container {
                margin: 23px;
                display: flex;
                flex-direction: column;
                align-content: center;
                justify-content: center;
                align-items: center;
            }

            .title {
                margin-bottom: 26px;
            }
            
            .form-container {
                display: flex;
                flex-direction: column;
                align-content: center;
                justify-content: center;
            }

            label { 
                font-family: 'Roboto';
                font-style: normal;
                font-weight: 500;
                font-size: 24px;
                line-height: 28px;
                color: #000000;
            }

            .name, .email, .room-id, .selection {
                width: 308px;
                height: 55px;
                border: 2px solid #000000;
                border-radius: 4px;
                margin-bottom: 16px;
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

            // form > div:nth-child(2) {
            //     display: flex;
            //     align-items: center;
            //     justify-content: center;
            //     flex-direction: column;
            //     align-content: center;
            //     gap: 16px;
            // }

        `;
        this.appendChild(style);
    }
}

customElements.define("home-page", Home);