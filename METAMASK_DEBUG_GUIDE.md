# MetaMask chainChanged Event - Debugging Guide

## Problem
The `chainChanged` event is not firing when switching networks in the new MetaMask browser extension.

## Changes Made

### 1. Updated Event Listener Implementation

**File: `src/components/AppContextProvider.tsx`**
- Added global event listeners in `useEffect` hook that runs on app mount
- Uses EIP-1193 standard event API
- Added comprehensive logging for debugging
- Added proper cleanup on unmount

**File: `src/components/login/ConnectWithMetamaskButton.tsx`**
- Removed duplicate event listener registration (now handled globally)
- Fixed deprecated `window.location.reload(true)` to `window.location.reload()`


### 2. Added Debug Tools

**File: `src/components/common/MetaMaskDebugMonitor.tsx`**
- Visual debug component showing real-time MetaMask events
- Displays current chainId and all events with timestamps
- Shows MetaMask provider capabilities

**File: `public/metamask-test.html`**
- Standalone HTML test page to verify MetaMask events work independently
- Tests if the issue is with your app or with MetaMask itself

### 3. Added to Main App

**File: `src/FundingIrysDApp.tsx`**
- Added `<MetaMaskDebugMonitor />` component to main app for debugging

## How to Test

### Method 1: Run Your App

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Open browser console (F12)

3. Look for this log on page load:
   ```
   ✅ [Global] MetaMask event listeners registered successfully
   📊 Current chainId at registration: 0x1 (1)
   ```

4. Connect with MetaMask

5. Switch networks in MetaMask

6. Check for these logs:
   ```
   🔄 [Global] chainChanged event fired!
     - new chainId (hex): 0x89
     - new chainId (decimal): 137
     - Reloading page...
   ```

7. Check the **debug panel** in the bottom-right corner - it should show events in real-time

### Method 2: Use Standalone Test Page

1. Open in browser:
   ```
   http://localhost:3000/metamask-test.html
   ```

2. Click "Connect MetaMask"

3. Switch networks in MetaMask

4. Watch the log - events should appear immediately

**If events show in the test page but NOT in your app:**
- Issue is with React/app code

**If events DON'T show in the test page:**
- Issue is with MetaMask extension itself

## Possible Issues & Solutions

### Issue 1: MetaMask Extension Update Required

**Symptoms:** Events not firing at all

**Solution:**
1. Update MetaMask to latest version
2. Go to `chrome://extensions/` (or your browser's extension page)
3. Click "Update" or remove and reinstall MetaMask

### Issue 2: Multiple Wallets Installed

**Symptoms:** Events firing from wrong wallet

**Solution:**
1. Disable all other wallet extensions (Coinbase Wallet, Phantom, etc.)
2. Only keep MetaMask enabled
3. Restart browser

### Issue 3: MetaMask Privacy Settings

**Symptoms:** Events not firing for some networks

**Solution:**
1. Open MetaMask settings
2. Go to "Experimental" or "Advanced"
3. Check if "Event Listeners" or similar setting is disabled
4. Enable and restart

### Issue 4: React StrictMode Double-Mount

**Symptoms:** Event listeners registered twice in development

**Solution:**
- This is normal in development mode with React 18
- Won't affect production builds
- Events should still fire correctly

### Issue 5: Browser Extension Conflicts

**Symptoms:** Intermittent event firing

**Solution:**
1. Test in incognito/private mode
2. Disable other extensions
3. Clear browser cache and reload

## Console Commands for Debugging

Open browser console and run these to manually test:

```javascript
// Check if MetaMask is available
console.log('MetaMask:', typeof window.ethereum);

// Check current chainId
window.ethereum.request({ method: 'eth_chainId' }).then(console.log);

// Manually add event listener
window.ethereum.on('chainChanged', (chainId) => {
  console.log('🔄 Manual test - chainChanged:', chainId);
});

// Check if events are registered
console.log('Event listeners:', window.ethereum._events);
```

## Expected Console Output

After connecting and switching from Ethereum Mainnet (1) to Polygon (137):

```
🔍 Initializing MetaMask event listeners...
  - Provider type: object
  - Has .on(): true
  - Has .request(): true
✅ [Global] MetaMask event listeners registered successfully
📊 Current chainId at registration: 0x1 (1)
ℹ️ MetaMask event listeners are managed globally by AppContextProvider
🔄 [Global] chainChanged event fired!
  - new chainId (hex): 0x89
  - new chainId (decimal): 137
  - Reloading page...
```

## Known MetaMask Versions

**Working versions:**
- MetaMask v11.0.0+
- MetaMask v12.0.0+
- MetaMask Flask (experimental)

**Known issues:**
- MetaMask v10.x and below may have event listener bugs
- Some versions require `removeAllListeners()` instead of `removeListener()`

## Next Steps If Still Not Working

1. **Check MetaMask version:**
   - Open MetaMask → Settings → About
   - If < v11.0.0, update it

2. **Try the standalone test page:**
   - Open `http://localhost:3000/metamask-test.html`
   - If events work there, the issue is in React app
   - If events don't work there, the issue is MetaMask itself

3. **Check browser console for errors:**
   - Look for any red errors about event listeners
   - Look for warnings about deprecated APIs

4. **Test with a fresh MetaMask install:**
   - Create a new browser profile
   - Install only MetaMask (no other extensions)
   - Test if events work there

5. **Check MetaMask GitHub issues:**
   - Search: https://github.com/MetaMask/metamask-extension/issues
   - Look for recent issues about `chainChanged` event

## Technical Details

### EIP-1193 Ethereum Provider API

Modern MetaMask implements EIP-1193 which defines:

- `ethereum.request({ method, params })` - RPC calls
- `ethereum.on(eventName, handler)` - Subscribe to events
- `ethereum.removeListener(eventName, handler)` - Unsubscribe

**Standard Events:**
- `chainChanged` - Network switched
- `accountsChanged` - Account switched
- `connect` - Connected to network
- `disconnect` - Disconnected from network

### Event Payload

```typescript
// chainChanged
(chainId: string) => void  // hex string like "0x1"

// accountsChanged
(accounts: string[]) => void  // array of addresses

// connect
(connectInfo: { chainId: string }) => void

// disconnect
(error: ProviderRpcError) => void
```

## Files Modified

1. `src/components/AppContextProvider.tsx` - Global event listeners
2. `src/components/login/ConnectWithMetamaskButton.tsx` - Removed duplicates
3. `src/utils/web3-utils.ts` - Direct MetaMask chainId reading
4. `src/components/common/MetaMaskDebugMonitor.tsx` - Debug UI
5. `src/FundingIrysDApp.tsx` - Added debug monitor
6. `public/metamask-test.html` - Standalone test page

## Rollback (If Needed)

To remove the debug monitor from production:

```typescript
// In FundingIrysDApp.tsx, replace:
<MetaMaskDebugMonitor />

// With:
{import.meta.env.DEV && <MetaMaskDebugMonitor />}
```

This will only show the monitor in development mode.

