# 🚀 Quick Start Guide

## For Judges/Reviewers (2 minutes)

### **See It Working Right Now**

1. **View Live Contract:**
   ```
   https://stellar.expert/explorer/testnet/contract/CAJYYKUQLTRZZ4V7ENSQBEKZX26IWAXPZ4EFBYV42Z4DA27GQZHY7766
   ```

2. **Run the Demo:**
   ```bash
   cd /home/ekansh/Desktop/stellar/NFT
   ./demo.sh
   ```
   
   This will show:
   - ✅ NFT minting (Feature 1)
   - ✅ Access verification (Feature 2)
   - ✅ Live testnet transactions

3. **Read the Docs:**
   - `README.md` - Full overview
   - `PITCH.md` - Presentation guide
   - `ARCHITECTURE.md` - Technical design

---

## For Developers (10 minutes)

### **Try It Yourself**

```bash
# 1. Clone/navigate to project
cd /home/ekansh/Desktop/stellar/NFT

# 2. Build the contract
stellar contract build

# 3. Create a testnet account
stellar keys generate --global mykey --network testnet
stellar keys fund mykey --network testnet

# 4. Mint an NFT
stellar contract invoke \
  --id CAJYYKUQLTRZZ4V7ENSQBEKZX26IWAXPZ4EFBYV42Z4DA27GQZHY7766 \
  --source mykey \
  --network testnet \
  -- mint \
  --creator mykey \
  --subscriber mykey \
  --tier premium \
  --duration-ledgers 50000

# 5. Check access
stellar contract invoke \
  --id CAJYYKUQLTRZZ4V7ENSQBEKZX26IWAXPZ4EFBYV42Z4DA27GQZHY7766 \
  --source mykey \
  --network testnet \
  -- has_access \
  --user mykey \
  --creator mykey
```

---

## Project Overview (30 seconds)

**What:** NFT-based subscription marketplace for creators  
**Why:** Eliminate middlemen, enable trading, give users ownership  
**How:** Soroban smart contract on Stellar  
**Status:** ✅ Working on testnet  
**Time:** Built in 5-6 hours  

---

## Key Features

1. **Mint Subscription NFTs** (Feature 1)
   - Creators issue NFTs to subscribers
   - Time-based expiry
   - Tiered access (bronze/silver/gold)

2. **Verify Access** (Feature 2)
   - Instant on-chain verification
   - Check ownership + expiry + active status
   - No centralized database

3. **Transfer/Trade** (Bonus)
   - Enable secondary market
   - Users can resell subscriptions
   - Creator royalties possible

---

## Tech Stack

```
Smart Contract:  Soroban (Rust)
Blockchain:      Stellar Testnet
Storage:         On-chain persistent
Functions:       10 implemented
Tests:           2 unit tests
```

---

## What Makes It Special

✅ **Sub-cent fees** - <$0.01 per transaction (Stellar)  
✅ **5-second confirmations** - Instant access grants  
✅ **Truly owned** - NFTs are cryptographic proof  
✅ **Tradeable** - Secondary market built-in  
✅ **Transparent** - All verifiable on-chain  

---

## Files to Review

| File | Purpose | Lines |
|------|---------|-------|
| `src/lib.rs` | Smart contract | 240 |
| `README.md` | Documentation | Full guide |
| `PITCH.md` | Presentation | Pitch deck |
| `ARCHITECTURE.md` | Design | System flow |
| `demo.sh` | Demo script | Automated |

---

## Use Cases

📝 **Writers** - Substack-style paywalls  
🎨 **Artists** - Exclusive art access  
🎓 **Educators** - Course enrollment  
🎵 **Musicians** - Unreleased tracks  
🎙️ **Podcasters** - Premium episodes  

---

## Next Steps

**Phase 1 (Done):** ✅ Core contract deployed  
**Phase 2:** Frontend (React + Stellar SDK)  
**Phase 3:** IPFS integration  
**Phase 4:** Mainnet launch  

---

## Quick Links

**Contract:** `CAJYYKUQLTRZZ4V7ENSQBEKZX26IWAXPZ4EFBYV42Z4DA27GQZHY7766`  
**Explorer:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CAJYYKUQLTRZZ4V7ENSQBEKZX26IWAXPZ4EFBYV42Z4DA27GQZHY7766)  
**Demo:** `./demo.sh`  

---

## Questions?

**Q: Is this production-ready?**  
A: Testnet deployment is complete. Mainnet requires audit + frontend.

**Q: Why Stellar vs Ethereum?**  
A: Fees. ETH makes $1-5 subscriptions unprofitable. Stellar: <$0.01.

**Q: What's the business model?**  
A: 0.5% transaction fee + premium creator tools + marketplace fee.

**Q: How long to build frontend?**  
A: 2-4 weeks for MVP (React + Freighter wallet).

---

## Try the Demo Now!

```bash
./demo.sh
```

**That's it! 🎉**
