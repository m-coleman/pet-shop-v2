import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { ethers } from "ethers";
import { Pet } from "./pets";
import { allPets } from "./pets";
import { AdoptionContract } from "./AdoptionContract";

ReactDOM.render(<App/>, document.getElementById("react"));

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const NOBODY = "Nobody!";
declare const window: any;
let provider: ethers.providers.Web3Provider;
let signer: ethers.providers.JsonRpcSigner;

function App() {

    const [contract, setContract] = useState<AdoptionContract | null>(null);
    const [account, setAccount] = useState('');

    function handleAccountsChanged(accountsConnected: Array<string>) {
        if (accountsConnected.length === 0) {
            console.log('Accounts disconnected from pet shop');
            setAccount('');
            return;
        }

        console.log(`Accounts connected to pet shop: ${accountsConnected}`);
        setAccount(accountsConnected[0]);
    }

    useEffect(() => {
        async function setup() {
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            // TODO: prevent 2 renders in this method?
            setContract(new AdoptionContract(signer));
            try {
                // check if a wallet is already connected
                let address = await signer.getAddress();
                setAccount(address);
            } catch (e) {
                setAccount('');
            }
        }
        setup();
    }, []);

    const [filterSelf, setFilterSelf] = useState(false);
    return (
        <div>
            <Nav filterSelf={filterSelf} setFilterSelf={setFilterSelf}
                account={account} setAccount={setAccount}/>
            <PetCardContainer filterSelf={filterSelf} account={account} contract={contract}/>
        </div>
    );
}

function Nav(props: any) {

    async function connectWallet() {
        let accounts = await provider.send("eth_requestAccounts", []);
        let selectedAccount = accounts.length > 0 ? accounts[0] : '';
        setAccount(selectedAccount);
    }

    function ConnectWalletButton() {
        return <button className="btn btn-outline-danger" onClick={connectWallet}>🔅 Connect Wallet</button>;
    }

    function WalletConnectedButton() {
        return <button className="btn btn-success">🔆 Wallet Connected</button>;
    }

    const { filterSelf, setFilterSelf, account, setAccount } = props;
    const allPetsActive = !filterSelf ? "active" : "";
    const myPetsActive = filterSelf ? "active" : "";
    const walletHtml = account ? <WalletConnectedButton/> : <ConnectWalletButton/>;

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

    function getPetCards() {
        return allPets
            .filter((p: Pet) => {
                return !props.filterSelf || p.owner === 'myAddrFromEthers'; // TOOD: figure this out
            })
            .map((p: Pet, i: number) => {
                return <PetCard pet={p} key={i}
                    account={props.account} contract={props.contract}/>;
            });
    }

    return (
        <div className="container pet-container">
            <div className="card-deck">
                {getPetCards()}
            </div>
        </div>
    );
}

function PetCard(props: any) {

    const [owner, setOwner] = useState(props.pet.owner);
    async function updateOwner() {
        if (!contract) {
            setOwner(NOBODY);
            return;
        }

        let currOwner = await contract.getOwner(p.id);
        currOwner = (currOwner === ZERO_ADDRESS) ? NOBODY : currOwner;
        setOwner(currOwner);
    }

    useEffect(() => {
        updateOwner();
    });

    async function adopt(event: Event) {
        const petId = getPetId(event);
        await contract.adopt(petId);
    }

    async function buy(event: Event) {
        const petId = getPetId(event);
        const price = getPrice(event);
        await contract.buy(petId, price);
    }

    function getPetId(event: Event) {
        const target = event.target as HTMLButtonElement;
        const petIdStr = target.getAttribute('data-pet-id') || '';
        return parseInt(petIdStr);
    }

    function getPrice(event: Event): number {
        const petPriceInput = document.getElementById(`price-${getPetId(event)}`) as HTMLInputElement;
        return parseFloat(petPriceInput.value);
    }

    const p: Pet = props.pet;
    const contract: AdoptionContract = props.contract;
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
                    <div className="card-text owner-text"><strong>Owner:</strong> {owner}</div>
                    <div className="card-text">
                        <label htmlFor={priceId}>
                            <strong>Price (ETH):</strong>
                            <input type="number" className="form-control price-input ml-2" min="1" defaultValue="1" name={priceId} id={priceId}/>
                        </label>
                    </div>
                </li>
                <PetCardFooter account={props.account} petId={p.id} adopt={adopt} buy={buy}/>
            </ul>
        </div>
    );
}

function PetCardFooter(props: any) {
    function AdoptBuy() {
        return (
            <>
                <button className="btn btn-outline-primary button-width mr-2" data-pet-id={props.petId} onClick={props.adopt}>Adopt</button>
                <button className="btn btn-primary button-width" data-pet-id={props.petId} onClick={props.buy}>Buy</button>
            </>
        );
    }

    function CannotAdoptBuy() {
        return <div>Connect wallet to interact</div>;
    }

    const footer = props.account ? <AdoptBuy/> : <CannotAdoptBuy/>;
    return (
        <li className="list-group-item text-center">
            {footer}
        </li>
    );
}
