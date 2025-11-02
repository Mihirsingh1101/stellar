# 🏗️ Architecture & Workflow

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Creator NFT Marketplace                   │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐                              ┌──────────────┐
│   Creator    │                              │  Subscriber  │
│   (Seller)   │                              │   (Buyer)    │
└──────┬───────┘                              └──────┬───────┘
       │                                             │
       │ 1. Mint NFT                                 │
       │    (tier, duration)                         │
       │                                             │
       ↓                                             │
┌─────────────────────────────────────────────────────────────┐
│                                                              │
│           Soroban Smart Contract (Stellar)                  │
│                                                              │
│  ┌────────────────┐         ┌─────────────────┐            │
│  │  NFT Minting   │         │ Access Control  │            │
│  │   (Feature 1)  │         │  (Feature 2)    │            │
│  └────────────────┘         └─────────────────┘            │
│                                                              │
│  Storage:                                                    │
│  • TokenCount                                                │
│  • Token(id) → SubscriptionNFT                              │
│  • Owner mappings                                            │
│                                                              │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           │ 2. Transfer ownership
                           ↓
                    ┌──────────────┐
                    │ Subscriber   │
                    │  (New Owner) │
                    └──────┬───────┘
                           │
                           │ 3. Access content
                           ↓
                    ┌──────────────────┐
                    │ Content Platform │
                    │  (Checks NFT)    │
                    └──────────────────┘
```

---

## Data Flow

### **Minting Flow**
```
Creator → mint() → Smart Contract → Create NFT → Store on-chain
                                           ↓
                              Emit event: NFT created
                                           ↓
                              Return: token_id
```

### **Access Verification Flow**
```
User → Request Content → Content Platform
                              ↓
                    Call: has_access(user, creator)
                              ↓
                    Smart Contract checks:
                    1. User has NFT from creator?
                    2. NFT is active?
                    3. NFT not expired?
                              ↓
                    Return: true/false
                              ↓
                    Grant/Deny Access
```

### **Transfer/Secondary Market Flow**
```
Owner → transfer(token_id, to) → Smart Contract
                                       ↓
                          Verify ownership
                                       ↓
                          Update NFT.subscriber
                                       ↓
                          Emit transfer event
                                       ↓
                          New owner has access
```

---

## Smart Contract Structure

```
CreatorNFT Contract
│
├── Data Structures
│   ├── SubscriptionNFT
│   │   ├── token_id (u64)
│   │   ├── creator (Address)
│   │   ├── subscriber (Address)
│   │   ├── tier (Symbol)
│   │   ├── expiry_ledger (u32)
│   │   └── is_active (bool)
│   │
│   └── DataKey (Storage)
│       ├── TokenCount
│       └── Token(id)
│
├── Core Functions (Feature 1 & 2)
│   ├── mint() - Create NFT
│   └── has_access() - Verify access
│
└── Additional Functions
    ├── transfer() - Secondary market
    ├── cancel() - Deactivate
    ├── owner_of() - Get owner
    ├── get_nft() - Get details
    └── total_supply() - Get count
```

---

## Use Case Example

### **Scenario: Alice the Writer**

```
Step 1: Alice creates "Premium Tier" subscription
        ↓
     Alice.mint(creator=Alice, subscriber=Bob, tier="gold", duration=100000)
        ↓
     NFT #1 created

Step 2: Bob receives NFT
        ↓
     Bob now owns token_id=1
     (Paid Alice directly via Stellar payment)

Step 3: Bob visits Alice's content site
        ↓
     Site calls: has_access(Bob, Alice)
        ↓
     Contract checks: Bob has active NFT from Alice?
        ↓
     Returns: true
        ↓
     🔓 Bob unlocks premium chapters

Step 4: Bob sells NFT to Charlie
        ↓
     Bob.transfer(token_id=1, from=Bob, to=Charlie)
        ↓
     Charlie is new owner
        ↓
     Site now: has_access(Bob, Alice) = false
              has_access(Charlie, Alice) = true
        ↓
     🔓 Charlie can access, Bob cannot
```

---

## Security Features

✅ **Authorization Required**
- Only creator can mint NFTs
- Only current owner can transfer
- Auth checked via `require_auth()`

✅ **Expiry Protection**
- NFTs expire after duration
- Access denied for expired NFTs
- Current ledger checked on each access

✅ **Ownership Verification**
- On-chain proof of ownership
- Cannot forge or duplicate NFTs
- Transparent verification

✅ **Cancellation Support**
- Creator or subscriber can cancel
- Marks NFT as inactive
- Prevents unauthorized access

---

## Technical Specifications

**Blockchain:** Stellar (Soroban)  
**Language:** Rust (no_std)  
**Storage:** Persistent on-chain  
**Network:** Testnet (mainnet-ready)  
**Transaction Time:** ~5 seconds  
**Cost per mint:** <$0.01  

---

## Comparison: Web2 vs Web3

| Feature | Web2 (Patreon/Substack) | Web3 (This Project) |
|---------|------------------------|---------------------|
| Ownership | Platform owns | User owns NFT |
| Transferability | ❌ Cannot resell | ✅ Can trade/sell |
| Fees | 5-10% platform fee | <$0.01 transaction |
| Access Control | Centralized DB | On-chain verification |
| Censorship | Platform can ban | Permissionless |
| Cross-platform | Locked to platform | Works anywhere |

---

## Deployment Details

**Contract Hash:** `4c1789dbe7cfafdf562715d22b96cc76c83e520cbc97e408558ea156d32d6082`  
**Contract ID:** `CAJYYKUQLTRZZ4V7ENSQBEKZX26IWAXPZ4EFBYV42Z4DA27GQZHY7766`  
**Network:** Stellar Testnet  
**Explorer:** https://stellar.expert/explorer/testnet/contract/CAJYYKUQLTRZZ4V7ENSQBEKZX26IWAXPZ4EFBYV42Z4DA27GQZHY7766

---

## Future Integrations

```
┌─────────────────┐
│ Creator Portal  │ ← Web frontend for minting
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Smart Contract  │ ← Your current implementation
└────────┬────────┘
         │
         ├─→ IPFS (Content storage)
         ├─→ Payment Gateway (XLM/USDC)
         ├─→ DAO Governance (Voting)
         └─→ Analytics Dashboard
```
