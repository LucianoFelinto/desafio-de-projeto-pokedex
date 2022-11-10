const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail){
    const pokemon = new Pokemon()
    
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types
    pokemon.types = types
    pokemon.type = type

    const abilities = pokeDetail.abilities.map((abilitieSlot) => abilitieSlot.ability.name)
    const [ability] = abilities
    pokemon.abilities = abilities;
    pokemon.ability = ability; 
    
    const effort = [];
    pokeDetail.stats.map(function (statsSlot) {
        let ataques = statsSlot.effort;        
       if(ataques >= 1){ 
            effort.push(statsSlot.stat.name);                     
            return effort.join(', ');
        }              
    });

   
    const [stat] = effort;
    pokemon.effort = effort ;
    pokemon.stat = stat; 

    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;


    
    
    //pokemon.photo = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/"
    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
    .then((response) => response.json()) 
    .then(convertPokeApiDetailToPokemon)
} 


pokeApi.getPokemon = (offset=0, limit=8) =>{
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
    return fetch(url)
            .then((response) => response.json())
            .then((jsonBody) => jsonBody.results)
            .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
            .then((detailRequest) => Promise.all(detailRequest))
            .then((pokemonDetails) => pokemonDetails)
           
}

pokeApi.getPokemonAbility = (id_pokemon) =>{
    const url = `https://pokeapi.co/api/v2/pokemon/${id_pokemon}`;
    return fetch(url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon);
           
}