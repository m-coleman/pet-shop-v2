import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { ethers } from "ethers";
import { Pet } from "./pets";
import { allPets } from "./pets";

ReactDOM.render(<App/>, document.getElementById("react"));

declare const window: any;
let provider: ethers.providers.Web3Provider;
let signer: ethers.providers.JsonRpcSigner;
let address: string;

function App() {

    const [walletConnected, setWalletConnected] = useState(false);

    useEffect(() => {
        async function setup() {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            try {
                address = await signer.getAddress();
                setWalletConnected(true);
            } catch (e) {
                setWalletConnected(false);
            }
        }
        setup();
    }, []);

    const [filterSelf, setFilterSelf] = useState(false);
    return (
        <div>
            <Nav filterSelf={filterSelf} setFilterSelf={setFilterSelf}
                walletConnected={walletConnected} setWalletConnected={setWalletConnected}/>
            <PetCardContainer filterSelf={filterSelf} walletConnected={walletConnected}/>
        </div>
    );
}

function Nav(props: any) {

    async function connectWallet() {
        await provider.send("eth_requestAccounts", []);
        setWalletConnected(true);
    }

    function ConnectWalletButton() {
        return <button className="btn btn-outline-danger" onClick={connectWallet}>🔅 Connect Wallet</button>;
    }

    function WalletConnectedButton() {
        return <button className="btn btn-success">🔆 Wallet Connected</button>;
    }

    const { filterSelf, setFilterSelf, walletConnected, setWalletConnected } = props;
    const allPetsActive = !filterSelf ? "active" : "";
    const myPetsActive = filterSelf ? "active" : "";
    const walletHtml = walletConnected ? <WalletConnectedButton/> : <ConnectWalletButton/>;

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
            {walletHtml}
        </nav>
    </div>
    );
}

function PetCardContainer(props: any) {

    function getPetCards(filterSelf: boolean) {
        return allPets
            .filter((p: Pet) => {
                return !filterSelf || p.owner === 'myAddrFromEthers'; // TOOD: figure this out
            })
            .map((p: Pet, i: number) => {
                return <PetCard pet={p} key={i} walletConnected={walletConnected}/>;
            });
    }

    const { filterSelf, walletConnected } = props;
    return (
        <div className="container pet-container">
            <div className="card-deck">
                {getPetCards(filterSelf)}
            </div>
        </div>
    );
}

function PetCard(props: any) {
    function adopt() {

    }

    function buy() {

    }

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
                <PetCardFooter walletConnected={props.walletConnected} adopt={adopt} buy={buy}/>
            </ul>
        </div>
    );
}

function PetCardFooter(props: any) {
    function AdoptBuy() {
        return (
            <>
                <button className="btn btn-outline-primary button-width mr-2" onClick={props.adopt}>Adopt</button>
                <button className="btn btn-primary button-width" onClick={props.buy}>Buy</button>
            </>
        );
    }

    function CannotAdoptBuy() {
        return <div>Connect wallet to interact</div>;
    }

    const footer = props.walletConnected ? <AdoptBuy/> : <CannotAdoptBuy/>;
    return (
        <li className="list-group-item text-center">
            {footer}
        </li>
    );
}
