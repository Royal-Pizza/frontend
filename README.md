# 🍕 Royal Pizza - Frontend Angular

Frontend Angular pour la plateforme de commande de pizzas Royal Pizza.

---

## ⚙️ Prérequis

Avant de lancer l'application, vous devez avoir en place :

### 1. **Base de Données et Backend** 
Le backend Java/Spring et la base de données PostgreSQL doivent être en cours d'exécution.

**Installation rapide avec Docker Compose :**
```bash
git clone https://github.com/Royal-Pizza/docker.git
cd docker
docker compose -f docker-compose.yml up --build
```

Cela lance automatiquement :
- PostgreSQL (port 5432)
- Backend Spring Boot (port 8080)

**Documentation complète :** 
- [Docker Setup](https://github.com/Royal-Pizza/docker)
- [Backend API](https://github.com/Royal-Pizza/backend)

### 2. **Node.js et npm**
```bash
node --version  # v20.11+ recommandé (Angular 20)
npm --version   # v10+
```

### 3. **Angular CLI**
```bash
npm install -g @angular/cli@20.3.3
ng version
```

### 4. **Dépendances Angular (20.x)**
Le projet est sur **Angular 20** et **Angular Material 20.2.x**. Vérifiez ces versions pour éviter les erreurs de composants (ex. `mat-flat-button`, `mat-icon-button`).

- `@angular/core`: 20.3.x
- `@angular/material` / `@angular/cdk`: 20.2.x
- `zone.js`: 0.15.x
- `rxjs`: 7.8.x
- `typescript`: 5.9.x

Si votre machine a une CLI ou des dépendances plus anciennes, forcez l'installation propre :
```bash
npm ci
```


---

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/Royal-Pizza/frontend.git
cd frontend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer l'API Backend

Éditer [src/environments/environment.ts](src/environments/environment.ts) pour pointer vers le backend :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

---

## ▶️ Démarrage

### Développement

```bash
ng serve
# ou
npm start
```

L'application démarre sur **http://localhost:4200**

---

## 👤 Utilisateurs de Test

La base de données contient **3 utilisateurs de test** pour tester l'application :

### 1️⃣ **Jean Dupont** (Administrateur)
- **Email :** `jean.dupont@gmail.com`
- **Mot de passe :** `Jd9!Fq7@L2xR#M`
- **Rôle :** ADMIN ✅
- **Statut :** Compte actif ✅

**Accès :** Tous les fonctionnalités + gestion du catalogue

### 2️⃣ **Pierre Martin** (Client)
- **Email :** `pierre.martin@gmail.com`
- **Mot de passe :** `Pm4$Z8!kWQe6@T`
- **Rôle :** USER
- **Statut :** Compte actif ✅

### 3️⃣ **Nicolas Bernard** (Client)
- **Email :** `nicolas.bernard@gmail.com`
- **Mot de passe :** `Nb7@C!5RkX9$H2`
- **Rôle :** USER
- **Statut :** Compte actif ✅

---

## 🔄 Signification du Statut

| Valeur | Signification | Action Requise |
|--------|---------------|-----------------|
| `true` | Compte actif et accessible | Connexion directe possible ✅ |
| `false` | Compte désactivé | **Doit se réinscrire** pour réactiver l'accès |

### Réactivation d'un Compte

Si un compte a son Statut inactif (`available = false`), l'utilisateur doit :
1. Cliquer sur "S'inscrire" dans le login
2. Entrer le même email
3. Choisir un nouveau mot de passe
4. Le compte sera réactivé (`available = true`)

---

## 🎨 Fonctionnalités Principales

### 👨‍💼 Pour les Clients Réguliers

- ✅ Consulter le catalogue de pizzas
- ✅ Voir les détails et ingrédients de chaque pizza
- ✅ Ajouter des pizzas au panier
- ✅ Gérer le panier (quantité, suppression)
- ✅ Passer une commande avec wallet
- ✅ Consulter l'historique des commandes
- ✅ Recharger son wallet
- ✅ Modifier son profil

### 🔐 Pour les Administrateurs

- ✅ Toutes les fonctionnalités client
- ✅ **Gestion du catalogue :**
  - Ajouter/modifier/supprimer des pizzas
  - Gérer les ingrédients
- ✅ **Gestion tarifaire :**
  - Définir les prix par pizza

---

## 🌍 Architecture Angular

Le frontend utilise une architecture **composant-service** :

```
┌─────────────────────┐
│   HTTP Services     │  (Appels API REST)
│  (httpRequest/)     │
└────────┬────────────┘
         │
┌────────▼────────────┐
│  Domain Services    │  (Logique métier)
│   (order/, tools/)  │
└────────┬────────────┘
         │
┌────────▼────────────┐
│    Components       │  (UI / Présentation)
│  (Form, Menu, etc)  │
└─────────────────────┘
```

---

## 🔗 Ressources

- **Backend :** https://github.com/Royal-Pizza/backend
- **Docker & Base de Données :** https://github.com/Royal-Pizza/docker
- **Angular Docs :** https://angular.io/docs
- **API Endpoints :** [Backend README](https://github.com/Royal-Pizza/backend#-api-endpoints)

---

## 📝 Workflow Typique

1. **Démarrer Docker Compose**
   ```bash
   cd ../docker && docker compose up --build
   ```

2. **Lancer le Frontend**
   ```bash
   npm start
   ```

3. **Accéder à l'application**
   ```
   http://localhost:4200
   ```

4. **Se connecter** avec l'un des 3 comptes de test

5. **Commencer à commander des pizzas** 🍕

---

## 🐛 Troubleshooting

### "Cannot find module @angular/core"
```bash
npm install
```

### "Backend not responding (CORS error)"
- Vérifier que le backend tourne sur `http://localhost:8080`
- Vérifier `environment.ts` → `apiUrl` correct

### "Invalid token"
- Token expiré → Se reconnecter
- Vérifier que le backend et le frontend utilisent la même `app.jwt.secret`

### "Port 4200 already in use"
```bash
ng serve --port 4201
```
