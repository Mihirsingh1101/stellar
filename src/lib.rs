// pub fn add(left: u64, right: u64) -> u64 {
//     left + right
// }

// #[cfg(test)]
// mod tests {
//     use super::*;

//     #[test]
//     fn it_works() {
//         let result = add(2, 2);
//         assert_eq!(result, 4);
//     }
// }

#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, String, Symbol, symbol_short};

/// Creator Subscription NFT Marketplace Contract
/// Feature 1: Mint subscription NFTs for creators
/// Feature 2: Verify NFT ownership for content access

#[contract]
pub struct CreatorNFT;

#[contracttype]
#[derive(Clone)]
pub struct SubscriptionNFT {
    pub token_id: u64,
    pub creator: Address,
    pub subscriber: Address,
    pub tier: Symbol,           // "bronze", "silver", "gold"
    pub expiry_ledger: u32,     // When subscription expires
    pub is_active: bool,
}

#[contracttype]
pub enum DataKey {
    TokenCount,
    Token(u64),                 // token_id -> SubscriptionNFT
    UserTokens(Address),        // user -> list of token_ids
    CreatorTokens(Address),     // creator -> list of token_ids
}

#[contractimpl]
impl CreatorNFT {
    const NAME: &'static str = "CreatorSubscriptionNFT";
    const SYMBOL: &'static str = "CSUB";

    /// Get contract name
    pub fn name(env: Env) -> String {
        String::from_str(&env, Self::NAME)
    }

    /// Get contract symbol
    pub fn symbol(env: Env) -> String {
        String::from_str(&env, Self::SYMBOL)
    }

    /// FEATURE 1: Mint a subscription NFT
    /// Creator mints an NFT for a subscriber
    pub fn mint(
        env: Env,
        creator: Address,
        subscriber: Address,
        tier: Symbol,
        duration_ledgers: u32,  // How many ledgers the subscription lasts
    ) -> u64 {
        // Require creator authorization
        creator.require_auth();

        // Get next token ID
        let token_id: u64 = env.storage()
            .instance()
            .get(&DataKey::TokenCount)
            .unwrap_or(0);
        
        let new_token_id = token_id + 1;

        // Calculate expiry (current ledger + duration)
        let current_ledger = env.ledger().sequence();
        let expiry_ledger = current_ledger + duration_ledgers;

        // Create NFT
        let nft = SubscriptionNFT {
            token_id: new_token_id,
            creator: creator.clone(),
            subscriber: subscriber.clone(),
            tier: tier.clone(),
            expiry_ledger,
            is_active: true,
        };

        // Store NFT
        env.storage().persistent().set(&DataKey::Token(new_token_id), &nft);
        env.storage().instance().set(&DataKey::TokenCount, &new_token_id);

        // Emit event
        env.events().publish(
            (symbol_short!("mint"), creator.clone()),
            (new_token_id, subscriber, tier)
        );

        new_token_id
    }

    /// FEATURE 2: Verify if a user has valid access
    /// Returns true if user holds an active, non-expired NFT from this creator
    pub fn has_access(env: Env, user: Address, creator: Address) -> bool {
        let token_count: u64 = env.storage()
            .instance()
            .get(&DataKey::TokenCount)
            .unwrap_or(0);

        let current_ledger = env.ledger().sequence();

        // Check all tokens to find if user has valid subscription
        for token_id in 1..=token_count {
            if let Some(nft) = env.storage()
                .persistent()
                .get::<DataKey, SubscriptionNFT>(&DataKey::Token(token_id))
            {
                if nft.subscriber == user
                    && nft.creator == creator
                    && nft.is_active
                    && nft.expiry_ledger > current_ledger
                {
                    return true;
                }
            }
        }

        false
    }

    /// Get NFT details by token ID
    pub fn get_nft(env: Env, token_id: u64) -> Option<SubscriptionNFT> {
        env.storage().persistent().get(&DataKey::Token(token_id))
    }

    /// Get owner of a specific token
    pub fn owner_of(env: Env, token_id: u64) -> Option<Address> {
        env.storage()
            .persistent()
            .get::<DataKey, SubscriptionNFT>(&DataKey::Token(token_id))
            .map(|nft| nft.subscriber)
    }

    /// Transfer NFT (for secondary market)
    pub fn transfer(env: Env, token_id: u64, from: Address, to: Address) {
        from.require_auth();

        let mut nft: SubscriptionNFT = env.storage()
            .persistent()
            .get(&DataKey::Token(token_id))
            .expect("Token does not exist");

        // Verify ownership
        if nft.subscriber != from {
            panic!("Not the owner");
        }

        // Update owner
        nft.subscriber = to.clone();
        env.storage().persistent().set(&DataKey::Token(token_id), &nft);

        // Emit transfer event
        env.events().publish(
            (symbol_short!("transfer"), token_id),
            (from, to)
        );
    }

    /// Deactivate/cancel a subscription
    pub fn cancel(env: Env, token_id: u64, caller: Address) {
        caller.require_auth();

        let mut nft: SubscriptionNFT = env.storage()
            .persistent()
            .get(&DataKey::Token(token_id))
            .expect("Token does not exist");

        // Only creator or subscriber can cancel
        if nft.creator != caller && nft.subscriber != caller {
            panic!("Unauthorized");
        }

        nft.is_active = false;
        env.storage().persistent().set(&DataKey::Token(token_id), &nft);
    }

    /// Get total supply
    pub fn total_supply(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::TokenCount)
            .unwrap_or(0)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Env};

    #[test]
    fn test_mint_and_access() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CreatorNFT);
        let client = CreatorNFTClient::new(&env, &contract_id);

        let creator = Address::generate(&env);
        let subscriber = Address::generate(&env);

        // Mint NFT
        env.mock_all_auths();
        let token_id = client.mint(&creator, &subscriber, &symbol_short!("gold"), &1000);

        assert_eq!(token_id, 1);

        // Check access
        let has_access = client.has_access(&subscriber, &creator);
        assert!(has_access);

        // Check owner
        let owner = client.owner_of(&token_id).unwrap();
        assert_eq!(owner, subscriber);
    }

    #[test]
    fn test_transfer() {
        let env = Env::default();
        let contract_id = env.register_contract(None, CreatorNFT);
        let client = CreatorNFTClient::new(&env, &contract_id);

        let creator = Address::generate(&env);
        let subscriber1 = Address::generate(&env);
        let subscriber2 = Address::generate(&env);

        env.mock_all_auths();
        let token_id = client.mint(&creator, &subscriber1, &symbol_short!("silver"), &500);

        // Transfer NFT
        client.transfer(&token_id, &subscriber1, &subscriber2);

        // Check new owner
        let owner = client.owner_of(&token_id).unwrap();
        assert_eq!(owner, subscriber2);

        // Check access for new owner
        let has_access = client.has_access(&subscriber2, &creator);
        assert!(has_access);
    }
}

