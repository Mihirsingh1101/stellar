# 🔐 Freighter Wallet Integration Guide

## Optional Enhancement: Add Freighter Support

This is **NOT required** for demo, but here's how you'd do it for production.

---

## Why Add Freighter?

- ✅ More secure (keys never leave browser extension)
- ✅ Better UX (click to sign, no terminal)
- ✅ Industry standard for Stellar apps
- ✅ Users trust established wallets

---

## Installation

### Step 1: User installs Freighter
Browser extension: https://www.freighter.app/

### Step 2: Add Freighter to your frontend

```bash
cd frontend
npm install @stellar/freighter-api
```

### Step 3: Update App.jsx

```javascript
import { isConnected, getPublicKey, signTransaction } from "@stellar/freighter-api";

// Replace generateWallet() with:
const connectFreighter = async () => {
  // Check if Freighter is installed
  if (await isConnected()) {
    try {
      const publicKey = await getPublicKey();
      setWallet({ publicKey, isFreighter: true });
      checkBalance(publicKey);
      alert(`✅ Connected to Freighter!\n\nAddress: ${publicKey}`);
    } catch (error) {
      alert('❌ Failed to connect. Please approve in Freighter.');
    }
  } else {
    alert('⚠️ Freighter wallet not found!\n\nInstall: https://www.freighter.app/');
  }
};

// For minting with Freighter:
const mintNFTWithFreighter = async () => {
  try {
    // Build transaction
    const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
    const account = await server.loadAccount(wallet.publicKey);
    
    const contract = new StellarSdk.Contract(CONTRACT_ID);
    
    const transaction = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: StellarSdk.Networks.TESTNET,
    })
      .addOperation(contract.call('mint', 
        new StellarSdk.Address(wallet.publicKey),
        new StellarSdk.Address(subscriberAddress),
        StellarSdk.nativeToScVal(tier, { type: 'symbol' }),
        StellarSdk.nativeToScVal(duration, { type: 'u32' })
      ))
      .setTimeout(30)
      .build();
    
    // Sign with Freighter
    const signedXdr = await signTransaction(transaction.toXDR(), {
      network: "TESTNET",
      accountToSign: wallet.publicKey,
    });
    
    // Submit to network
    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      StellarSdk.Networks.TESTNET
    );
    
    const result = await server.submitTransaction(signedTx);
    alert('✅ NFT Minted! Transaction: ' + result.hash);
    
  } catch (error) {
    console.error('Mint error:', error);
    alert('❌ Failed to mint: ' + error.message);
  }
};
```

### Step 4: Update UI

```javascript
// Replace wallet creation button with:
{!wallet ? (
  <div>
    <button onClick={connectFreighter} className="btn btn-primary">
      🔗 Connect Freighter Wallet
    </button>
    <span style={{ margin: '0 10px' }}>or</span>
    <button onClick={generateWallet} className="btn btn-secondary">
      🧪 Create Test Wallet
    </button>
  </div>
) : (
  <div className="wallet-info">...</div>
)}
```

---

## Comparison

### Current (Built-in Wallet):
```javascript
1. Click "Create Test Wallet"
2. Keys generated in browser
3. Saved to localStorage
4. Copy terminal command to mint
5. Run command manually
```

### With Freighter:
```javascript
1. Click "Connect Freighter"
2. Approve in extension
3. Click "Mint NFT" button
4. Approve transaction in Freighter
5. Done! No terminal needed
```

---

## When to Use Which

### Use Built-in Wallet:
- ✅ Demo/prototype
- ✅ Quick testing
- ✅ Hackathons
- ✅ Learning Web3
- ✅ When users don't have wallets

### Use Freighter:
- ✅ Production app
- ✅ Real money (mainnet)
- ✅ Better security
- ✅ Professional UX
- ✅ User expectations

---

## Your Current Setup is Fine!

For a 5-6 hour demo project, **built-in wallet is perfect**. You can:
- Generate wallets instantly
- Fund with Friendbot
- Show blockchain interaction
- Demonstrate all features

**Freighter is an enhancement, not a requirement!**

---

## Bottom Line

**Question:** Do I need Freighter?  
**Answer:** No, not for demo. Your built-in wallet works great!

**Question:** Is my project Web3?  
**Answer:** Yes! You're using real blockchain, real keys, decentralized contracts.

**Question:** What about Friendbot?  
**Answer:** Testnet-only tool. On mainnet, users buy real XLM.

**Your project is Web3-ready!** 🚀
