# Realms of Math

A turn-based RPG math learning game where players solve math problems to defeat monsters and progress through increasingly challenging levels.

## 🎮 Game Overview

> Realms of Math combines classic RPG elements with educational math challenges. Players embark on a journey through various levels, battling monsters by correctly answering math questions. Each correct answer allows the player to attack, while wrong answers give the monster a chance to strike back.

Key Features

- Turn-based Combat: Strategic gameplay where correct answers lead to successful attacks

- Skill-based Defense: Active defense system during enemy turns
- Critical Hit System: Timing-based mini-games to increase attack damage
- Progression System: Level up your character's attributes as you advance
- Pixel Art Aesthetic: Charming retro graphics with modern animations

## 🛠️ Technical Architecture

### Frontend Stack

- Next.js: React framework with server-side rendering and API routes
- TypeScript: Static typing for improved code quality and developer experience
- Tailwind CSS: Utility-first CSS framework for responsive design
- React Hooks: For state management and side effects

### Backend Stack

- FastAPI: High-performance Python web framework for API endpoints
- AWS DynamoDB: NoSQL database for storing user data, game progress, and questions
- MinIO S3: Object storage for game assets and media files
- JWT Authentication: Secure user authentication and session management

### Infrastructure

- Cloud Hosting: Deployed on AWS EC2
- Self-Hosted: Minio S3

## 🎯 Core Game Mechanics

Question-Based Combat
The combat system is question-driven, where:

1. Player is presented with a math question
2. Correct answers trigger the Critical Hit mini-game
3. Success in the mini-game determines attack damage multiplier
4. Damage is calculated and applied to the monster

### Defense System

During monster attacks, players engage in an active defense system:

1. Player rapidly presses the spacebar to charge a shield
2. Shield strength determines damage reduction
3. The defense effectiveness is determined by player reaction time and input speed

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm or pnpm
- Python 3.9+
- AWS account (for DynamoDB)
- MinIO S3 compatible storage

### Installation

1. Clone the repository:

```sh
git clone https://github.com/Tenkris/game-intania
cd game-intania
```

2. Install frontend dependencies:

```sh
npm install
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## 🙏 Acknowledgements

- Intania Hackathon 2025
- ChadGPT Team

  - [Justin](https://github.com/JusJira)
  - [Nick](https://github.com/pineylilly)
  - [Ten](https://github.com/Tenkris)
  - [V](https://github.com/hellp002)
  - [Win](https://github.com/WinSukon)
