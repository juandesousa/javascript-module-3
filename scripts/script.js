const body = document.querySelector('body');
const root = document.querySelector('#root');
const content = document.createElement('div');

body.appendChild(content);

body.className = 'container';
content.className = 'd-flex content';
root.innerHTML = '<header class="bg-light d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom"><a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none"><span class="fs-4">Rick & Morty API</span></a></header>';
content.innerHTML = '<div class="d-flex flex-column flex-shrink-0 p-3 bg-light overflow-auto" id="list" style="width: 200px; height: 725px"><a href="/" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none"><span class="fs-4">Episode List</span></a></div><div class="m-5 contentEpisode"></>';

const clearContent = () => {
    const contentEpisode = document.querySelector('.contentEpisode');
    contentEpisode.innerHTML = '';
}

const renderLocation = (location) => {
    clearContent();
    fetch(location)
        .then(request => request.json())
        .then(response => { 
            const contentEpisode = document.querySelector('.contentEpisode');
            const h1 = document.createElement('h1');
            const h5 = document.createElement('h5');
            const contentCharacter = document.createElement('div');
            contentCharacter.className = 'personajes-episodios d-flex row';
            h1.innerText = response.name;
            h5.innerText = `${response.type} | ${response.dimension}`
            contentEpisode.appendChild(h1);
            contentEpisode.appendChild(h5);
            contentEpisode.appendChild(contentCharacter);
            response.residents.forEach(resident => {

                fetch(resident)
                    .then(response => response.json())
                    .then(json => {
                        const personajesEpisodios = document.querySelector(".personajes-episodios")
                        const card = document.createElement('div')
                        card.className = 'col-3';
                        personajesEpisodios.appendChild(card)
                        card.innerHTML = `<div class="card m-2" style="cursor: pointer"><img src="${json.image}" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title"><b>${json.name}</b></h5><h5 class="card-title">${json.species} | ${json.status}</h5></div></div>`;
                        card.onclick = () => renderCharacter(json);
                    })
            });
        })
}

const renderCharacter = (character) => {
    clearContent();
    const contentEpisode = document.querySelector('.contentEpisode');
    const divUp = document.createElement('div');
    const divDown = document.createElement('div');
    const h1 = document.createElement('h1');
    const h5 = document.createElement('h5');
    const img = document.createElement('img');
    const contentCharacter = document.createElement('div');
    const hr = document.createElement('hr');
    const button = document.createElement('div');
    divUp.className = 'd-flex m-2 p-2';
    divDown.className = 'm-5'
    contentCharacter.className = 'personajes-episodios d-flex row';
    img.style.width = '200px';
    img.src = `${character.image}`
    h1.innerText = character.name;
    h5.innerHTML = `${character.species} | ${character.status} | ${character.gender} | ${character.origin.name}`;
    button.innerHTML = `<button type="button" class="btn btn-light"><b>Location</b></button>`;
    button.onclick = () => renderLocation(character.location.url);
    contentEpisode.appendChild(divUp);
    divUp.appendChild(img);
    divUp.appendChild(divDown);
    divDown.appendChild(h1);
    divDown.appendChild(h5);
    divDown.appendChild(button);
    contentEpisode.appendChild(hr);
    contentEpisode.appendChild(contentCharacter);
    character.episode.forEach(episode => {
        fetch(episode)
            .then(request => request.json())
            .then(response => {
                const personajesEpisodios = document.querySelector(".personajes-episodios")
                const card = document.createElement('div')
                card.className = 'col-3';
                personajesEpisodios.appendChild(card)
                card.innerHTML = `<div class="card m-2" style="cursor: pointer; border:none"><div class="card-body"><h5 class="card-title"><b>Episode ${response.id}</b></h5><h5 class="card-title">${response.episode}</h5></div></div>`;
                card.onclick = () => fetchEpisodes(response.id)
            })
    })
}

const episodeContent = (resJson) => {

    clearContent();
    const contentEpisode = document.querySelector('.contentEpisode');
    const h1 = document.createElement('h1');
    const h5 = document.createElement('h5');
    const contentCharacter = document.createElement('div');
    contentCharacter.className = 'personajes-episodios d-flex row';
    h1.innerText = resJson.name;
    h5.innerText = `${resJson.air_date} | ${resJson.episode}`
    contentEpisode.appendChild(h1);
    contentEpisode.appendChild(h5);
    contentEpisode.appendChild(contentCharacter);
    resJson.characters.forEach(character => {

        fetch(character)
            .then(response => response.json())
            .then(json => {
                const personajesEpisodios = document.querySelector(".personajes-episodios")
                const card = document.createElement('div')
                card.className = 'col-3';
                personajesEpisodios.appendChild(card)
                card.innerHTML = `<div class="card m-2" style="cursor: pointer"><img src="${json.image}" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title"><b>${json.name}</b></h5><h5 class="card-title">${json.species} | ${json.status}</h5></div></div>`;
                card.onclick = () => renderCharacter(json);
            })
    });
}

const fetchEpisodes = async (episode) => {
    try {
        const url = `https://rickandmortyapi.com/api/episode/${episode}`;
        const request = await fetch(url);
        const response = await request.json();
        episodeContent(response);
    } catch (error) {
        console.log(error);
    }
}

const list = document.querySelector('#list');
const ul = document.createElement('ul');
ul.className = 'nav nav-pills flex-column mb-3';
list.appendChild(ul);

const renderEpisode = (paginar)=>{
    paginar.forEach((result) => {
        const li = document.createElement('li');
        li.className = 'nav-item m-2 col-10';
        ul.appendChild(li);
        li.innerHTML = `<button  class="btn btn-primary" aria-current="page">Episode ${result.id}</button>`;
        li.onclick = () => fetchEpisodes(result.id);
    })
}

const episodeList = (resJson) => {
    let {results} = resJson
    
    renderEpisode (results.slice(0,10));
    
    const button = document.createElement('div');
    button.className = 'd-flex p-2 loadmore'
    button.innerHTML = `<button type="button" class="btn btn-outline-primary">Load More</button>`;
    button.onclick = () => {
        const sizeList = parseInt(ul.childElementCount.toString().split(''));

        if(sizeList%2 !== 0){
            renderEpisode (results.slice(10,20));
        }else{
            button.className='d-none'
            fetchAllEpisodes(resJson.info.next)
        }
    };
   
    list.appendChild(button);
}

const fetchAllEpisodes = async (url = "https://rickandmortyapi.com/api/episode") => {

    try {
        const request = await fetch(url);
        const response = await request.json();
        episodeList(response)
    } catch (error) {
        throw Error(error)
    }

}

fetchAllEpisodes();