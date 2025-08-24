module angel::Crowdfunding {

    use aptos_framework::signer;
    use aptos_framework::vector;

    /// Error codes
    const E_ALREADY_VOTED: u64 = 1;
    const E_INVALID_PROPOSAL: u64 = 2;
    const E_NOT_OWNER: u64 = 3;
    const E_NO_FUNDS_TO_RELEASE: u64 = 4;

    /// DAO/Admin address (store lives here)
    const DAO_ADDRESS: address = @0xaa6595e8788da34bd0971ef76bfc59ce05297676a512cef320624be6648c4dad; // Replace with your admin address

    /// Vote record structure (replaces tuple)
    struct Vote has copy, drop, store {
        proposal_id: u64,
        voter: address,
    }

    /// Proposal structure
    struct Proposal has copy, drop, store {
        id: u64,
        proposer: address,
        title: vector<u8>,
        description: vector<u8>,
        vote_count: u64,
        milestone_count: u64,
        current_milestone: u64,
        is_funded: bool
    }

    /// Global store for all proposals and votes
    struct ProposalStore has key {
        proposals: vector<Proposal>,
        voted: vector<Vote>
    }

    /// Initialize the proposal store (only once at DAO address)
    public fun init_store(admin: &signer) {
        if (!exists<ProposalStore>(signer::address_of(admin))) {
            move_to(admin, ProposalStore {
                proposals: vector::empty<Proposal>(),
                voted: vector::empty<Vote>()
            });
        }
    }

    /// Submit a new proposal
    public fun submit_proposal(
        proposer: &signer,
        title: vector<u8>,
        description: vector<u8>,
        milestone_count: u64
    ) acquires ProposalStore {
        let store = borrow_global_mut<ProposalStore>(DAO_ADDRESS);

        // Generate proposal ID
        let id = vector::length(&store.proposals);

        let proposal = Proposal {
            id,
            proposer: signer::address_of(proposer),
            title,
            description,
            vote_count: 0,
            milestone_count,
            current_milestone: 0,
            is_funded: false
        };

        vector::push_back(&mut store.proposals, proposal);
    }

    /// Vote for a proposal
    public fun vote(voter: &signer, proposal_id: u64) acquires ProposalStore {
        let store = borrow_global_mut<ProposalStore>(DAO_ADDRESS);
        let len = vector::length(&store.proposals);
        assert!(proposal_id < len, E_INVALID_PROPOSAL);

        // Check if voter has already voted for this proposal
        let votes_len = vector::length(&store.voted);
        let i = 0;
        while (i < votes_len) {
            let vote_ref = vector::borrow(&store.voted, i);
            assert!(!(vote_ref.proposal_id == proposal_id && vote_ref.voter == signer::address_of(voter)), E_ALREADY_VOTED);
            i = i + 1;
        };

        let proposal_ref = vector::borrow_mut(&mut store.proposals, proposal_id);
        proposal_ref.vote_count = proposal_ref.vote_count + 1;

        let new_vote = Vote {
            proposal_id,
            voter: signer::address_of(voter),
        };
        vector::push_back(&mut store.voted, new_vote);
    }

    /// Release funds for milestones (called by DAO admin / owner)
    public fun release_milestone(admin: &signer, proposal_id: u64) acquires ProposalStore {
        assert!(signer::address_of(admin) == DAO_ADDRESS, E_NOT_OWNER);

        let store = borrow_global_mut<ProposalStore>(DAO_ADDRESS);
        let proposal_ref = vector::borrow_mut(&mut store.proposals, proposal_id);

        // Only release if there are pending milestones
        assert!(proposal_ref.current_milestone < proposal_ref.milestone_count, E_NO_FUNDS_TO_RELEASE);

        // Simulate fund release
        proposal_ref.current_milestone = proposal_ref.current_milestone + 1;

        // Mark as fully funded if all milestones completed
        if (proposal_ref.current_milestone == proposal_ref.milestone_count) {
            proposal_ref.is_funded = true;
        }
    }

    /// View all proposals (read-only)
    public fun get_proposals(): vector<Proposal> acquires ProposalStore {
        let store = borrow_global<ProposalStore>(DAO_ADDRESS);
        *&store.proposals
    }

    /// Get vote count for a specific proposal
    public fun get_proposal_votes(proposal_id: u64): u64 acquires ProposalStore {
        let store = borrow_global<ProposalStore>(DAO_ADDRESS);
        let len = vector::length(&store.proposals);
        assert!(proposal_id < len, E_INVALID_PROPOSAL);
        
        let proposal_ref = vector::borrow(&store.proposals, proposal_id);
        proposal_ref.vote_count
    }

    /// Check if a voter has already voted for a proposal
    public fun has_voted(voter_addr: address, proposal_id: u64): bool acquires ProposalStore {
        let store = borrow_global<ProposalStore>(DAO_ADDRESS);
        let votes_len = vector::length(&store.voted);
        let i = 0;
        while (i < votes_len) {
            let vote_ref = vector::borrow(&store.voted, i);
            if (vote_ref.proposal_id == proposal_id && vote_ref.voter == voter_addr) {
                return true
            };
            i = i + 1;
        };
        false
    }
}