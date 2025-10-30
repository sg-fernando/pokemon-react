import React, { useState } from 'react';
import './App.css';
import './pokeTypes.css'

function App() {
  const [pokemonName, setPokemonName] = useState("");
  const [pokemonList, setPokemonList] = useState([]);

    const fetchPokemon = async (name) => {
        const safe = name.trim().toLowerCase();
        if (!safe) throw new Error('Empty name');
        const url = `https://pokeapi.co/api/v2/pokemon/${safe}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`No Pokémon found for "${name}"`);
        const data = await res.json();
        const stats = data.stats ?? [];
        return {
            name: data.name,
            img: data.sprites?.front_default ?? '',
            type: data?.types?.[0]?.type?.name ?? 'normal',
            moves: data.moves ?? [],
            hp: stats?.[0]?.base_stat ?? 0,
        };
    };

    const replace = async (event, index, name) => {
        event.preventDefault();
        try {
            const poke = await fetchPokemon(name);
            setPokemonList((prev) => {
                const next = [...prev];
                next[index] = poke;
                return next;
            });
        } catch (e) {
            alert(e.message);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const poke = await fetchPokemon(pokemonName);
            setPokemonList((prev) => [...prev, poke]);
            setPokemonName('');
        } catch (e) {
            alert(e.message);
        }
    };

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
