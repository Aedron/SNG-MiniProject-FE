
const IP = '134.175.179.95:80';
const queryWords = [
    [
        '五官扫描已就位...',
        '脸部定位开启中...',
        '照片检测中，请稍候~',
        '五官定位中，请稍候~'
    ],
    [
        '叮当叮当，小爱正在努力解码中...',
        '叮当叮当，颜值密码拼命解析中...',
        '叮当叮当，脸部关键部位解析中...',
        '叮当叮当，小爱正在解锁你的颜值密码...'
    ],
    [
        '你笑起来真像好天气',
        '你的眼睛好像让我迷了路',
    ],
    [
        '正在生成你的爱情箴言',
        '正在定位你的爱情命脉',
        '正在解码你的爱情星相',
        '正在解析你的爱情走势'
    ],
    [
        '专属歌曲匹配中...',
        '专属旋律等你pick...',
        '命运之歌正在赶来上...',
        '个性好歌等你开启...'
    ]
];


const upload = document.getElementById('input');
const uploadButton = document.getElementById('button');
uploadButton.addEventListener('click', () => {
    upload.click();
});
upload.addEventListener('change', () => {
    if (upload.files.length > 0 && FileReader) {
        uploadAndGetInfo(upload.files[0]);

        const fr = new FileReader();
        fr.addEventListener('load', () => {
            Array.from(document.getElementsByClassName('head-pic'))
                .map(img => { img.src = fr.result });
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
    const formData  = new FormData();
    formData.append('file', file);

    fetch(`http://${IP}/query`, {
        method: 'POST',
        body: formData,
        mode: "cors",
    }).then((res) => {
        console.log(res);
        const timer = setInterval(() => {
            if (window.ready) {
                clearInterval(timer);
                showResult();
            }
        }, 500);
    });
}


const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');
const text3 = document.getElementById('text3');
const text4 = document.getElementById('text4');
const text5 = document.getElementById('text5');
const texts = [text1, text2, text3, text4, text5];
function updateQueryWord(step=1) {
    if (step === 6) {
        window.ready = true;
        return;
    }
    texts.map(i => i.className = `step${step}`);
    const randomIndex = Math.ceil(Math.random() * queryWords[step - 1].length) - 1;
    texts[step - 1].innerText = queryWords[step - 1][Math.max(randomIndex, 0)];
    setTimeout(() => updateQueryWord(step + 1), 1000 + Math.random() * 2000 );
}


function showResult() {
    [
        document.getElementById('head'),
        document.getElementById('button'),
        document.getElementById('slogan'),
        document.getElementById('text'),
        document.getElementsByClassName('vhs-filter')[0]
    ].map(i => {
        removeClass(i, 'query');
        addClass(i, 'result');
    });
}