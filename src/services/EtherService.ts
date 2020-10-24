import { ethers } from 'ethers';
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
      'function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)'
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
          .approve(this.daiAddress, amount)
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

//   public async sell(
//     meetingAddress: string,
//     stakeAmount: number,
//     eventCallback: (event: any) => void
//   ): Promise<string> {
//     return new Promise<string>(async (resolve, reject) => {
//       if (this.isEthereumNodeAvailable()) {
//         const contract = new ethers.Contract(meetingAddress, this.meetingABI, this.signer);

//         // Notify frontend about successful RSVP (TX mined)
//         contract
//           .once("RSVPEvent", (addr, event) => eventCallback(event))
//           .once("error", console.error);

//         // Send TX
//         contract
//           .rsvp({ value: ethers.utils.parseEther(String(stakeAmount)) })
//           .then(
//             (success: any) => resolve(success),
//             (reason: any) => reject(reason)
//           )
//           .catch((error: any) => reject(error.reason));
//       } else {
//         reject('Please install MetaMask to interact with Ethereum blockchain.');
//       }
//     });
//   }
//   public async getChange(
//     meetingAddress: string,
//     eventCallback: (event: any) => void
//   ): Promise<string> {
//     return new Promise<string>(async (resolve, reject) => {
//       const contract = new ethers.Contract(meetingAddress, this.meetingABI, this.signer);

//       contract
//         .once("GetChange", (event) => eventCallback(event))
//         .once("error", console.error);

//       // Send TX
//       contract
//         .getChange()
//         .then(
//           (success: any) => resolve(success),
//           (reason: any) => reject(reason)
//         )
//         .catch((error: any) => reject(error.reason));
//     });
//   }
//   public async eventCancel(
//     meetingAddress: string,
//     eventCallback: (event: any) => void
//   ): Promise<string> {
//     return new Promise<string>(async (resolve, reject) => {
//       const contract = new ethers.Contract(meetingAddress, this.meetingABI, this.signer);

//       contract
//         .once("EventCancelled", (event) => eventCallback(event))
//         .once("error", console.error);

//       // Send TX
//       contract
//         .eventCancel()
//         .then(
//           (success: any) => resolve(success),
//           (reason: any) => reject(reason)
//         )
//         .catch((error: any) => reject(error.reason));
//     });
//   }
//   public async guyCancel(
//     meetingAddress: string,
//     eventCallback: (event: any) => void
//   ): Promise<string> {
//     return new Promise<string>(async (resolve, reject) => {
//       const contract = new ethers.Contract(meetingAddress, this.meetingABI, this.signer);

//       contract
//         .once("GuyCancelled", (participant, event) => eventCallback(event))
//         .once("error", console.error);

//       // Send TX
//       contract
//         .guyCancel()
//         .then(
//           (success: any) => resolve(success),
//           (reason: any) => reject(reason)
//         )
//         .catch((error: any) => reject(error.reason));
//     });
//   }
//   public async startEvent(
//     meetingAddress: string,
//     eventCallback: (event: any) => void
//   ): Promise<string> {
//     return new Promise<string>(async (resolve, reject) => {
//       const contract = new ethers.Contract(meetingAddress, this.meetingABI, this.signer);

//       contract
//         .once("StartEvent", (addr, event) => eventCallback(event))
//         .once("error", console.error);

//       // Send TX
//       contract
//         .startEvent()
//         .then(
//           (success: any) => resolve(success),
//           (reason: any) => reject(reason)
//         )
//         .catch((error: any) => reject(error.reason));
//     });
//   }
//   public async endEvent(
//     meetingAddress: string,
//     participants: string[],
//     eventCallback: (event: any) => void
//   ): Promise<string> {
//     return new Promise<string>(async (resolve, reject) => {
//       const contract = new ethers.Contract(meetingAddress, this.meetingABI, this.signer);

//       contract
//         .once("EndEvent", (addr, attendance, event) => eventCallback(event))
//         .once("error", console.error);

//       // Send TX
//       contract
//         .finaliseEvent(participants)
//         .then(
//           (success: any) => resolve(success),
//           (reason: any) => reject(reason)
//         )
//         .catch((error: any) => reject(error.reason));
//     });
//   }
//   public async withdraw(
//     meetingAddress: string,
//     eventCallback: (event: any) => void
//   ): Promise<string> {
//     return new Promise<string>(async (resolve, reject) => {
//       const contract = new ethers.Contract(meetingAddress, this.meetingABI, this.signer);

//       contract
//         .once("WithdrawEvent", (addr, event) => eventCallback(event))
//         .once("error", console.error);

//       // Send TX
//       contract
//         .withdraw()
//         .then(
//           (success: any) => resolve(success),
//           (reason: any) => reject(reason)
//         )
//         .catch((error: any) => reject(error.reason));
//     });
//   }

//   public async nextMeeting(
//     _clubAddress: string,
//     _startDate: number,
//     _endDate: number,
//     _minStake: number,
//     _registrationLimit: number,
//     eventCallback: (event: any) => void
//   ): Promise<string> {
//     return new Promise<string>(async (resolve, reject) => {
//       const clubContract = new ethers.Contract(_clubAddress, this.clubABI, this.signer);

//       clubContract
//         .once("NewMeetingEvent", (ownerAddr, contractAddr, event) => eventCallback(event))
//         .once("error", console.error);

//       clubContract
//         .deployMeeting(_startDate, _endDate, ethers.utils.parseEther(String(_minStake)), _registrationLimit)
//         .then(
//           (success: any) => resolve(success),
//           (reason: any) => reject(reason)
//         )
//         .catch((error: any) => reject(error.message));
//     });
//   }

//   public async pause(
//     _clubAddress: string,
//     _meeting: string,
//     _pauseUntil: number,
//     eventCallback: (event: any) => void
//   ): Promise<string> {
//     return new Promise<string>(async (resolve, reject) => {
//       const meetingContract = new ethers.Contract(_meeting, this.meetingABI, this.signer);
//       const clubContract = new ethers.Contract(_clubAddress, this.clubABI, this.signer);

//       meetingContract
//         .once("Pause", (pauseUntil, event) => eventCallback(event))
//         .once("error", console.error);

//       clubContract
//         .pause(_meeting, _pauseUntil)
//         .then(
//           (success: any) => resolve(success),
//           (reason: any) => reject(reason)
//         )
//         .catch((error: any) => reject(error.message));
//     });
//   }

//   public async proposeAdminChange(
//     _clubAddress: string,
//     _meeting: string,
//     _addAdmins: string[],
//     _removeAdmins: string[],
//     eventCallback: (event: any) => void
//   ): Promise<string> {
//     return new Promise<string>(async (resolve, reject) => {
//       const clubContract = new ethers.Contract(_clubAddress, this.clubABI, this.signer);

//       clubContract
//         .once("ProposeAdminChange", (counter, meeting, addAdmins, removeAdmins, event) => eventCallback(event))
//         .once("error", console.error);

//       clubContract
//         .proposeAdminChange(_meeting, _addAdmins, _removeAdmins)
//         .then(
//           (success: any) => resolve(success),
//           (reason: any) => reject(reason)
//         )
//         .catch((error: any) => reject(error.message));
//     });
//   }

//   public async approveProposal(
//     _clubAddress: string,
//     _id: number,
//     eventCallback: (event: any) => void
//   ): Promise<string> {
//     return new Promise<string>(async (resolve, reject) => {
//       const clubContract = new ethers.Contract(_clubAddress, this.clubABI, this.signer);

//       clubContract
//         .once("ApproveProposal", (proposalId, event) => eventCallback(event))
//         .once("error", console.error);

//       clubContract
//         .approveProposal(_id)
//         .then(
//           (success: any) => resolve(success),
//           (reason: any) => reject(reason)
//         )
//         .catch((error: any) => reject(error.message));
//     });
//   }

//   public async executeProposal(
//     _clubAddress: string,
//     _id: number,
//     eventCallback: (event: any) => void
//   ): Promise<string> {
//     return new Promise<string>(async (resolve, reject) => {
//       const clubContract = new ethers.Contract(_clubAddress, this.clubABI, this.signer);

//       clubContract
//         .once("ProposalExecuted", (target, addAdmins, removeAdmins, event) => eventCallback(event))
//         .once("error", console.error);

//       clubContract
//         .executeProposal(_id)
//         .then(
//           (success: any) => resolve(success),
//           (reason: any) => reject(reason)
//         )
//         .catch((error: any) => reject(error.message));
//     });
//   }
}