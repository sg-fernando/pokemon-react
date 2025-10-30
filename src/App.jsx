import React, { useState } from 'react';
import './App.css';
import './pokeTypes.css'

function App() {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonList, setPokemonList] = useState([]);

    const replace = (event, index, name) => {
        event.preventDefault();
        console.log(`The name you entered was: ${name} at index ${index}`)
        let url = "https://pokeapi.co/api/v2/pokemon/" + name;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                let name = data.name;
                let img = data.sprites.front_default;
                let type = data.types[0].type.name;
                let moves = data.moves ?? [];
                let stats = data.stats;
                let newPokemonList = [...pokemonList];
                newPokemonList[index] = {
                                            name: name,
                                            img: img,
                                            type: type,
                                            moves: moves,
                                            hp: stats[0].base_stat
                                        };
                setPokemonList(newPokemonList);
            });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        let url = "https://pokeapi.co/api/v2/pokemon/" + pokemonName;
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                let name = data.name;
                let img = data.sprites.front_default;
                let type = data.types[0].type.name;
                let moves = data.moves ?? [];
                let stats = data.stats;
                setPokemonList([
                    ...pokemonList,
                    {
                            name: name,
                            img: img,
                            type: type,
                            moves: moves,
                            hp: stats[0].base_stat
                    }
                ]);
            });
    }

    return (
        <div className="App">
        <h1>Pokemon Cards</h1>
            <form onSubmit={handleSubmit} id="pokemon-form">
                <input className="pokemon-name" type="text" name="pokemon" placeholder="Enter a Pokemon name..." value={pokemonName} onChange={(e) => setPokemonName(e.target.value)} /> <br />
                <input className="submit" type="submit" value="Enter" />
            </form>
            <div className="pokemon-container">
                {
                    pokemonList.map((pokemonObj, index) => {
                        return <Pokemon key={index} pokemonObj={pokemonObj} index={index} replace={replace} />;
                    })
                }
            </div>
        </div>
    );
}

function Pokemon(props) {
    const pokemon = props.pokemonObj;
    const [pokemonName, setPokemonName] = useState(pokemon.name);
    
    
    return (
        <div className={`card ${pokemon.type}`}>
            <h1>{pokemon.name}</h1>
            <p>HP: {pokemon.hp}</p>
            <img src={pokemon.img} alt={pokemon.name} />
            <ul>
                {pokemon.moves.map((move, index) => {
                    if (index < 3) {
                        return <li key={index}>{move.move.name}</li>;
                    }
                })}
            </ul>
            <form onSubmit={(e) => props.replace(e, props.index, pokemonName)}>
                <input type="text" className="update-name" value={pokemonName} onChange={(e) => setPokemonName(e.target.value)} />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}
export default App;
