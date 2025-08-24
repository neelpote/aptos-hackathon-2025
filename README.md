# GuardianAngel DAO: Community-Driven Crowdfunding on Aptos

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

GuardianAngel DAO is a decentralized crowdfunding platform empowering communities to transparently fund innovative projects through milestone-based releases on the Aptos blockchain.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Key Screenshots](#key-screenshots)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Features

- **Proposal Submission:** Community members can submit funding proposals with detailed milestones.
- **Transparent Voting:** Token holders can vote on proposals using on-chain transactions.
- **Milestone Release:** Funds are released milestone-by-milestone based on voting outcomes.
- **Wallet Integration:** Easy wallet connect via Aptos wallet adapter with Petra wallet support.
- **Responsive UI:** Modern React app with vertical sidebar navigation and mobile support.
- **Off-chain Data Sync:** Proposal metadata is stored and synced with Supabase backend for efficient querying.

---

## Architecture

- **Frontend:** React.js using Tailwind CSS for styling and React Router for navigation.
- **Blockchain:** Aptos blockchain running Move smart contracts for DAO logic.
- **Wallets:** Petra Wallet Adapter integrated via `@aptos-labs/wallet-adapter-react`.
- **Backend:** Supabase for off-chain storage of proposal details and vote records.
- **Deployment:** Local development with future potential for decentralized hosting.

---

## Getting Started

### Prerequisites

- Node.js >= 16.x
- npm or yarn
- Aptos wallet (e.g., Petra) installed and configured
- Supabase account and project with configured tables (see schema below)

### Setup

1. Clone the repository:
git clone https://github.com/neelpote/guardianangel.git


2. Install dependencies:

cd guardianangel npm install


3. Create a `.env` file in the root with the following contents:

VITE_SUPABASE_URL= VITE_SUPABASE_ANON_KEY=


4. Start the development server:

npm run dev


---

## Usage

- Open your browser and connect your Petra wallet.
- Navigate between **Home**, **Submit Proposal**, **Vote**, and **Admin** panels.
- Submit new proposals, vote on ongoing ones, and monitor milestone funding.
- Use the "Refresh" button on Home to reload proposals.
- View your votes and wallet status in the sidebar.

---

## Key Screenshots

<img width="1506" height="775" alt="Transaction Succesfull Screenshot" src="https://github.com/user-attachments/assets/1ce59238-8a71-4cd3-bc38-a16ef86bd27c" />


<img width="1512" height="982" alt="Screenshot 2025-08-24 at 11 30 46 AM" src="https://github.com/user-attachments/assets/5aa8ce07-72e7-4cad-a567-c82816f56622" />


<img width="1512" height="982" alt="Screenshot 2025-08-24 at 12 22 15 PM" src="https://github.com/user-attachments/assets/75e00912-1792-4c29-93fc-1a026ec8b221" />


<img width="1512" height="982" alt="Screenshot 2025-08-24 at 12 44 42 PM" src="https://github.com/user-attachments/assets/121af905-95a4-4988-b6c6-95b03a1c75ee" />


---

## Tech Stack

- **React** with Functional Components and Hooks
- **Tailwind CSS** for styling
- **React Router DOM** for routing
- **Aptos Web3 SDK & Wallet Adapter**
- **Supabase** for backend database
- **Vite** for fast development and build

---

## Database Schema (Supabase)

create table proposals ( id serial primary key, title text not null, description text, milestone_count int default 1, created_at timestamptz default now() );
create table votes ( id serial primary key, proposal_id int references proposals(id), user_wallet text not null, created_at timestamptz default now() );



---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to open issues or pull requests.

Please follow the standard GitHub flow:

1. Fork the repo  
2. Create your feature branch  
3. Commit your changes  
4. Push to your branch  
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contact

Feel free to reach out:

- GitHub: [NEELPOTE](https://github.com/neelpote)  
- Email: neelpote96@gmail.com

---

Thank you for being a part of GuardianAngel DAO, bringing transparency and innovation to community funding!












