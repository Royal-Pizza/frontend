# 🍕 Royal Pizza - Frontend

**[EN](#english-section) | [FR](#french-section)**

<a id="english-section"></a>
## English

### Overview

Angular modern frontend for the Royal Pizza pizza ordering platform. Features a complete ordering system with admin capabilities for managing the catalog, ingredients, pricing, and user accounts. Built with Angular 20, Angular Material, and TypeScript.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running](#running)
4. [Test Users](#test-users)
5. [Features](#features)
6. [Architecture](#architecture)
7. [API Configuration](#api-configuration)
8. [Troubleshooting](#troubleshooting)
9. [Resources](#resources)

---

## ✅ Prerequisites

<a id="prerequisites"></a>

### Backend & Database

The Java/Spring backend and PostgreSQL database must be running. You also need to clone the **backend** repository for local development.

**Quick setup with Docker Compose:**
```bash
git clone https://github.com/Royal-Pizza/docker.git
cd docker
docker compose -f docker-compose.yml up --build
```

This automatically launches:
- PostgreSQL (port 5432)
- Backend Spring Boot (port 8081)

**Full documentation:**
- [Docker Setup](https://github.com/Royal-Pizza/docker)
- [Backend API](https://github.com/Royal-Pizza/backend)

### Node.js & npm

```bash
node --version  # v20.11+ recommended (Angular 20)
npm --version   # v10+
```

### Angular CLI (Optional)

While not required, it's helpful for development:

```bash
npm install -g @angular/cli@20.3.3
ng version
```


---

## 🚀 Installation

<a id="installation"></a>

### 1. Clone the repository

```bash
git clone https://github.com/Royal-Pizza/frontend.git
cd frontend
```

### 2. Install dependencies

The project uses **Angular 20** with **Angular Material 20.2.x**. Install all dependencies:

```bash
npm install
```

For a clean installation, use:
```bash
npm ci
```

### 3. (Optional) Configure Backend API

By default, the frontend connects to `http://localhost:8081/api-backend`. If your backend runs on a different address, edit [src/environments/environment.ts](src/environments/environment.ts):

```typescript
export const environment = {
  production: false,
  backendBaseUrl: 'http://localhost:8081/api-backend'
};
```

---

## ▶️ Running

<a id="running"></a>

### Development Server

```bash
npm start
```

or

```bash
ng serve
```

The application runs on **http://localhost:4200**

### Production Build

```bash
ng build --configuration production
```

Output is generated in the `dist/` folder.

---

## 👤 Test Users

<a id="test-users"></a>

The database includes **3 test accounts**:

### 1️⃣ **Jean Dupont** (Administrator)
- **Email:** `jean.dupont@gmail.com`
- **Password:** `Jd9!Fq7@L2xR#M`
- **Role:** ADMIN ✅
- **Status:** Active ✅

**Access:** All features + catalog management

### 2️⃣ **Pierre Martin** (Client)
- **Email:** `pierre.martin@gmail.com`
- **Password:** `Pm4$Z8!kWQe6@T`
- **Role:** USER
- **Status:** Active ✅ (`available = true`)

**Note:** To become inactive, must unsubscribe and re-subscribe.

### 3️⃣ **Nicolas Bernard** (Client)
- **Email:** `nicolas.bernard@gmail.com`
- **Password:** `Nb7@C!5RkX9$H2`
- **Role:** USER
- **Status:** Active ✅ (`available = true`)

**Note:** To become inactive, must unsubscribe and re-subscribe.

---

## 🎨 Features

<a id="features"></a>

### For Regular Users

- ✅ Browse pizza catalog
- ✅ View pizza details and ingredients
- ✅ Add pizzas to basket
- ✅ Manage basket (quantity, deletion)
- ✅ Place orders using wallet
- ✅ View order history
- ✅ Recharge wallet
- ✅ Update profile information

### For Administrators

- ✅ All regular user features
- ✅ **Catalog Management:**
  - Add/edit/delete pizzas
  - Manage ingredients
- ✅ **Pricing Management:**
  - Set prices by pizza and size

---

## 🏗️ Architecture

<a id="architecture"></a>

The frontend uses a **component-service** architecture:

```
┌──────────────────────┐
│   HTTP Services      │  (REST API calls)
│ (httpRequest/)       │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│  Domain Services     │  (Business logic)
│  (order/, tools/)    │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│   Components         │  (UI / Presentation)
│ (Form, Menu, etc)    │
└──────────────────────┘
```

### Key Integration Points

- **Login:** `POST /api-backend/customers/login` → Retrieve JWT token
- **Menu:** `GET /api-backend/pizzas` → List all pizzas
- **Order:** `POST /api-backend/invoices` → Create invoice

---

## � API Configuration

<a id="api-configuration"></a>

By default, the frontend connects to `http://localhost:8081/api-backend`. See [Installation - Step 3](#installation) to customize this address.

---

## 🔗 Resources

<a id="resources"></a>

- **Backend Repository:** https://github.com/Royal-Pizza/backend
- **Docker & Database Setup:** https://github.com/Royal-Pizza/docker
- **Angular Documentation:** https://angular.io/docs
- **Backend API Endpoints:** [See Backend README](https://github.com/Royal-Pizza/backend#api-endpoints)

---

## 🐛 Troubleshooting

<a id="troubleshooting"></a>

### "Cannot find module @angular/core"
```bash
npm install
```

### "Backend not responding (CORS error)"
- Ensure backend is running on `http://localhost:8081`
- Verify `environment.ts` → `backendBaseUrl` is correct

### "Invalid token"
- Token expired → Re-login
- Verify backend and frontend use the same `jwt.expiration` setting

### "Port 4200 already in use"
```bash
ng serve --port 4201
```

---

## 📄 License

**Proprietary - Royal Pizza 2024**

This project and all its contents are the exclusive property of Royal Pizza. Unauthorized copying, distribution, or use is strictly prohibited.

For licensing inquiries, contact the Royal Pizza development team.

---

<a id="french-section"></a>
## Français

### Vue d'ensemble

Frontend Angular moderne pour la plateforme de commande de pizzas Royal Pizza. Permet aux utilisateurs de parcourir le catalogue, passer des commandes et recharger leur wallet. Les administrateurs peuvent gérer le catalogue, les ingrédients, les tarifs et les comptes utilisateurs. Construit avec Angular 20, Angular Material et TypeScript.

---

## 📋 Table des matières (Français)

1. [Prérequis](#prerequisites-fr)
2. [Installation](#installation-fr)
3. [Démarrage](#running-fr)
4. [Utilisateurs de Test](#test-users-fr)
5. [Fonctionnalités](#features-fr)
6. [Architecture](#architecture-fr)
7. [Configuration de l'API](#api-config-fr)
8. [Dépannage](#troubleshooting-fr)
9. [Ressources](#resources-fr)

---

## ✅ Prérequis

<a id="prerequisites-fr"></a>

### Backend & Base de Données

Le backend Java/Spring et la base de données PostgreSQL doivent être en cours d'exécution. Vous devez également cloner le repository **backend** pour le développement local.

**Installation rapide avec Docker Compose :**
```bash
git clone https://github.com/Royal-Pizza/docker.git
cd docker
docker compose -f docker-compose.yml up --build
```

Cela lance automatiquement :
- PostgreSQL (port 5432)
- Backend Spring Boot (port 8081)

**Documentation complète :**
- [Configuration Docker](https://github.com/Royal-Pizza/docker)
- [API Backend](https://github.com/Royal-Pizza/backend)

### Node.js & npm

```bash
node --version  # v20.11+ recommandé (Angular 20)
npm --version   # v10+
```

### Angular CLI (Optionnel)

Bien que non obligatoire, c'est utile pour le développement :

```bash
npm install -g @angular/cli@20.3.3
ng version
```

---

## 🚀 Installation

<a id="installation-fr"></a>

### 1. Cloner le repository

```bash
git clone https://github.com/Royal-Pizza/frontend.git
cd frontend
```

### 2. Installer les dépendances

Le projet utilise **Angular 20** avec **Angular Material 20.2.x**. Installez toutes les dépendances :

```bash
npm install
```

Pour une installation propre, utilisez :
```bash
npm ci
```

### 3. (Optionnel) Configurer l'API Backend

Par défaut, le frontend se connecte à `http://localhost:8081/api-backend`. Si votre backend s'exécute sur une adresse différente, éditez [src/environments/environment.ts](src/environments/environment.ts) :

```typescript
export const environment = {
  production: false,
  backendBaseUrl: 'http://localhost:8081/api-backend'
};
```

---

## ▶️ Démarrage

<a id="running-fr"></a>

### Serveur de Développement

```bash
npm start
```

ou

```bash
ng serve
```

L'application s'exécute sur **http://localhost:4200**

### Build Production

```bash
ng build --configuration production
```

Le résultat est généré dans le dossier `dist/`.

---

## 👤 Utilisateurs de Test

<a id="test-users-fr"></a>

La base de données contient **3 comptes de test** :

### 1️⃣ **Jean Dupont** (Administrateur)
- **Email :** `jean.dupont@gmail.com`
- **Mot de passe :** `Jd9!Fq7@L2xR#M`
- **Rôle :** ADMIN ✅
- **Statut :** Actif ✅

**Accès :** Toutes les fonctionnalités + gestion du catalogue

### 2️⃣ **Pierre Martin** (Client)
- **Email :** `pierre.martin@gmail.com`
- **Mot de passe :** `Pm4$Z8!kWQe6@T`
- **Rôle :** USER
- **Statut :** Actif ✅ (`available = true`)

**Note :** Pour devenir inactif, doit se désinscrire et se réinscrire.

### 3️⃣ **Nicolas Bernard** (Client)
- **Email :** `nicolas.bernard@gmail.com`
- **Mot de passe :** `Nb7@C!5RkX9$H2`
- **Rôle :** USER
- **Statut :** Actif ✅ (`available = true`)

**Note :** Pour devenir inactif, doit se désinscrire et se réinscrire.

---

## 🎨 Fonctionnalités

<a id="features-fr"></a>

### Pour les Clients Réguliers

- ✅ Parcourir le catalogue de pizzas
- ✅ Voir les détails et ingrédients de chaque pizza
- ✅ Ajouter des pizzas au panier
- ✅ Gérer le panier (quantité, suppression)
- ✅ Passer une commande avec le wallet
- ✅ Consulter l'historique des commandes
- ✅ Recharger le wallet
- ✅ Modifier les informations du profil

### Pour les Administrateurs

- ✅ Toutes les fonctionnalités des clients réguliers
- ✅ **Gestion du Catalogue :**
  - Ajouter/modifier/supprimer des pizzas
  - Gérer les ingrédients
- ✅ **Gestion des Tarifs :**
  - Définir les prix par pizza et taille

---

## 🏗️ Architecture

<a id="architecture-fr"></a>

Le frontend utilise une architecture **composant-service** :

```
┌──────────────────────┐
│   Services HTTP      │  (Appels API REST)
│  (httpRequest/)      │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│  Services Métier     │  (Logique métier)
│  (order/, tools/)    │
└──────────┬───────────┘
           │
┌──────────▼───────────┐
│    Composants        │  (UI / Présentation)
│  (Form, Menu, etc)   │
└──────────────────────┘
```

### Points de Connexion Clés

- **Login :** `POST /api-backend/customers/login` → Récupère le token JWT
- **Menu :** `GET /api-backend/pizzas` → Liste toutes les pizzas
- **Commande :** `POST /api-backend/invoices` → Crée une facture

---

## 🔧 Configuration de l'API

<a id="api-config-fr"></a>

La configuration par défaut se connecte à `http://localhost:8081/api-backend`. Voir [Installation - Étape 3](#installation-fr) pour personnaliser cette adresse.

---

## 🔗 Ressources

<a id="resources-fr"></a>

- **Repository Backend :** https://github.com/Royal-Pizza/backend
- **Configuration Docker et Base de Données :** https://github.com/Royal-Pizza/docker
- **Documentation Angular :** https://angular.io/docs
- **Endpoints API Backend :** [Voir Backend README](https://github.com/Royal-Pizza/backend#api-endpoints)

---

## 🐛 Dépannage

<a id="troubleshooting-fr"></a>

### "Cannot find module @angular/core"
```bash
npm install
```

### "Backend not responding (CORS error)"
- Vérifiez que le backend s'exécute sur `http://localhost:8081`
- Vérifiez `environment.ts` → `backendBaseUrl` est correct

### "Invalid token"
- Token expiré → Se reconnecter
- Vérifiez que le backend et le frontend utilisent le même paramètre `jwt.expiration`

### "Port 4200 already in use"
```bash
ng serve --port 4201
```

---

## 📄 Licence

**Propriétaire - Royal Pizza 2024**

Ce projet et tous ses contenus sont la propriété exclusive de Royal Pizza. Toute copie, distribution ou utilisation non autorisée est strictement interdite.

Pour les demandes de licence, contactez l'équipe de développement de Royal Pizza.
