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
    // document.addEventListener('click', function(e) { 
    //     if(document.activeElement.toString() == '[object HTMLButtonElement]')
    //         { document.activeElement.blur(); }
            
    //      })
    let video = document.getElementsByTagName('video')[0]
    if (video == undefined) throw new Error('There is no video element.\n Its OK, aborting code.')
    video.parentNode.style.display = 'flex'
    video.parentNode.style.justifyContent ='center'
    video.parentNode.style.alignItems = 'center'
    let buttons = document.getElementsByTagName('button')
    let play = document.getElementsByClassName('vjs-play-control')[0]
    video.parentNode.insertBefore(div,video.parentNode.firstChild);

    // chrome.storage.sync.clear();
    const locationManager = (video) => {
        chrome.storage.sync.get('urls', 
        (res)=>{
            console.log(res.urls);
            //init urls
            let dataIndex;
            let thisUrl =location.href;
            let urls = res.urls;    
            if (urls === undefined) {
                console.log('urls is undefined')
                    urls = [[thisUrl,0]]
                }
            //search for the right index of data
            for (let i = 0 ; i< urls.length; i++){
                if (urls[i][0] == thisUrl)
                    dataIndex = i;
            }
            console.log(`dataIndex after search: ${dataIndex}`)
            if (dataIndex == undefined){
                urls = [[thisUrl,0]].concat(urls);
                // chrome.storage.sync.set({urls: urls});
                dataIndex = 0;
                if (urls.length > 50)
                    urls = urls.slice(0,30);
            }  
            console.log(`dataIndex after fix: ${dataIndex}`)
            video.currentTime = urls[dataIndex][1];    
            let save = (dataIndex,urls)=>{
                console.log(urls);
                console.log(dataIndex);  
                console.log(urls[dataIndex][1])  
                urls[dataIndex][1] = video.currentTime;
                chrome.storage.sync.set({urls: urls});
                setTimeout(()=> save(dataIndex,urls),10000);
            }
            document.addEventListener('click',()=> {
                console.log('saved by click');
                urls[dataIndex][1] = video.currentTime;
                chrome.storage.sync.set({urls: urls});  
                if(document.activeElement.toString() == '[object HTMLButtonElement]')
                    document.activeElement.blur();
            })
            setTimeout(()=>save(dataIndex,urls),10000)
        }
        );

    } 


    video.addEventListener('loadeddata',()=>locationManager(video));

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
