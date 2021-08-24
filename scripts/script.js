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
    contentEpisode.innerHTML='';
}

const episodeContent = (resJson) => {

    clearContent();
    const contentEpisode = document.querySelector('.contentEpisode');
    const h1 = document.createElement('h1');
    const h5 = document.createElement('h5');
    const contentCharacter = document.createElement('div');
    contentCharacter.className = 'personajesEpisodios d-flex row';
    h1.innerText = resJson.name;
    h5.innerText = `${resJson.air_date} | ${resJson.episode}`
    contentEpisode.appendChild(h1);
    contentEpisode.appendChild(h5);
    contentEpisode.appendChild(contentCharacter);
    resJson.characters.forEach(character => {

    fetch(character)
    .then(response => response.json())
    .then(json => {
      const personajesEpisodios = document.querySelector(".personajesEpisodios")
      const card = document.createElement('div')
      card.className = 'col-3'
      personajesEpisodios.appendChild(card)
      card.innerHTML = `<div class="card m-3" style="width: 14rem;"><img src="${json.image}" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">${json.name}</h5><h5 class="card-title">${json.species} | ${json.status}</h5></div></div>`;
    }) 
    });
}

const fetchEpisodes = async (episode) => {
    try{
    const url = `https://rickandmortyapi.com/api/episode/${episode}`;
    const request = await fetch(url);
    const response = await request.json();
    episodeContent(response);
    }catch(error){
        console.log(error);
    }
}


const episodeList = (resJson) => {

    const count = resJson.info.count;
    const list = document.querySelector('#list');
    const ul = document.createElement('ul');
    ul.className = 'nav nav-pills flex-column mb-3';
    list.appendChild(ul);

    for(let i=0;i<count;i++){
        const li = document.createElement('li');
        li.className = 'nav-item m-2 col-10';
        ul.appendChild(li);
        li.innerHTML = `<a href="#" class="nav-link active" aria-current="page">Episode ${i+1}</a>`;
        li.onclick = () => fetchEpisodes(i+1);
    }
}

const fetchAllEpisodes = async () => {

    try{
        const url = "https://rickandmortyapi.com/api/episode";
        const request = await fetch(url);
        const response = await request.json();
        episodeList(response)
    }catch(error){
        console.log(error);
    }

}

fetchAllEpisodes();