document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem("userName");
    const notifyAudio = new Audio("/notify.mp3");
    const chatAudio = new Audio("/chat.mp3");
    const socket = io("http://172.24.7.45:5000", {
        query: { name: userName }
    });


    document.getElementById("msger-inputarea").addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("msger-input");
        if (input.value) {
            const now = new Date();
            const msgTime = `${now.getHours()}:${now.getMinutes()}`;
            socket.emit('send room message', {
                user: userName,
                message: input.value,
                time: msgTime
            });

            const newElement = document.createElement('div');
            newElement.classList.add('msg', 'right-msg');
            newElement.innerHTML = `
            <div class="msg-img" style="background-image: url(https://image.flaticon.com/icons/svg/145/145867.svg)"></div>
            <div class="msg-bubble">
                <div class="msg-info">
                    <div class="msg-info-name">You</div>
                    <div class="msg-info-time">${msgTime}</div>
                </div>
                <div class="msg-text">${input.value}</div>
            </div>`;
            document.getElementById("msger-chat").appendChild(newElement);
            input.value = '';
            newElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }
    });

    socket.on('room message', (msgObj) => {
        chatAudio.play();
        const newElement = document.createElement('div');
        newElement.classList.add('msg', 'left-msg');
        newElement.innerHTML = `
        <div class="msg-img" style="background-image: url(https://image.flaticon.com/icons/svg/327/327779.svg)"></div>
            <div class="msg-bubble">
                <div class="msg-info">
                <div class="msg-info-name">${msgObj.user}</div>
                <div class="msg-info-time">${msgObj.time}</div>
            </div>
            <div class="msg-text">${msgObj.message}</div>
        </div>`;
        document.getElementById("msger-chat").appendChild(newElement);
        newElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    });

    socket.on('user joined room', (msg) => {
        notifyAudio.play();
        const newElement = document.createElement('div');
        newElement.classList.add('new-user');
        newElement.textContent = msg;
        document.getElementById("msger-chat").appendChild(newElement);
        newElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    });
});
