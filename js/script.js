function initGalleries() {
    const loadEvent = new Event("loadImage");
    let date = Date.now();

    function throttle(cb, time) {
        const currentDate = Date.now();
        if ((currentDate - date) > time) {
            cb();
            date = currentDate;
        }
    }

    function scrollHandler(e, state, node, n) {
        return function () {
            if (state.preX === 0) {
                state.preX = e.x;
            } else if (!!e.x) {

                if (node.scrollWidth < (node.scrollLeft + 1300)) {
                    n.dispatchEvent(loadEvent)
                }

                node.scrollLeft = (node.scrollLeft + (state.preX - e.x) * 25);
            }
        }
    }

    const scrollToClosestImage = (node, imgWidth) => {
        const left = Math.round(node.scrollLeft / imgWidth);
        console.log(left, left * imgWidth, imgWidth);
        node.scrollTo({
            left: left * imgWidth,
            behavior: "smooth",
        });
    }

    function onScroll(node, n) {
        let state = {preX: 0 };
        let timeOut;
        const imgWidth = node.querySelector('img').offsetWidth * 2;
        console.log(imgWidth);
        node.addEventListener('drag', e => {
            clearTimeout(timeOut);
            timeOut = setTimeout(_ => scrollToClosestImage(node, imgWidth), 100);
            throttle(scrollHandler(e, state, node, n), 10);
            state.preX = e.x;
        });
    }

    function addImages(event) {
        const node = event.target;
        const currentCount = node.children.length;

        if (!node.dataset.imgCount) {
            return;
        }

        const pattern = node.dataset.pattern;
        const imgCount = Math.min(node.dataset.imgCount - currentCount, 2);

        if (imgCount <= 0) {
            return;
        }

        Array(imgCount).fill(currentCount).forEach((v,i) => {
            const img = document.createElement('img');
            img.src = pattern.replace('{v}', `(${v + i + 1})`);
            img.className = 'w100';
            node.appendChild(img);
        });
    }

    function init() {
        const images = document.querySelectorAll('.child-portrait__block');
        images.forEach(n => {
            n.addEventListener('loadImage', e => addImages(e));
            n.dispatchEvent(loadEvent);
            onScroll(n.parentElement, n);
        });
    }


    init();

}


function addMessageListener() {
    let currentReq = null;
    const button = document.querySelector('#message-form button');
    const textarea = document.querySelector('#message-form textarea');
    const label = document.querySelector('#message-form label');

    button
        .addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentReq) {
                currentReq = fetch('/api/message', { body: {}, method: 'POST' });
                currentReq.finally(() => currentReq = null);
            }
        });

    textarea
        .addEventListener('input', (e) =>
            label.innerHTML = textarea.value.length + '/300 символов'
        );

}

initGalleries();
addMessageListener();
