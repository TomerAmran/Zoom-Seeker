const initFadeout = (div)=> {
    let newdiv = div.cloneNode(true)
    newdiv.classList.add('fade-out')
    div.parentNode.replaceChild(newdiv,div)
    return newdiv;
}
let div = document.createElement("div");
div.style.backgroundColor ='grey';
div.style.zIndex = '10'
div.style.width = '8%';
div.style.height = '8%';
div.style.borderRadius = '10px'
div.style.position = 'relative'
div.style.opacity = '0'
div.style.fontFamily = `'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif`
div.style.color = 'white'
div.style.fontSize = '300%'
div.style.display = 'flex'
div.style.justifyContent ='center'
div.style.alignItems = 'center'


window.addEventListener('load', () => {
    //test 

    //unfocus on load
    if(document.activeElement.toString() == '[object HTMLButtonElement]') 
        document.activeElement.blur();
    // unfocus buttons after clicking
    document.addEventListener('click', function(e) { if(document.activeElement.toString() == '[object HTMLButtonElement]'){ document.activeElement.blur(); } })
    let video = document.getElementsByTagName('video')[0]
    video.parentNode.style.display = 'flex'
    video.parentNode.style.justifyContent ='center'
    video.parentNode.style.alignItems = 'center'
    let buttons = document.getElementsByTagName('button')
    let play = document.getElementsByClassName('vjs-play-control')[0]
    video.parentNode.insertBefore(div,video.parentNode.firstChild);

    //put location of video
    // let url = location.href;
    chrome.storage.sync.get('urlmap', 
        (res)=>{
        let urlmap = res.urlmap;    
        if (urlmap === undefined) {
            let map = new Map();
            console.log(map);
            chrome.storage.sync.set({urlmap: map});
        }
        else{
            console.log(res);
            let time = urlmap.get(location.href);
            if (time !== undefined){
                let video = document.getElementsByTagName('video')[0];
                video.currentTime = time;
            }
        }
        let save = ()=>{
            console.log('save time');
            urlmap.set(location.href,time);
            chrome.storage.sync.set({urlmap: urlmap});
            setTimeout(save,6000);
        }
        setTimeout(save,6000)
    }
    );



    foo = ()=> {
        console.log('hey')
        let url = location.href;
        let video = document.getElementsByTagName('video')[0];
        chrome.storage.sync.set({url: video.currentTime});
        setTimeout(foo,6000);
    }

    setTimeout(foo,6000)




    document.getElementsByTagName('body')[0].addEventListener('keydown', (ev)=> 
    {
        //left arrow seeker -10s
        if (ev.keyCode === 37) {
            div.innerHTML = '-10s'
            div = initFadeout(div)
            video.currentTime = video.currentTime - 10
        }
        //right arrow seeker +10s
        if (ev.keyCode === 39) {
            div.innerHTML = '+10s'
            div = initFadeout(div)
            video.currentTime = video.currentTime + 10
        }
        //test shift
        if (ev.shiftKey && ev.keyCode === 188) {
            if (video.playbackRate > 0.5)
            video.playbackRate = video.playbackRate - 0.25
            div.innerHTML = `${video.playbackRate}x`
            div = initFadeout(div)
        }
        if (ev.shiftKey && ev.keyCode === 190) {
            if (video.playbackRate < 2.5)
            video.playbackRate = video.playbackRate + 0.25
            div.innerHTML = `${video.playbackRate}x`
            div = initFadeout(div)
        }
        if (ev.keyCode === 80) { //p
            play.click()
        }
        if (ev.keyCode === 32) { // space
            play.click()
        }
    
    })    



})
