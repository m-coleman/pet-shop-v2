import React, {useState} from "react";
import ReactDOM from "react-dom";
import { Pet } from "./pets";
import { allPets } from "./pets";

ReactDOM.render(<App/>, document.getElementById("react"));

function App() {

    const [filterSelf, setFilterSelf] = useState(false);

    function getNav() {
        const allPetsActive = !filterSelf ? "active" : "";
        const myPetsActive = filterSelf ? "active" : "";
        return (
            <div className="container">
                <nav className="navbar fixed-top navbar-light bg-light nav-border">
                    <div className="btn-group btn-group-toggle">
                        <label className={`btn btn-secondary ${allPetsActive}`}>
                            <input type="radio" onClick={()=> setFilterSelf(false)}/> All Pets
                        </label>
                        <label className={`btn btn-secondary ${myPetsActive}`}>
                            <input type="radio" onClick={()=> setFilterSelf(true)}/> My Pets
                        </label>
                    </div>
                    <span className="pet-title">Cryptolord's Pet Shop</span>
                    <button className="btn btn-outline-danger">🔅 🔆 Connect Wallet</button>
                </nav>
            </div>
        );
    }

    function getPetCards(filterSelf: boolean) {
        return allPets
            .filter((p: Pet) => {
                return !filterSelf || p.owner === 'myAddrFromEthers'; // TOOD: figure this out
            })
            .map((p: Pet, i: number) => {
                return <PetCard pet={p} key={i}/>;
            });
    }

    return (
        <div>
            {getNav()}
            <div className="container pet-container">
                <div className="card-deck">
                    {getPetCards(filterSelf)}
                </div>
            </div>
        </div>
    );
}

function PetCard(props: any) {
    const p: Pet = props.pet;
    const owner = p.owner ? p.owner : "Nobody!";
    const priceId = `price-${p.id}`;
    return (
        <div className="card pet-card mb-3">
            <h5 className="card-header text-center">{p.name}</h5>
            <div className="card-body">
                <img className="card-img" src={p.picture}></img>
            </div>
            <ul className="list-group list-group-flush">
                <li className="list-group-item">
                    <div className="card-text"><strong>Age:</strong> {p.age}</div>
                    <div className="card-text"><strong>Owner:</strong> {owner}</div>
                    <div className="card-text">
                        <label htmlFor={priceId}>
                            <strong>Price (ETH):</strong>
                            <input type="number" className="form-control price-input ml-2" min="1" defaultValue="1" name={priceId} id={priceId}/>
                        </label>
                    </div>
                </li>
                <li className="list-group-item text-center">
                    <button className="btn btn-outline-primary button-width mr-2">Adopt</button>
                    <button className="btn btn-primary button-width">Buy</button>
                </li>
            </ul>
        </div>
    );
}
