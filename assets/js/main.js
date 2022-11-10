const modalDetail = document.getElementById('modalDetail');
const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

maxLimit = 151;
let offset = 0;
const limit = 8;



function convertPokemonToLi (pokemon){
    
    return `
        <li id="selectPokemon" class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>            
            <div class="detail">
                    <ol class="types">
                         ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}                                        
                    </ol>
                    <img src="${pokemon.photo}" alt="${pokemon.name}">                  
            </div>                     
        </li>     
    `;
}

function convertPokemonToAbility (pokemon){
    
    return `
    
    <div class="itemPokemon1">                                     
            <button class="fechar">X</button>                    
            <li id="selectPokemon" class="modal-pokemon ${pokemon.type}" data-id="${pokemon.number}">
                <span class="number">#${pokemon.number}</span>
                <span class="name">${pokemon.name}</span>            
                <div class="detail">
                        <ol class="types">
                            ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}                        
                        </ol>            
                        <img src="${pokemon.photo}" alt="${pokemon.name}">                  
                </div>                     
            </li> 
        </div> 
    <div class="itemPokemon2">
        <span class="abilidade item">Abilidades: ${pokemon.abilities.map((ability) => `${ability}`).join(', ')}</span>
        <span class="ataque item">Ataque: ${pokemon.effort.map((stat) => `${stat}`).join(', ')}</span>
        <span class="altura item">Altura: ${pokemon.height}M</span>
        <span class="peso item">Peso: ${pokemon.weight}kg</span>
    </div>         
  
    `;
}


function loadPokemonItens(offset, limit){
    pokeApi.getPokemon(offset, limit).then((pokemons = []) => {        
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;   
    });
}


loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWinPage = offset + limit;

    if (qtdRecordsWinPage >= maxLimit){
        const newLimit = maxLimit - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    }else{
        loadPokemonItens(offset, limit);   
    }
    
}); 

function iniciaModal(modalId){
    const modal = document.getElementById(modalId);
    modal.classList.add('mostrar');
    modal.addEventListener('click', (e) => {    
        //condição para o fechamento da janela de informações das abilidades dos pokemon
        if(e.target.id == modalId || e.target.className == 'fechar'){
            modal.classList.remove('mostrar')
        }
    })
}

function getPokemonDetailsAbility(id_pokemon) {
    pokeApi.getPokemonAbility(id_pokemon).then((pokemon) => {
        if(!pokemon){
            modalDetail.innerHTML = '<h2>Não encontrado</h2>';
            return;
        }
        const modalPokemon = convertPokemonToAbility(pokemon);
        modalDetail.innerHTML = modalPokemon;       
    })
}

const selectPokemon = document.getElementById('pokemonList');

//clicar e abrir a janela de detalhes do pokemon selecionado
selectPokemon.addEventListener('click', (e) => {
    e.preventDefault();
    let target = e.target; //clicando no pokemon

    while (target && target.parentNode !== selectPokemon) {
        target = target.parentNode; //Se o pokemon clicado não for um filho direto de selectPokemon, continue como pai acima 
        if(!target) { return; } //Pokemon não exite, não acontece nada.
    }     
    if (target.tagName === 'LI'){ //Verifique se o elemento é um LI e obtenha o atributo o valor data-id      
       //console.log(target.getAttribute('data-id'));
       getPokemonDetailsAbility(target.getAttribute('data-id'));       
       iniciaModal('modal-detailPokemon');      
    }    
});


loadPokemonItens(offset, limit);