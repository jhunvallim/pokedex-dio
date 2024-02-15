const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");
const pokemonDetail = document.getElementById("pokemon-detail");
const pokemonDetailContent = document.getElementById("pokemon-detail-content");

const maxRecords = 151; // Total of pokemons in the API 1302
const limit = 10; // Number of pokemons to load each time
let offset = 0;

function openDetail(pokemon) {
  pokemonDetail.style.display = "block";
  pokemonDetailContent.innerHTML = `
        <section class="detail-window ${pokemon.types[0].type.name}">
            <span class="name">${pokemon.name}</span>
            <span class="number">#${pokemon.id}</span>
            <div class="detail ${pokemon.types[0].type.name}">
                <ol class="types">
                    ${pokemon.types
                      .map(
                        (pokemon) =>
                          `<li class="type ${pokemon.type.name}">${pokemon.type.name}</li>`
                      )
                      .join("")}
                </ol>
                <img src="${
                  pokemon.sprites.other.dream_world.front_default
                }" alt="${pokemon.name}">
            </div>
            <h4>Base stats</h4>
            <ol class="stats">
            ${pokemon.stats
              .map(
                (pokemon) => `
                <li class="type">${pokemon.stat.name} 
                <span class="value">${pokemon.base_stat}</span>
                </li>`
              )
              .join("")}
            </ol>
        </section>
    `;
}
function closeDetail() {
  pokemonDetail.style.display = "none";
}

function convertPokemonToLi(pokemon) {
  return `
        <li data-idPokemon="${pokemon.number}" class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit, callback) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
    
    if (callback) {
      callback();
    }
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  const scrollToEnd = () => {
    setTimeout(() => {
      document
        .getElementById("pokemonList")
        .lastElementChild.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit, scrollToEnd);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit, scrollToEnd);
  }
});

pokemonList.addEventListener("click", (event) => {
  const clickedPokemonElement = event.target.closest(".pokemon");
  const idPokemon = clickedPokemonElement.dataset.idpokemon;

  pokeApi.getPokemonById(idPokemon).then((pokemonStats = []) => {
    openDetail(pokemonStats);
  });
});
