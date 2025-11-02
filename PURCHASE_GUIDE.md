# 🛍️ How to Purchase Creator NFTs

## Complete Purchase Guide

---

## 🎯 Quick Answer

There are **3 ways** to purchase creator subscription NFTs:

1. **Interactive Script** (Easiest) - `./purchase.sh`
2. **Website** (Visual) - http://localhost:3000
3. **Manual Command** (Advanced) - Direct CLI

---

## Method 1: Interactive Purchase Script ⭐ RECOMMENDED

### **Run the Purchase Script:**

```bash
cd /home/ekansh/Desktop/stellar/NFT
./purchase.sh
```

### **What It Does:**
1. ✅ Creates/checks buyer wallet
2. ✅ Funds with testnet XLM
3. ✅ Shows available creators
4. ✅ Lets you choose subscription
5. ✅ Mints NFT automatically
6. ✅ Verifies access

### **Example Session:**
```
🛍️  Creator NFT Purchase Guide

✅ Your wallet address: GBVOW5FK355K...

📋 Available Creator Subscriptions:

1. 📝 Alice (Writer)     - Gold Tier   - 5 XLM/month
2. 🎨 Bob (Artist)       - Silver Tier - 3 XLM/month
3. 🎵 Carol (Musician)   - Gold Tier   - 5 XLM/month
4. 🎓 Dave (Educator)    - Bronze Tier - 1 XLM/month

Which creator would you like to subscribe to? (1-4): 1

🛒 Purchase Summary
Creator:     Alice (Writer)
Tier:        gold
Price:       5 XLM

Proceed with purchase? (y/n): y

🔨 Minting NFT on Stellar Blockchain...
✅ Purchase Successful!
```

---

## Method 2: Via Website (UI)

### **Step 1: Open Website**
```bash
# Make sure web server is running
cd /home/ekansh/Desktop/stellar/NFT/frontend
npm run dev

# Then open: http://localhost:3000
```

### **Step 2: Create Wallet**
1. Click **"🚀 Create Test Wallet"**
2. Wallet auto-funded with 10,000 XLM
3. See balance in header

### **Step 3: Browse Marketplace**
1. Click **"🛍️ Marketplace"** tab
2. See 4 available creators
3. Each shows:
   - Creator name & avatar
   - Tier (Bronze/Silver/Gold)
   - Price in XLM
   - Description of perks

### **Step 4: Purchase**
1. Click **"Buy Now"** on any NFT
2. Confirm purchase dialog
3. For now, follow the terminal command shown
4. NFT will appear in "My NFTs" tab

### **Step 5: View Your NFTs**
1. Go to **"🎫 My NFTs"** tab
2. See all owned subscriptions
3. Click **"Access Content"** to use

---

## Method 3: Manual Command (Advanced)

### **For Direct CLI Purchase:**

```bash
# 1. Create buyer wallet (if needed)
stellar keys generate buyer --network testnet
stellar keys fund buyer --network testnet

# 2. Get buyer address
stellar keys address buyer

# 3. Mint NFT (creator must run this)
stellar contract invoke \
  --id CAJYYKUQLTRZZ4V7ENSQBEKZX26IWAXPZ4EFBYV42Z4DA27GQZHY7766 \
  --source user \
  --network testnet \
  -- mint \
  --creator user \
  --subscriber buyer \
  --tier gold \
  --duration-ledgers 100000

# 4. Verify you have access
stellar contract invoke \
  --id CAJYYKUQLTRZZ4V7ENSQBEKZX26IWAXPZ4EFBYV42Z4DA27GQZHY7766 \
  --source buyer \
  --network testnet \
  -- has_access \
  --user buyer \
  --creator user
```

---

## 💡 Understanding the Purchase Flow

### **Current Implementation (Demo):**
```
User → Browse Website → Choose NFT → Get Command → Run in Terminal → NFT Minted
```

### **In Production (Future):**
```
User → Browse Website → Click Buy → Sign with Wallet → Auto-Mint → Done
```

**Why terminal for now?**
- Simplified demo
- Shows blockchain interaction clearly
- No wallet extension needed
- Easy to understand what's happening

---

## 🎫 Available Subscriptions

| Creator | Tier | Price | Duration | Perks |
|---------|------|-------|----------|-------|
| 📝 Alice (Writer) | Gold | 5 XLM | ~5.7 days | Premium articles + Q&A |
| 🎨 Bob (Artist) | Silver | 3 XLM | ~5.7 days | Exclusive art drops |
| 🎵 Carol (Musician) | Gold | 5 XLM | ~5.7 days | Unreleased tracks + BTS |
| 🎓 Dave (Educator) | Bronze | 1 XLM | ~5.7 days | Coding tutorials |

---

## 🔐 After Purchase: Verify Access

### **Check if you own NFT:**
```bash
stellar contract invoke \
  --id CAJYYKUQLTRZZ4V7ENSQBEKZX26IWAXPZ4EFBYV42Z4DA27GQZHY7766 \
  --source buyer \
  --network testnet \
  -- has_access \
  --user buyer \
  --creator user
```

**Returns:** `true` ✅ = You have access!

### **Get NFT Details:**
```bash
stellar contract invoke \
  --id CAJYYKUQLTRZZ4V7ENSQBEKZX26IWAXPZ4EFBYV42Z4DA27GQZHY7766 \
  --source buyer \
  --network testnet \
  -- get_nft \
  --token-id 1
```

---

## 🎬 Complete Demo Flow

### **1. As a Buyer:**
```bash
# Run the purchase script
./purchase.sh

# Choose a creator (e.g., option 1)
# Confirm purchase
# NFT is minted to your wallet
# Access granted automatically
```

### **2. Verify Ownership:**
```bash
# Check on website
http://localhost:3000 → "My NFTs" tab

# Or via CLI
stellar contract invoke \
  --id CAJYYKUQLTRZZ4V7ENSQBEKZX26IWAXPZ4EFBYV42Z4DA27GQZHY7766 \
  --source buyer \
  --network testnet \
  -- owner_of \
  --token-id 1
```

### **3. Access Creator Content:**
- NFT ownership verified on-chain
- Automatic access to exclusive content
- No passwords, no subscriptions
- Just hold the NFT!

---

## 🌟 Key Differences from Web2

### **Traditional (Patreon/Substack):**
❌ Monthly billing (recurring)  
❌ Platform controls access  
❌ Can't transfer subscription  
❌ 10% platform fee  
❌ Need account/password  

### **Your NFT Marketplace:**
✅ One-time purchase (time-based)  
✅ Blockchain verifies access  
✅ Can resell/transfer NFT  
✅ <1% transaction fee  
✅ Just hold NFT in wallet  

---

## 🔮 Future Enhancement: In-App Purchase

**What you'd add for full in-app purchasing:**

```javascript
// In React component
const purchaseNFT = async (creator, tier, price) => {
  // 1. Connect wallet (Freighter extension)
  const wallet = await connectFreighter()
  
  // 2. Build transaction
  const tx = await buildMintTransaction(
    creator, 
    wallet.publicKey, 
    tier
  )
  
  // 3. Sign with wallet
  const signedTx = await wallet.signTransaction(tx)
  
  // 4. Submit to blockchain
  const result = await submitTransaction(signedTx)
  
  // 5. Show success
  alert('NFT purchased! Token ID: ' + result.tokenId)
}
```

**But for demo purposes, terminal commands are perfectly fine!**

---

## 📞 Quick Commands Reference

```bash
# Purchase NFT (easiest)
./purchase.sh

# Start website
cd frontend && npm run dev

# Create wallet
stellar keys generate buyer --network testnet
stellar keys fund buyer --network testnet

# Check balance
stellar keys address buyer

# View all NFTs
stellar contract invoke --id CAJY... -- total_supply
```

---

## 🎉 Summary

**To purchase a creator NFT:**

1. **Easiest:** Run `./purchase.sh` and follow prompts
2. **Visual:** Use website at http://localhost:3000
3. **Advanced:** Run manual `stellar contract invoke` commands

**All methods result in:**
- ✅ NFT minted on Stellar blockchain
- ✅ Ownership recorded on-chain
- ✅ Automatic access to creator content
- ✅ Tradeable/transferable asset

**Try it now:**
```bash
./purchase.sh
```
