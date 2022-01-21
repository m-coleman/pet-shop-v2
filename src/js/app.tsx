import React from "react";
import ReactDOM from "react-dom";
import { Pet } from "./pets";
import { allPets } from "./pets";

ReactDOM.render(<App/>, document.getElementById("react"));

function App() {

    function getPetCards() {
        return allPets.map((p: Pet, i: number) => {
            return <PetCard pet={p} key={i}/>
        });
    }

    return (
        <div>
            <h1 className="text-center">Cryptolord's Pet Shop</h1>
            {getPetCards()}
        </div>
    );
}

function PetCard(props: any) {
    let p: Pet = props.pet;
    return (
        <div>
            <div>{p.name}</div>
            <img src={p.picture}></img>
            <div>{p.id}</div>
            <div>{p.age}</div>
            <div>{p.breed}</div>
            <div>{p.location}</div>
            <br/>
        </div>
    );
}
