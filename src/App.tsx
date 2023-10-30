import { useEffect, useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import contractABI from "../abi.json";
import { ethers } from "ethers";
import { Icon } from "@iconify/react";

const contractAddress = "0xD65E00C79E3C5ec45f548E76492E83EbDEE60c0f";

function App() {
  // const [count, setCount] = useState(0);
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState();
  const [tweet, setTweet] = useState("");
  const [allTweets, setAllTweets] = useState([]);
  //@ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(account);

  const isWalletConnected = async () => {
    const accounts = await provider.listAccounts();
    return accounts.length > 0;
  };

  let contract = new ethers.Contract(contractAddress, contractABI, signer);


  // const provider = new ethers.providers.Web3Provider(window.ethereum);

  async function connectWallet() {
    //@ts-ignore
    if (window.ethereum) {
      // 1️⃣ Request Wallet Connection from Metamask
      // ANSWER can be found here: https://docs.metamask.io/wallet/get-started/set-up-dev-environment/
      // const accounts = YOUR CODE

      // setConnected(accounts[0]);
      const a = await provider.send("eth_requestAccounts", []);
      setAccount(a[0]);
      setConnected(true);
      console.log(account);
    } else {
      console.error("No web3 provider detected");
      //@ts-ignore
      document.getElementById("connectMessage").innerText =
        "No web3 provider detected. Please install MetaMask.";
    }
  }

  async function createTweet() {
    try {
      //@ts-ignore
      // console.log("FUNCTIONS", contract.interface.forEachFunction((f)=>console.log(f)))
      await contract.createTweet(tweet);
      alert("Tweet Created");
      setTweet("");

      // 4️⃣ call the contract createTweet method in order to crete the actual TWEET
      // HINT: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#methods-mymethod-send
      // use the "await" feature to wait for the function to finish execution
      // what is await? https://javascript.info/async-await
      // 7️⃣ Uncomment the displayTweets function! PRETTY EASY 🔥
      // GOAL: reload tweets after creating a new tweet
      // displayTweets(accounts[0]);
    } catch (error) {
      console.error("User rejected request:", error);
    }
  }

  async function likeTweet(address: string, id: any) {
    try {
      await contract.likeTweet(address, id);
    } catch (error) {
      console.error("User rejected request:", error);
    }
  }

  async function getAllTweets() {
    try {
      //@ts-ignore
      // console.log("FUNCTIONS", contract.interface.forEachFunction((f)=>console.log(f)))

      // console.log("Tweets Gotten", allTweets);
      const t = await contract.getAllTweets();
      setAllTweets(t);

      // 4️⃣ call the contract createTweet method in order to crete the actual TWEET
      // HINT: https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#methods-mymethod-send
      // use the "await" feature to wait for the function to finish execution
      // what is await? https://javascript.info/async-await
      // 7️⃣ Uncomment the displayTweets function! PRETTY EASY 🔥
      // GOAL: reload tweets after creating a new tweet
      // displayTweets(accounts[0]);
    } catch (error) {
      console.error("User rejected request:", error);
    }
  }
  getAllTweets();
  // useEffect(() => {
  //   getAllTweets();
  // }, []);

  async function walletConnection() {
    await isWalletConnected().then((connected) => {
      if (connected) {
        console.log("Wallet is connected");
        setConnected(true);
        // metamask is connected
      } else {
        console.log("Wallet is not connected");
        setConnected(false);
        // metamask is not connected
      }
    });
  }

  useEffect(() => {
    walletConnection();
  }, []);

  const handleMessageChange = (event: any) => {
    // 👇️ access textarea value
    setTweet(event.target.value);
    console.log(event.target.value);
  };

  return (
    <main className=" bg-slate-100 flex flex-col flex-1 w-screen h-screen pb-10 items-center overflow-y-scroll">
      <section className="bg-white flex flex-col w-[70%] h-fit p-10 mt-10 rounded-xl gap-y-6">
        <p children={"X DApp"} className="text-3xl font-bold" />

        <button
          children={`${connected ? "Connected" : "Connect Wallet"}`}
          onClick={() => connectWallet()}
          className={`${
            connected ? "bg-green-600" : " bg-neutral-900 hover:bg-neutral-700"
          } text-white rounded-2xl p-4  border-none focus:outline-none`}
        />

        {connected ? (
          <div>
            <textarea
              name="tweet"
              id="tweet"
              className="h-40 w-full outline-[0.5px] border-2 border-neutral-300 rounded-xl focus:outline-neutral-900 p-5 text-start"
              placeholder="What's happening?"
              value={tweet}
              onChange={handleMessageChange}
            />

            <button
              className="w-48 h-14 bg-neutral-900 hover:bg-neutral-700 text-white rounded-full mt-4 focus:outline-none"
              children={"Tweet"}
              onClick={createTweet}
            />
          </div>
        ) : null}
      </section>

      <section className="bg-white flex flex-col w-[70%] h-[680px] p-10 mt-10 rounded-xl gap-y-6">
        <p
          className="text-start text-2xl font-bold text-neutral-900"
          children={"Posts"}
        />
        <div className="overflow-y-scroll gap-y-6 flex flex-col h-full">
          {allTweets.map((tweet: any) => {
            return (
              <div className="flex flex-row gap-x-4 py-10 border-[1px] border-neutral-300 rounded-2xl h-96 items-start p-5">
                <img
                  className="w-10 h-10 rounded-full"
                  src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                />
                <div className="flex flex-col items-start gap-y-3">
                  <p
                    children={tweet.author}
                    className="text-neutral-900 font-bold w-10"
                  />
                  <p children={tweet.content} />

                  <div className="flex flex-row items-center gap-x-4">
                    <button className="bg-transparent" onClick={() => likeTweet(tweet.author, JSON.parse(tweet.id))}>
                      <Icon
                        icon={"mdi:heart"}
                        className="w-6 h-6"
                        color="black"
                      />
                    </button>

                    <p children={JSON.parse(tweet.likes)}/>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}

export default App;
