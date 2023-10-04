document.addEventListener('DOMContentLoaded', () => {
    const notifyAudio = new Audio("/notify.mp3");
    const chatAudio = new Audio("/chat.mp3");
    const socket = io("http://127.0.0.1:5000", {
        query: { name: localStorage.getItem("userName") }
    });

    const userList = document.getElementById('usersList');

    const updateOnlineUsers = (onlineUsers) => {
        userList.innerHTML = '';
        const modal = document.getElementById("myModal");
        const closeBtn = document.getElementsByClassName("close")[0];

        Object.keys(onlineUsers).forEach(user => {
            const Item = document.createElement('div');
            Item.innerHTML = `<a href="#" id="${user}"><img src="/images/user.png" alt="${onlineUsers[user]}"><span>${onlineUsers[user]}</span></a>`;
            Item.addEventListener("click", () => {
                document.getElementById("phead").innerText = `Private Chat - ${onlineUsers[user]}`;
                document.getElementById("pSocketId").value = user;
            });
            userList.appendChild(Item);

            const openModalLink = document.getElementById(user);
            openModalLink.onclick = () => {
                modal.style.display = "block";
            }
        });
        closeBtn.onclick = () => {
            modal.style.display = "none";
        }
        window.onclick = (event) => {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    socket.on('connected users', (users) => {
        console.log(users);
        notifyAudio.play();
        updateOnlineUsers(users);
    });

    document.getElementById("privateChatInputArea").addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("privateChatInput");
        if (input.value && input.value !== "") {
            const now = new Date();
            const msgTime = `${now.getHours()}:${now.getMinutes()}`;
            socket.emit('send private message', {
                targetSocketId: document.getElementById("pSocketId").value,
                message: input.value,
                time: msgTime
            });

            const newElement = document.createElement('div');
            newElement.classList.add('pmsg', 'pright-msg');
            newElement.innerHTML = `
            <div class="pmsg-img" style="background-image: url(https://image.flaticon.com/icons/svg/145/145867.svg)"></div>
            <div class="pmsg-bubble">
                <div class="pmsg-info">
                    <div class="pmsg-info-name">You</div>
                    <div class="pmsg-info-time">${msgTime}</div>
                </div>
                <div class="pmsg-text">${input.value}</div>
            </div>`;
            document.getElementById("privateChat").appendChild(newElement);
            input.value = '';
            newElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        }
    });

    socket.on('private message', (msgObj) => {
        chatAudio.play();
        const newElement = document.createElement('div');
        newElement.classList.add('pmsg', 'pleft-msg');
        newElement.innerHTML = `
        <div class="pmsg-img" style="background-image: url(https://image.flaticon.com/icons/svg/327/327779.svg)"></div>
            <div class="pmsg-bubble">
                <div class="pmsg-info">
                <div class="pmsg-info-name">${msgObj.user}</div>
                <div class="pmsg-info-time">${msgObj.time}</div>
            </div>
            <div class="pmsg-text">${msgObj.message}</div>
        </div>`;
        document.getElementById("privateChat").appendChild(newElement);
        newElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    });
});
