
const IP = '134.175.179.95';
const queryWords = [
    [
        '五官扫描已就位...',
        '脸部定位开启中...',
        '照片检测中...',
        '五官定位中...'
    ],
    [
        'AI正在努力解码中...',
        '五官密码拼命解码中...',
        '脸部关键部位解码中...',
        '面部特征密码解码中...'
    ],
    [
        '你笑起来真像好天气',
        '你的眼睛好像让我迷了路',
        '喂，幺幺灵吗？这里有人持靓行凶',
        '你的眼睛真好看，里面有日月山川',
        '生得如此好看，一定是上帝的杰作',
        '天惹，你这么好看，AI已经被迷晕了',
        '哇喔，如此颜值爆表，不如C位出道',
        '哇喔，世间竟有如此出尘绝艳的容颜',
        '今日第一颜值担当，不接受反驳',
        '报告，AI已被高级脸迷倒，花痴中',
        '居然有如此精致的容颜安排!'
    ],
    [
        '正在生成你的爱情箴言',
        '正在解码你的爱情箴言',
    ],
    [
        '专属歌曲生成中...',
        '专属歌曲匹配中...',
        '个性歌曲解析中...',
        '个性歌曲解锁中...'
    ]
];
let error = false;


const upload = document.getElementById('input');
const uploadButton = document.getElementById('button');
let photo = null;
uploadButton.addEventListener('click', () => {
    upload.click();
});
upload.addEventListener('change', () => {
    if (upload.files.length > 0 && FileReader) {
        uploadAndGetInfo(upload.files[0]);

        const fr = new FileReader();
        fr.addEventListener('load', () => {
            Array.from(document.getElementsByClassName('head-pic'))
                .map(img => {
                    img.src = './img/b.png';
                    img.style.backgroundImage = `url("${fr.result}")`;
                });
            photo = fr.result;
        });
        fr.readAsDataURL(upload.files[0]);

        [
            document.getElementById('head'),
            document.getElementById('button'),
            document.getElementById('slogan'),
            document.getElementsByClassName('vhs-filter')[0]
        ].map(i => addClass(i, 'query'));
        setTimeout(() => {
            addClass(document.getElementById('text'), 'query');
            updateQueryWord();
        }, 1000);
    }
    input.value = null;
});


function uploadAndGetInfo(file) {
    error = false;
    const formData  = new FormData();
    formData.append('file', file);

    fetch(`http://${IP}/query`, {
        method: 'POST',
        body: formData,
        mode: "cors",
    })
        .then(res => res.json())
        .then(res => {
            const { song_path: path, gold_sentence: text, retcode } = res;
            if (retcode === 0) {
                const songPath = path.split('songs/')[1];
                const song = songPath.split('.')[0];
                const timer = setInterval(() => {
                    if (window.ready) {
                        clearInterval(timer);
                        showResult({ song, text, path: songPath });
                    }
                }, 500);
            } else {
                showError();
            }
        });
}


const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const text3 = document.getElementById('text3');
const text4 = document.getElementById('text4');
const text5 = document.getElementById('text5');
const texts = [text1, text2, text3, text4, text5];

function updateQueryWord(step=1) {
    if (error) return;
    if (step === 6) {
        window.ready = true;
        return;
    }
    texts.map(i => i.className = `step${step}`);
    const randomIndex = Math.ceil(Math.random() * queryWords[step - 1].length) - 1;
    texts[step - 1].innerText = queryWords[step - 1][Math.max(randomIndex, 0)];
    const timeout = 1000 + Math.random() * 2000;
    setTimeout(() => updateQueryWord(step + 1), timeout);
}


const audio = document.getElementById('song');
function showResult({song, text, path}) {
    [
        document.getElementById('root'),
        document.getElementById('result')
    ].map(i => addClass(i, 'result'));
    document.getElementById('result-text').innerText = text;
    document.getElementById('player-name').innerText = song;
    document.getElementById('result-img').style.backgroundImage = `url("${photo}")`;

    audio.setAttribute('src', `http://${IP}/play/${path}`);
    // audio.addEventListener('canplay', () => {
    //     audio.play();
    // }, false);

    html2canvas(document.getElementById('result')).then(function(canvas) {
        const dataUrl = canvas.toDataURL();
        const img = document.createElement('img');
        img.src = dataUrl;
        img.className = 'save';
        document.body.appendChild(img);
    });
}

function showError() {
    error = true;
    addClass(document.getElementById('error'), 'show');
    restart();
}

function restart() {
    texts.map(i => {
        i.className = '';
        i.innerText = '';
    });
    [
        document.getElementById('head'),
        document.getElementById('button'),
        document.getElementById('slogan'),
        document.getElementById('text'),
        document.getElementsByClassName('vhs-filter')[0]
    ].map(i => removeClass(i, 'query'));
    Array.from(document.getElementsByClassName('head-pic'))
        .map(img => {
            img.src = './img/head.png';
            img.style.backgroundImage = '';
        });
}

document.getElementById('close-error')
    .addEventListener('click', () => {
        document.getElementById('error').className = '';
    });
const btn = document.getElementById('play-btn');
btn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        btn.src = 'img/pause.svg';
    } else {
        audio.pause();
        btn.src = 'img/play.svg';
    }
});
