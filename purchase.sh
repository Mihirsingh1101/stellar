#!/bin/bash

# NFT Purchase Script
# This script helps users buy subscription NFTs from creators

CONTRACT_ID="CAJYYKUQLTRZZ4V7ENSQBEKZX26IWAXPZ4EFBYV42Z4DA27GQZHY7766"
NETWORK="testnet"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🛍️  Creator NFT Purchase Guide"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if buyer wallet exists
if ! stellar keys address buyer 2>/dev/null; then
    echo "📝 Creating buyer wallet..."
    stellar keys generate buyer --network $NETWORK
    echo ""
    echo "💰 Funding buyer wallet with testnet XLM..."
    stellar keys fund buyer --network $NETWORK
    echo ""
fi

BUYER_ADDRESS=$(stellar keys address buyer)
echo "✅ Your wallet address: $BUYER_ADDRESS"
echo ""

# Show available NFTs
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Available Creator Subscriptions:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. 📝 Alice (Writer)     - Gold Tier   - 5 XLM/month"
echo "   Access: Premium articles + Q&A sessions"
echo ""
echo "2. 🎨 Bob (Artist)       - Silver Tier - 3 XLM/month"
echo "   Access: Exclusive digital art drops"
echo ""
echo "3. 🎵 Carol (Musician)   - Gold Tier   - 5 XLM/month"
echo "   Access: Unreleased tracks + BTS content"
echo ""
echo "4. 🎓 Dave (Educator)    - Bronze Tier - 1 XLM/month"
echo "   Access: Weekly coding tutorials"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Prompt for selection
read -p "Which creator would you like to subscribe to? (1-4, or 'test' for self-mint): " choice

case $choice in
    1)
        CREATOR="user"
        TIER="gold"
        PRICE="5 XLM"
        NAME="Alice (Writer)"
        ;;
    2)
        CREATOR="user"
        TIER="silver"
        PRICE="3 XLM"
        NAME="Bob (Artist)"
        ;;
    3)
        CREATOR="user"
        TIER="gold"
        PRICE="5 XLM"
        NAME="Carol (Musician)"
        ;;
    4)
        CREATOR="user"
        TIER="bronze"
        PRICE="1 XLM"
        NAME="Dave (Educator)"
        ;;
    test)
        echo ""
        echo "🧪 TEST MODE: Self-minting for demo purposes"
        CREATOR="buyer"
        TIER="gold"
        PRICE="0 XLM (test)"
        NAME="Test Subscription"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🛒 Purchase Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Creator:     $NAME"
echo "Tier:        $TIER"
echo "Price:       $PRICE"
echo "Duration:    ~5.7 days (100,000 ledgers)"
echo "Your Address: $BUYER_ADDRESS"
echo ""

read -p "Proceed with purchase? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo "❌ Purchase cancelled."
    exit 0
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔨 Minting NFT on Stellar Blockchain..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Mint the NFT
TOKEN_ID=$(stellar contract invoke \
  --id $CONTRACT_ID \
  --source $CREATOR \
  --network $NETWORK \
  -- mint \
  --creator $CREATOR \
  --subscriber buyer \
  --tier $TIER \
  --duration-ledgers 100000)

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ Purchase Successful!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🎫 Your NFT Details:"
    echo "   Token ID: $TOKEN_ID"
    echo "   Creator:  $NAME"
    echo "   Tier:     $TIER"
    echo "   Owner:    $BUYER_ADDRESS"
    echo ""
    echo "🔐 Verifying access..."
    
    HAS_ACCESS=$(stellar contract invoke \
      --id $CONTRACT_ID \
      --source buyer \
      --network $NETWORK \
      -- has_access \
      --user buyer \
      --creator $CREATOR)
    
    if [ "$HAS_ACCESS" = "true" ]; then
        echo "✅ Access Granted! You can now view exclusive content."
    else
        echo "⚠️  Access verification pending..."
    fi
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 View Your NFT:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🌐 Web Interface: http://localhost:3000"
    echo "   Go to 'My NFTs' tab to see your subscription"
    echo ""
    echo "🔗 Blockchain Explorer:"
    echo "   https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
    echo ""
    
else
    echo ""
    echo "❌ Purchase failed. Please try again."
    exit 1
fi
