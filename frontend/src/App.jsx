import React, { useState, useEffect } from 'react'
import * as StellarSdk from '@stellar/stellar-sdk'
import './App.css'

// Contract details
const CONTRACT_ID = 'CAJYYKUQLTRZZ4V7ENSQBEKZX26IWAXPZ4EFBYV42Z4DA27GQZHY7766'
const NETWORK_PASSPHRASE = StellarSdk.Networks.TESTNET
const RPC_URL = 'https://soroban-testnet.stellar.org'

function App() {
  const [activeTab, setActiveTab] = useState('marketplace')
  const [wallet, setWallet] = useState(null)
  const [balance, setBalance] = useState('0')
  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Mint form state
  const [mintForm, setMintForm] = useState({
    subscriberAddress: '',
    tier: 'gold',
    duration: '100000'
  })

  // Generate test wallet
  const generateWallet = () => {
    const keypair = StellarSdk.Keypair.random()
    const publicKey = keypair.publicKey()
    const secret = keypair.secret()
    
    setWallet({ publicKey, secret })
    localStorage.setItem('stellarWallet', JSON.stringify({ publicKey, secret }))
    
    alert(`🎉 Wallet Created!\n\nPublic Key: ${publicKey}\n\n⚠️ Save your secret key (check console)`)
    console.log('SECRET KEY (SAVE THIS):', secret)
    
    // Fund the wallet
    fundWallet(publicKey)
  }

  // Fund wallet with testnet XLM
  const fundWallet = async (publicKey) => {
    try {
      setLoading(true)
      const response = await fetch(`https://friendbot.stellar.org?addr=${publicKey}`)
      if (response.ok) {
        alert('✅ Wallet funded with 10,000 testnet XLM!')
        checkBalance(publicKey)
      }
    } catch (error) {
      console.error('Fund error:', error)
      alert('❌ Failed to fund wallet')
    } finally {
      setLoading(false)
    }
  }

  // Check wallet balance
  const checkBalance = async (publicKey) => {
    try {
      const server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org')
      const account = await server.loadAccount(publicKey)
      const xlmBalance = account.balances.find(b => b.asset_type === 'native')
      setBalance(parseFloat(xlmBalance.balance).toFixed(2))
    } catch (error) {
      console.error('Balance check error:', error)
    }
  }

  // Load wallet from storage
  useEffect(() => {
    const stored = localStorage.getItem('stellarWallet')
    if (stored) {
      const walletData = JSON.parse(stored)
      setWallet(walletData)
      checkBalance(walletData.publicKey)
    }
  }, [])

  // Mint NFT (simplified for demo)
  const mintNFT = async () => {
    if (!wallet) {
      alert('⚠️ Please create a wallet first!')
      return
    }

    if (!mintForm.subscriberAddress) {
      alert('⚠️ Please enter subscriber address!')
      return
    }

    setLoading(true)
    
    try {
      alert('🔨 Minting NFT on Stellar...\n\nThis will open your terminal to complete the transaction.')
      
      // Show command to run
      const command = `stellar contract invoke \\
  --id ${CONTRACT_ID} \\
  --source user \\
  --network testnet \\
  -- mint \\
  --creator ${wallet.publicKey} \\
  --subscriber ${mintForm.subscriberAddress} \\
  --tier ${mintForm.tier} \\
  --duration-ledgers ${mintForm.duration}`

      console.log('RUN THIS COMMAND:', command)
      
      alert(`✅ Copy this command and run in terminal:\n\n${command}`)
      
      // Simulate NFT creation for demo
      const newNFT = {
        id: Date.now(),
        creator: wallet.publicKey.substring(0, 8) + '...',
        subscriber: mintForm.subscriberAddress.substring(0, 8) + '...',
        tier: mintForm.tier,
        price: mintForm.tier === 'gold' ? '5 XLM' : mintForm.tier === 'silver' ? '3 XLM' : '1 XLM',
        active: true
      }
      
      setNfts([...nfts, newNFT])
      setMintForm({ subscriberAddress: '', tier: 'gold', duration: '100000' })
      
    } catch (error) {
      console.error('Mint error:', error)
      alert('❌ Minting failed: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Simulated marketplace NFTs
  const marketplaceNFTs = [
    {
      id: 1,
      creator: 'Alice (Writer)',
      tier: 'Gold',
      price: '5 XLM',
      description: 'Access to premium articles + monthly Q&A',
      avatar: '📝'
    },
    {
      id: 2,
      creator: 'Bob (Artist)',
      tier: 'Silver',
      price: '3 XLM',
      description: 'Exclusive digital art drops every week',
      avatar: '🎨'
    },
    {
      id: 3,
      creator: 'Carol (Musician)',
      tier: 'Gold',
      price: '5 XLM',
      description: 'Unreleased tracks + behind-the-scenes',
      avatar: '🎵'
    },
    {
      id: 4,
      creator: 'Dave (Educator)',
      tier: 'Bronze',
      price: '1 XLM',
      description: 'Weekly coding tutorials + Discord access',
      avatar: '🎓'
    }
  ]

  const buyNFT = (nft) => {
    if (!wallet) {
      alert('⚠️ Please create a wallet first!')
      return
    }
    
    const confirm = window.confirm(
      `Buy ${nft.tier} subscription from ${nft.creator}?\n\nPrice: ${nft.price}\n\nYour balance: ${balance} XLM`
    )
    
    if (confirm) {
      alert(`✅ Purchase initiated!\n\nIn production, this would:\n1. Deduct ${nft.price} from your wallet\n2. Call contract.mint() on blockchain\n3. Grant you access to ${nft.creator}'s content\n\nFor now, run the mint command in terminal.`)
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>🎨 Creator NFT Marketplace</h1>
          <p className="subtitle">Buy subscription NFTs • Support creators • Own your access</p>
          
          {wallet ? (
            <div className="wallet-info">
              <div className="wallet-badge">
                <span className="wallet-icon">💼</span>
                <div>
                  <div className="wallet-address">{wallet.publicKey.substring(0, 8)}...{wallet.publicKey.substring(wallet.publicKey.length - 4)}</div>
                  <div className="wallet-balance">{balance} XLM</div>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={generateWallet} className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Creating...' : '🚀 Create Test Wallet'}
            </button>
          )}
        </div>
      </header>

      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <button 
            className={`nav-btn ${activeTab === 'marketplace' ? 'active' : ''}`}
            onClick={() => setActiveTab('marketplace')}
          >
            🛍️ Marketplace
          </button>
          <button 
            className={`nav-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            ✨ Create NFT
          </button>
          <button 
            className={`nav-btn ${activeTab === 'my-nfts' ? 'active' : ''}`}
            onClick={() => setActiveTab('my-nfts')}
          >
            🎫 My NFTs
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main">
        <div className="container">
          
          {/* Marketplace Tab */}
          {activeTab === 'marketplace' && (
            <div className="tab-content">
              <h2>🛍️ Buy Creator Subscriptions</h2>
              <p className="tab-description">Purchase NFT subscriptions to unlock exclusive content from your favorite creators</p>
              
              <div className="nft-grid">
                {marketplaceNFTs.map(nft => (
                  <div key={nft.id} className="nft-card">
                    <div className="nft-avatar">{nft.avatar}</div>
                    <h3>{nft.creator}</h3>
                    <div className="nft-tier">{nft.tier} Tier</div>
                    <p className="nft-description">{nft.description}</p>
                    <div className="nft-footer">
                      <div className="nft-price">{nft.price}</div>
                      <button onClick={() => buyNFT(nft)} className="btn btn-buy">
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Create NFT Tab */}
          {activeTab === 'create' && (
            <div className="tab-content">
              <h2>✨ Mint Subscription NFT</h2>
              <p className="tab-description">Create NFT subscriptions for your fans</p>
              
              {!wallet ? (
                <div className="empty-state">
                  <p>⚠️ Please create a wallet first to mint NFTs</p>
                  <button onClick={generateWallet} className="btn btn-primary">
                    Create Wallet
                  </button>
                </div>
              ) : (
                <div className="mint-form">
                  <div className="form-group">
                    <label>Subscriber Address (or use your own for testing)</label>
                    <input
                      type="text"
                      placeholder="G..."
                      value={mintForm.subscriberAddress}
                      onChange={(e) => setMintForm({...mintForm, subscriberAddress: e.target.value})}
                      className="input"
                    />
                    <button 
                      onClick={() => setMintForm({...mintForm, subscriberAddress: wallet.publicKey})}
                      className="btn-link"
                    >
                      Use my address
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Subscription Tier</label>
                    <select
                      value={mintForm.tier}
                      onChange={(e) => setMintForm({...mintForm, tier: e.target.value})}
                      className="input"
                    >
                      <option value="bronze">Bronze - $1/month</option>
                      <option value="silver">Silver - $3/month</option>
                      <option value="gold">Gold - $5/month</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Duration (ledgers)</label>
                    <input
                      type="number"
                      placeholder="100000"
                      value={mintForm.duration}
                      onChange={(e) => setMintForm({...mintForm, duration: e.target.value})}
                      className="input"
                    />
                    <small>~100,000 ledgers ≈ 5.7 days</small>
                  </div>

                  <button onClick={mintNFT} className="btn btn-primary" disabled={loading}>
                    {loading ? '⏳ Minting...' : '🔨 Mint NFT'}
                  </button>

                  <div className="info-box">
                    <strong>💡 How it works:</strong>
                    <ol>
                      <li>Enter subscriber's Stellar address</li>
                      <li>Choose tier and duration</li>
                      <li>Run the generated command in terminal</li>
                      <li>NFT is minted on Stellar blockchain</li>
                      <li>Subscriber gets automatic access to your content</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* My NFTs Tab */}
          {activeTab === 'my-nfts' && (
            <div className="tab-content">
              <h2>🎫 My Subscription NFTs</h2>
              <p className="tab-description">View and manage your NFT subscriptions</p>
              
              {nfts.length === 0 ? (
                <div className="empty-state">
                  <p>You don't own any NFTs yet</p>
                  <p>Browse the marketplace to get started!</p>
                  <button onClick={() => setActiveTab('marketplace')} className="btn btn-primary">
                    Browse Marketplace
                  </button>
                </div>
              ) : (
                <div className="nft-grid">
                  {nfts.map(nft => (
                    <div key={nft.id} className="nft-card owned">
                      <div className="nft-badge">✅ Owned</div>
                      <h3>Subscription #{nft.id}</h3>
                      <div className="nft-tier">{nft.tier} Tier</div>
                      <div className="nft-details">
                        <p><strong>Creator:</strong> {nft.creator}</p>
                        <p><strong>Subscriber:</strong> {nft.subscriber}</p>
                        <p><strong>Status:</strong> {nft.active ? '✅ Active' : '❌ Inactive'}</p>
                      </div>
                      <button className="btn btn-secondary">Access Content</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>🚀 Powered by Stellar Blockchain</p>
          <p>Contract: <code>{CONTRACT_ID.substring(0, 12)}...</code></p>
          <div className="footer-links">
            <a href={`https://stellar.expert/explorer/testnet/contract/${CONTRACT_ID}`} target="_blank" rel="noopener noreferrer">
              View Contract
            </a>
            <span>•</span>
            <a href="https://laboratory.stellar.org/" target="_blank" rel="noopener noreferrer">
              Stellar Lab
            </a>
            <span>•</span>
            <a href="https://friendbot.stellar.org/" target="_blank" rel="noopener noreferrer">
              Get Testnet XLM
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
