import { ethers, Contract } from "ethers";

const adoptionContractAbi = require('../../artifacts/contracts/Adoption.sol/Adoption.json').abi;
const adoptionContractAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export class AdoptionContract {

    contract: Contract;

    constructor(signer: ethers.providers.JsonRpcSigner) {
        this.contract = new Contract(adoptionContractAddr, adoptionContractAbi, signer);
    }

    async adopt(petId: number) {
        const result = await this.contract.adopt(petId);
        debugger;
    }

    async buy(petId: number, price: number) {
        const result = await this.contract.buy(petId, {value: ethers.utils.parseEther(price.toString())});
        debugger;
    }

    async getOwner(petId: number): Promise<string> {
        return await this.contract.adopters(petId);
    }
}
