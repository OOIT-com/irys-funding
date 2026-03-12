# Network Detection Issue - Debugging Guide
## Problem
App always showed "Avalanche Testnet" regardless of MetaMask's actual network.
chainChanged event wasn't firing when switching networks in MetaMask.
## Changes Made
### 1. Enhanced web3-utils.ts
- Always uses MetaMask as source of truth for chainId
- Added detailed logging
- Shows warnings when Web3 and MetaMask don't match
### 2. Enhanced ConnectWithMetamaskButton.tsx
- Double-checks chainId before creating session
- Makes fresh MetaMask request immediately before connection
- Uses freshest value if mismatch detected
### 3. Enhanced AppContextProvider.tsx
- Better event listener logging
- 100ms delay before reload to ensure MetaMask has fully switched
- Logs both chainId and accounts at startup
### 4. Enhanced IrysAccess.ts
- Shows which network/currency is detected
- Logs mainnet vs devnet usage
- Helps identify wrong network being used
### 5. NEW: NetworkD### 5. NEW: NetworkD### 5- Shows session chainId vs MetaMask chainId in real-time
- Visual warning when mismatch detected
- Refresh and reload buttons
- Added to top of Funding Irys page
## Testing
1. Run: npm run dev
2. Open browser console (F12)
3. Connect with MetaMask
4. Check Network Diagnostics panel at top of page
5. Switch networks in MetaMask
6. Watch console for chainChanged event
7. Verify page reloads and shows correct network
## Expected Console Logs
On connect:
```
🔍 getChainId() called:
  - MetaMask chainId (hex): 0x89
  - MetaMask chainId (decimal): 137
```
On network switch:
```
🔄 [Global] chainChanged event fired!
  - new chainId (hex): 0xa869
  - new chainId (decimal): 43113
  - Reloading page in 100ms...
```
## Troubleshooting
If chainChanged still doesn't fire:
- Check MetaMask version (needs v10.0+)
- Try standalone test: http://localhost:5173/metamask-test.html
- Check for other wallet extensions interfering
- Try clean browser profile with only MetaMask
If network still wrong:
- Check Network Diagnostics panel (shows mismatch)
- Look for "🔍 getWebIrys() initialization:" in console
- Force reconnect: disconnect in MetaMask, refresh, reconnect
