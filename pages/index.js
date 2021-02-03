import Head from 'next/head'
import { useState } from 'react'
const Mnemonic = require('bitcore-mnemonic');

const cx = require('classnames');

export default function Home() {
  const [input, setInput] = useState("");
  const [covering, setCovering] = useState(true);
  const [converted, setConverted] = useState(null)
  const [isValid, setIsValid] = useState(true);
  const [message, setMessage] = useState(null);

  const coverSeed = (val) => {
    const converted = [];
    val.split(" ").forEach(word => {
      const wordSearch = word[0]+word[1];
      const wordList = Mnemonic.Words.ENGLISH.filter(w => w.startsWith(wordSearch));
      console.log(wordList);
      converted.push(`${wordSearch}${wordList.indexOf(word)}`)
    });
    return converted;
  }

  const uncoverSeed = (val) => {
    const converted = [];
    val.split("-").forEach(word => {
      const wordSearch = word[0]+word[1];
      const wordList = Mnemonic.Words.ENGLISH.filter(w => w.startsWith(wordSearch));
      converted.push(`${wordList[word.substring(2)]}`)
    });
    return converted;
  }

  const INVALID_MESSAGE = "The seed phrase you entered contains invalid mnemonic word(s)"
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center w-screen">
        <div className="md:w-2/5 sm:w-screen">
          <label for="seedphrase" className="block text-sm font-medium text-gray-700">
            {covering ? "Seed Phrase" : "Seed Cover"}
          </label>
          <div className="mt-1 flex flex-col space-y-2">
            <textarea
              id="seedphrase"
              name="seedphrase" rows="2"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Paste your 12-24 seed words inside this box"
              value={input}
              onBlur={(e) => {
                const val = e.target.value.trim();
                if (e.target.value.length == 0){ 
                  setConverted("");
                  setMessage(null);
                  return
                }

                if(covering){
                  const isValid = Mnemonic.isValid(val);
                  setIsValid(isValid);
                  if (!isValid){
                    setMessage(INVALID_MESSAGE);
                  } else {
                    const converted = coverSeed(val);
                    setMessage("");
                    setConverted(converted.join("-"))
                  }
                } else {
                  const converted = uncoverSeed(val);
                  setMessage("");
                  setConverted(converted.join(" "))
                }
                
              }}
              onChange={(e) => setInput(e.target.value)}
            ></textarea>
            
            <div className="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" 
                onClick={() => {
                  setCovering(!covering);
                  setConverted("")
                }}
                className="w-6 h-6 cursor-pointer" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>

            <textarea
              id="coverphrase"
              name="coverphrase" rows="2"
              className="shadow-sm focus:ring-0 focus:border-none bg-gray-200 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
              //placeholder="Paste your 12-24 seed words inside this box" 
              disabled
              value={converted}
            >{converted}</textarea>
            {message && <p className={cx(" pb-2 text-xs text-gray-500", { "text-red-500": !isValid })}>
              {message}
            </p>}
            {/* <div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => {
                  const seedList = seedWords.trim().split(" ");
                  const isValid = Mnemonic.isValid(seedWords.trim());
                  if (!isValid) setMessage(INVALID_MESSAGE);
                  console.log(seedList);
                }}
                disabled={!isValid}
              >
                Convert
            </button>
            </div> */}
          </div>
        </div>
      </main>

      {/* <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <img src="/vercel.svg" alt="Vercel Logo" className="h-4 ml-2" />
        </a>
      </footer> */}
    </div>
  )
}
