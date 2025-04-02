"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ArrowUpDown, Calculator, Info, LogOut, Moon, Sun, Wallet } from "lucide-react"
import { ThemeProvider } from "@/components/theme-provider"
import { connectWalletContract, getTokenBalanceIDRX } from "./connect/connect"

export default function TokenSwapPage() {
  const [connected, setConnected] = useState(false)
  const [fromToken, setFromToken] = useState("IDRX")
  const [toToken, setToToken] = useState("USDC")
  const [amount, setAmount] = useState("")
  const [theme, setTheme] = useState("light")
  const [expectedOutput, setExpectedOutput] = useState("0.0")
  const [exchangeRate, setExchangeRate] = useState("0.0")

  // Mock exchange rates (in a real app, these would come from an API or blockchain)
  const exchangeRates = {
    "IDRX-USDC": 0.000065, // 1 IDRX = 0.000065 USDC
    "IDRX-EURC": 0.00006, // 1 IDRX = 0.000060 EURC
    "USDC-IDRX": 15384.62, // 1 USDC = 15384.62 IDRX
    "USDC-EURC": 0.92, // 1 USDC = 0.92 EURC
    "EURC-IDRX": 16666.67, // 1 EURC = 16666.67 IDRX
    "EURC-USDC": 1.09, // 1 EURC = 1.09 USDC
  }

  // Calculate expected output when amount, fromToken, or toToken changes
  useEffect(() => {
    if (amount && !isNaN(Number(amount)) && Number(amount) > 0) {
      const pair = `${fromToken}-${toToken}`
      const rate = exchangeRates[pair] || 0
      const output = Number(amount) * rate
      setExchangeRate(rate.toFixed(6))
      setExpectedOutput(output.toFixed(6))
    } else {
      setExpectedOutput("0.0")
      setExchangeRate("0.0")
    }
  }, [amount, fromToken, toToken])

  // Initialize theme from localStorage if available
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark")
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Mock function to simulate wallet connection
  const connectWallet = async () => {
    // In a real app, this would use ethers.js or web3.js to connect to MetaMask or other wallets
    console.log("Connecting wallet...")
    setConnected(true)
  }

  // Mock function to simulate wallet disconnection
  const disconnectWallet = () => {
    console.log("Disconnecting wallet...")
    setConnected(false)
  }

  // Mock function to simulate token swap
  const swapTokens = async () => {
    if (!connected) {
      alert("Please connect your wallet first")
      return
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      alert("Please enter a valid amount")
      return
    }

    console.log(`Swapping ${amount} ${fromToken} to ${toToken}`)
    alert(`Swap initiated: ${amount} ${fromToken} to ${expectedOutput} ${toToken}`)
  }

  // Function to switch the from and to tokens
  const switchTokens = () => {
    const temp = fromToken
    setFromToken(toToken)
    setToToken(temp)
  }



  // connect smart contract
  async function checkMyTokenBalance() {
    const signer = await connectWalletContract();
    if (!signer) return;
  
    const walletAddress = await signer.getAddress();
    getTokenBalanceIDRX(walletAddress);
  }

  console.log('checkMyTokenBalance', checkMyTokenBalance)


  return (
    <ThemeProvider attribute="class" defaultTheme={theme}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200" >
        <div className="absolute top-4 right-4 flex items-center space-x-2">
          {!connected ? (
            <Button
              onClick={connectWallet}
              size="sm"
              className="whitespace-nowrap bg-blue-700 hover:bg-blue-800 text-white dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="text-sm bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 px-3 py-1 rounded-md border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 font-medium flex items-center">
                <span className="mr-2">Connected</span>
                <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400"></div>
              </div>
              <Button
                onClick={disconnectWallet}
                variant="outline"
                size="sm"
                className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20 dark:text-red-400"
              >
                <LogOut className="mr-1 h-3 w-3" />
                Disconnect
              </Button>
            </div>
          )}
          <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        <Card className="w-full max-w-md border dark:border-gray-700 dark:bg-gray-800">
          <CardHeader>
            <div>
              <CardTitle className="text-2xl dark:text-white">Swap Tokens</CardTitle>
              <CardDescription className="dark:text-gray-400">Exchange between IDRX, USDC, and EURC</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              {connected && (
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2">
                  <h3 className="text-sm font-medium mb-2 dark:text-gray-200">Available Balance</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                      <span className="text-xs text-gray-500 dark:text-gray-400">IDRX</span>
                      <span className="font-medium dark:text-white">1,250.00</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                      <span className="text-xs text-gray-500 dark:text-gray-400">USDC</span>
                      <span className="font-medium dark:text-white">85.50</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600">
                      <span className="text-xs text-gray-500 dark:text-gray-400">EURC</span>
                      <span className="font-medium dark:text-white">42.75</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-gray-300">From</label>
                <div className="flex space-x-2">
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="w-[120px] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent className="dark:border-gray-600 dark:bg-gray-700">
                      <SelectItem value="IDRX">IDRX</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="EURC">EURC</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="0.0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  />
                </div>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={switchTokens}
                  className="rounded-full h-8 w-8 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium dark:text-gray-300">To</label>
                <div className="flex space-x-2">
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="w-[120px] dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent className="dark:border-gray-600 dark:bg-gray-700">
                      <SelectItem value="IDRX">IDRX</SelectItem>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="EURC">EURC</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="0.0"
                    disabled
                    value={expectedOutput}
                    className="flex-1 bg-gray-50 dark:bg-gray-600 dark:border-gray-600 dark:text-gray-300"
                  />
                </div>
              </div>

              {/* Expected calculation section */}
              {amount && Number(amount) > 0 && (
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                  <div className="flex items-center mb-2">
                    <Calculator className="h-4 w-4 text-blue-500 dark:text-blue-400 mr-2" />
                    <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Expected Calculation</h3>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Exchange Rate:</span>
                      <span className="font-medium dark:text-gray-200">
                        1 {fromToken} = {exchangeRate} {toToken}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Expected Output:</span>
                      <span className="font-medium dark:text-gray-200">
                        {expectedOutput} {toToken}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Info className="h-3 w-3 mr-1" />
                      <span>Rate includes 0.3% swap fee</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={swapTokens}
              className="w-full dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
              disabled={!connected || !amount}
            >
              Swap
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ThemeProvider>
  )
}

