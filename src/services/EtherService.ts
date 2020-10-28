import { BigNumber, ethers } from 'ethers';
import { Provider } from '@ethersproject/providers';

export default class EtherService {
  network: string;
  ethereum: any;
  provider: Provider;
  signer: any;
  decentramallAddress: string;
  decentramallABI: Array<string>;
  daiAddress: string;
  daiABI: Array<string>;

  private static instance: EtherService;

  private constructor() {
    this.network = 'ropsten';
    this.ethereum = (window as any).ethereum;

    // TODO: handle scenario when window.ethereum is undefined
    if (this.isEthereumNodeAvailable()) {
      this.provider = new ethers.providers.Web3Provider(this.ethereum, this.network);
      this.signer = new ethers.providers.Web3Provider(this.ethereum, this.network).getSigner();
    } else {
      this.provider = ethers.getDefaultProvider(this.network);
      this.signer = null;
    }

    this.decentramallAddress = '0x31263af02f40Aa9479eCb7e1c890999863b69725';
    this.daiAddress = '0xe7e8F9a8648581433710105C380cE71771422d08';

    this.decentramallABI = [
      'event ChangeDai(address newDai)',
      'event ChangeAdmin(address newAdmin)',
      'event BuySpace(address buyer, uint256 tokenId, uint256 price)',
      'event SellSpace(address seller, uint256 tokenId, uint256 price)',
      'event DepositSpace(address depositor, uint256 tokenId, uint256 maxRentableBlock)',
      'event WithdrawSpace(address withdrawer, uint256 tokenId)',
      'event RentSpace(address renter, uint256 tokenId, uint256 expiryBlock, uint256 rentPaid)',
      'event ClaimRent(address owner, uint256 tokenId, uint256 rentClaimed)',
      'event ExtendRent(address renter, uint256 tokenId, uint256 newExpiryBlock, uint256 newRentPaid)',
      'event CancelRent(address renter, uint256 tokenId)',
      'function price(uint256 x) public view returns(uint256)',
      'function buy() public',
      'function sell(uint256 tokenId) public',
      'function deposit(uint256 tokenId, uint256 stakeDuration) public',
      'function rent(uint256 tokenId, string memory _tokenURI, uint256 rentDuration) public',
      'function cancelRent(uint256 tokenId) public',
      'function extendRent(uint256 tokenId, uint256 rentDuration) public',
      'function claim(uint256 tokenId) public',
      'function withdraw(uint256 tokenId) public',
      'function totalSupply() public view returns (uint256)', // This is from ERC721
      'function changeDaiAddress(address newDai) public',
      'function changeAdmin(address newAdmin) public',
      'function balanceOf(address owner) public view returns (uint256)',
      'function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)',
      'function ownerOf(uint256 tokenId) public view returns (address)'
    ];

    this.daiABI = [
      'function mint(address to, uint256 amount) public',
      'function approve(address sender, uint256 amount) public',
    ]
  }

  public static getInstance(): EtherService {
    if (!EtherService.instance) {
      EtherService.instance = new EtherService();
    }

    return EtherService.instance;
  }

  public isEthereumNodeAvailable(): boolean {
    return typeof this.ethereum !== 'undefined';
  }

  public getNetwork(): string {
    return this.ethereum?.networkVersion;
  }

  public getUserAddress(): string {
    return this.ethereum?.selectedAddress;
  }

  public addNetworkListener(chainChangeCallback: (chainID: string) => void) {
    this.ethereum.on('networkChanged', chainChangeCallback);
  }

  public addAccountListener(accChangeCallback: (accounts: string[]) => void) {
    this.ethereum.on('accountsChanged', accChangeCallback);
  }

  public addAllListeners(chainChangeCallback: (chainID: string) => void, accChangeCallback: (accounts: string[]) => void): void {
    this.addNetworkListener(chainChangeCallback);
    this.addAccountListener(accChangeCallback);
  }

  public removeAllListeners(): void {
    this.ethereum.removeAllListeners('networkChanged');
    this.ethereum.removeAllListeners('accountsChanged');
  }

  public findENSDomain(address: string, resolve: (domain: string) => void): void {
    this.provider.lookupAddress(address).then(domain => resolve(domain));
  }

  public resolveName(domain: string, resolve: (address: string) => void): void {
    this.provider.resolveName(domain).then(address => resolve(address));
  }

  public async requestConnection(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      if (this.isEthereumNodeAvailable()) {
        const accounts =
          await this.ethereum
            .enable()
            .catch((error: any) => {
              reject(error.message);
            });

        // TODO: verify whether it is possible to delete all accounts from MM, if not, just resolve selectedAddress
        const selectedAddress = accounts?.length > 0 ? accounts[0] : null;
        if (selectedAddress === null) {
          reject('No accounts linked to MetaMask.');
        } else {
          resolve(selectedAddress);
        }
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.');
      }
    });
  }

  // BASIC ERC721 IMPLEMENTATIONS
  public async totalSupply(): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      if(this.isEthereumNodeAvailable()) {
        const contract = new ethers.Contract(this.decentramallAddress, this.decentramallABI, this.signer);
        contract.totalSupply()
          .then(
            (success: any) => resolve(success),
            (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.message));
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.');
      }
    })
  }

  public async balanceOf(
    address:string
  ): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      if(this.isEthereumNodeAvailable()){
        const contract = new ethers.Contract(this.decentramallAddress, this.decentramallABI, this.signer);
        contract.balanceOf(address)
          .then(
            (success: any) => resolve(success),
            (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.message));
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.')
      }
    })
  }

  public async tokenByIndex(
    address:string,
    index:string
  ): Promise<BigNumber> {
    return new Promise<BigNumber>(async (resolve, reject) => {
      if(this.isEthereumNodeAvailable()){
        const contract = new ethers.Contract(this.decentramallAddress, this.decentramallABI, this.signer);
        contract.tokenOfOwnerByIndex(address, index)
          .then(
            (success: any) => resolve(success),
            (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.message));
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.')
      }
    })
  }

  public async isStaked(
    tokenId: string
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      if(this.isEthereumNodeAvailable()){
        const contract = new ethers.Contract(this.decentramallAddress, this.decentramallABI, this.signer);
        contract.ownerOf(tokenId)
          .then(
            (success: any) => {
              if(success === this.decentramallAddress){
                resolve(true);
              }
              resolve(false);
            },
            (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.message));
      } else {
        reject('Please install Metamask to interact with Ethereum blockchain.')
      }
    })
  }

  // DAI IMPLEMENTATION
  public async mint(
    to: string,
    amount: string,
    eventCallback: (event: any) => void
  ): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      if(this.isEthereumNodeAvailable()) {
        const contract = new ethers.Contract(this.daiAddress, this.daiABI, this.signer);

        contract.mint(to, amount)
          .then(
            (success: any) => resolve(success),
            (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.message));
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.');
      }
    })
  }

  public async approve(
    amount: string,
    eventCallback: (event: any) => void
  ): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      if(this.isEthereumNodeAvailable()){
        const contract = new ethers.Contract(this.daiAddress, this.daiABI, this.signer);

        // Send TX
        contract
          .approve(this.decentramallAddress, amount)
          .then(
              (success: any) => resolve(success),
              (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.message));
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.');
      }
    })
  }

  // DECENTRAMALL IMPLEMENTATION
  public async price(
    x: number,
    eventCallback: (event: any) => void
  ): Promise<string> {
    return new Promise<string>(async (resolve,reject) => {
        if (this.isEthereumNodeAvailable()) {
            const contract = new ethers.Contract(this.decentramallAddress, this.decentramallABI, this.signer);

            // Send TX
            contract
                .price(x)
                .then(
                    (success: any) => resolve(success),
                    (reason: any) => reject(reason)
                )
                .catch((error: any) => reject(error.message));
            
        } else {
            reject('Please install MetaMask to interact with Ethereum blockchain.');
        }
    })
  }

  public async buy(
    eventCallback: (event: any) => void
  ): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      if (this.isEthereumNodeAvailable()) {
        const contract = new ethers.Contract(this.decentramallAddress, this.decentramallABI, this.signer);

        // Notify frontend about successful deployment (TX mined) BuySpace(address buyer, uint256 tokenId, uint256 price)
        contract
            .once("BuySpace", (buyer, tokenId, price, event) => eventCallback(event))
            .once("error", console.error);

        // Send TX
        contract
          .buy()
          .then(
            (success: any) => resolve(success),
            (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.reason));
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.');
      }
    });
  }

  public async sell(
    tokenId: string,
    eventCallback: (event: any) => void
  ): Promise<string>{
    return new Promise<string>(async (resolve, reject) => {
      if(this.isEthereumNodeAvailable()){
        const contract = new ethers.Contract(this.decentramallAddress, this.decentramallABI, this.signer);
        contract
            .once("SellSpace", (seller, tokenId, price, event) => eventCallback(event))
            .once("error", console.error);

        // Send TX
        contract
          .sell(tokenId)
          .then(
            (success: any) => resolve(success),
            (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.reason));
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.');
      }
    })
  }

  public async deposit(
    tokenId: string,
    stakeDuration: string,
    eventCallback: (event: any) => void
  ): Promise<string>{
    return new Promise<string>(async (resolve, reject) => {
      if(this.isEthereumNodeAvailable()){
        const contract = new ethers.Contract(this.decentramallAddress, this.decentramallABI, this.signer);
        contract
            .once("DepositSpace", (depositor, tokenId, maxRentableBlock, event) => eventCallback(event))
            .once("error", console.error);

        // Send TX
        contract
          .deposit(tokenId, stakeDuration)
          .then(
            (success: any) => resolve(success),
            (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.reason));
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.');
      }
    })
  }

  public async rent(
    tokenId: string,
    _tokenUri: string,
    rentDuration: string,
    eventCallback: (event: any) => void
  ): Promise<string>{
    return new Promise<string>(async (resolve, reject) => {
      if(this.isEthereumNodeAvailable()){
        const contract = new ethers.Contract(this.decentramallAddress, this.decentramallABI, this.signer);
        contract
            .once("RentSpace", (renter, tokenId, expiryBlock, rentPaid, event) => eventCallback(event))
            .once("error", console.error);

        // Send TX
        contract
          .rent(tokenId, _tokenUri, rentDuration)
          .then(
            (success: any) => resolve(success),
            (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.reason));
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.');
      }
    })
  }

  public async cancelRent(
    tokenId: string,
    eventCallback: (event: any) => void
  ): Promise<string>{
    return new Promise<string>(async (resolve, reject) => {
      if(this.isEthereumNodeAvailable()){
        const contract = new ethers.Contract(this.decentramallAddress, this.decentramallABI, this.signer);
        contract
            .once("CancelRent", (tokenId, event) => eventCallback(event))
            .once("error", console.error);

        // Send TX
        contract
          .cancelRent(tokenId)
          .then(
            (success: any) => resolve(success),
            (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.reason));
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.');
      }
    })
  }

  public async extendRent(
    tokenId: string,
    rentDuration: string,
    eventCallback: (event: any) => void
  ): Promise<string>{
    return new Promise<string>(async (resolve, reject) => {
      if(this.isEthereumNodeAvailable()){
        const contract = new ethers.Contract(this.decentramallAddress, this.decentramallABI, this.signer);
        contract
            .once("ExtendRent", (renter, tokenId, newExpiryBlock, newRentPaid, event) => eventCallback(event))
            .once("error", console.error);

        // Send TX
        contract
          .extendRent(tokenId, rentDuration)
          .then(
            (success: any) => resolve(success),
            (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.reason));
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.');
      }
    })
  }

  public async claim(
    tokenId: string,
    eventCallback: (event: any) => void
  ): Promise<string>{
    return new Promise<string>(async (resolve, reject) => {
      if(this.isEthereumNodeAvailable()){
        const contract = new ethers.Contract(this.decentramallAddress, this.decentramallABI, this.signer);
        contract
            .once("ClaimRent", (owner, tokenId, rentClaimed, event) => eventCallback(event))
            .once("error", console.error);

        // Send TX
        contract
          .claim(tokenId)
          .then(
            (success: any) => resolve(success),
            (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.reason));
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.');
      }
    })
  }

  public async withdraw(
    tokenId: string,
    eventCallback: (event: any) => void
  ): Promise<string>{
    return new Promise<string>(async (resolve, reject) => {
      if(this.isEthereumNodeAvailable()){
        const contract = new ethers.Contract(this.decentramallAddress, this.decentramallABI, this.signer);
        contract
            .once("WithdrawSpace", (withdrawer, tokenId, event) => eventCallback(event))
            .once("error", console.error);

        // Send TX
        contract
          .withdraw(tokenId)
          .then(
            (success: any) => resolve(success),
            (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.reason));
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.');
      }
    })
  }

  public async changeDaiAddress(
    address: string,
    eventCallback: (event: any) => void
  ): Promise<string>{
    return new Promise<string>(async (resolve, reject) => {
      if(this.isEthereumNodeAvailable()){
        const contract = new ethers.Contract(this.decentramallAddress, this.decentramallABI, this.signer);
        contract
            .once("ChangeDai", (newDai, event) => eventCallback(event))
            .once("error", console.error);

        // Send TX
        contract
          .changeDaiAddress(address)
          .then(
            (success: any) => resolve(success),
            (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.reason));
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.');
      }
    })
  }

  public async changeAdmin(
    address: string,
    eventCallback: (event: any) => void
  ): Promise<string>{
    return new Promise<string>(async (resolve, reject) => {
      if(this.isEthereumNodeAvailable()){
        const contract = new ethers.Contract(this.decentramallAddress, this.decentramallABI, this.signer);
        contract
            .once("ChangeAdmin", (newAdmin, event) => eventCallback(event))
            .once("error", console.error);

        // Send TX
        contract
          .changeAdmin(address)
          .then(
            (success: any) => resolve(success),
            (reason: any) => reject(reason)
          )
          .catch((error: any) => reject(error.reason));
      } else {
        reject('Please install MetaMask to interact with Ethereum blockchain.');
      }
    })
  }
}