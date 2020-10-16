const socket = io();

const txt = document.getElementById('txt_message');
const container = document.getElementById('container');
const ac = document.getElementById('active_users');

var audio = new Audio('audio.mp3');

const user = prompt("Enter Your Name");
socket.emit('new-user-join', user);
txt.focus();

const update_list = (active_users) => {
    ac.innerHTML = active_users;
}

const append = (sender, message, position) => {
    messageElement = document.createElement('div');
    messageElement.className = 'row pl-2 pr-2 mt-3 mb-3';
    messageInnerElement = document.createElement('div');
    if (sender != '') {
        spanElement = document.createElement('span');
        spanElement.className = 'text-secondary';
        spanElement.append(sender);
        messageInnerElement.append(spanElement);
        messageInnerElement.append(document.createElement('br'));
    }
    messageInnerElement.append(message);
    if (position == 'left') {
        audio.play();
        messageInnerElement.className = 'col-8 border rounded pt-3 pb-3';
    } else {
        messageInnerElement.className = 'col-8 offset-4 border rounded pt-3 pb-3';
    }
    messageElement.append(messageInnerElement);
    container.append(messageElement);
};

const bottom = () => {
    container.scrollTop = container.scrollHeight;
};

txt.onkeyup = (event) => {
    if (event.keyCode === 13) {
        document.getElementById('btn_send').click();
    }
};

document.getElementById('btn_send').onclick = () => {
    if (txt.value != '') {
        var ms = txt.value;
        socket.emit('send', ms);
        append('You :', ms, '');
        txt.value = '';
        bottom();
    }
    txt.focus();
};

socket.on('user-joined', newuser => {
    append('', newuser + ' Joined the Chat', 'left');
    bottom();
    socket.emit('get_users', '');
});

socket.on('receive', data => {
    append(data.user + " :", data.message, 'left');
    bottom();
});

socket.on('left', data => {
    append('', data.user + ' Left From Chat', 'left');
    bottom();
});

socket.on('recevied_active_users', user_list => {
    ac.innerHTML = user_list;
});