#!/bin/bash

# Creator NFT Marketplace - Demo Script
# This script demonstrates the two core features

CONTRACT_ID="CAJYYKUQLTRZZ4V7ENSQBEKZX26IWAXPZ4EFBYV42Z4DA27GQZHY7766"
NETWORK="testnet"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 Creator NFT Marketplace Demo"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check contract name
echo "📝 Contract Info:"
stellar contract invoke --id $CONTRACT_ID --source user --network $NETWORK -- name
stellar contract invoke --id $CONTRACT_ID --source user --network $NETWORK -- symbol
echo ""

# Feature 1: Mint NFT
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ FEATURE 1: Minting Subscription NFT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Creator: user"
echo "Subscriber: subscriber"
echo "Tier: gold"
echo "Duration: 100,000 ledgers (~5.7 days)"
echo ""

TOKEN_ID=$(stellar contract invoke \
  --id $CONTRACT_ID \
  --source user \
  --network $NETWORK \
  -- mint \
  --creator user \
  --subscriber subscriber \
  --tier gold \
  --duration-ledgers 100000)

echo "✅ Minted NFT #$TOKEN_ID"
echo ""

# Get NFT details
echo "📋 NFT Details:"
stellar contract invoke --id $CONTRACT_ID --source user --network $NETWORK -- get_nft --token-id 1
echo ""

# Feature 2: Access Verification
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 FEATURE 2: Access Verification"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Checking if 'subscriber' has access to 'user' content..."
echo ""

HAS_ACCESS=$(stellar contract invoke \
  --id $CONTRACT_ID \
  --source user \
  --network $NETWORK \
  -- has_access \
  --user subscriber \
  --creator user)

if [ "$HAS_ACCESS" = "true" ]; then
  echo "✅ Access Granted! Subscriber can view creator's content."
else
  echo "❌ Access Denied!"
fi
echo ""

# Check total supply
echo "📊 Total NFTs Minted:"
stellar contract invoke --id $CONTRACT_ID --source user --network $NETWORK -- total_supply
echo ""

# Check ownership
echo "👤 Owner of NFT #1:"
stellar contract invoke --id $CONTRACT_ID --source user --network $NETWORK -- owner_of --token-id 1
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Demo Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔗 View on Explorer:"
echo "https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
echo ""
