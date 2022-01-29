### Local Setup Guide
1) `npm install`
2) `npm run build`
3) `npm run dev`
    - runs local server on port 8080
4) in another terminal - `npm run watch`
5) in another terminal - `tsc --watch`
    - alternatively in VS Code:
        - `cmd + shift + b`
        - run build task `tsc: watch`

##### Hardhat
- in another terminal: Run a hardhat network locally (like Ganache) by running `npm run blockchain`
- in another terminal: Deploy to the network with `npm run deploy`