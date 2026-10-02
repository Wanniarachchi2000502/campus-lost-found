# Campus Lost & Found

React Native (Expo) -> REST API -> Node.js + Express -> MongoDB Atlas

## Backend
1. `cd backend && npm install`
2. Copy `.env.example` to `.env`, then set `MONGO_URI` (Atlas) and `JWT_SECRET`.
3. `npm run dev` (local) or `npm start` (production).
4. Deploy to Render/Railway: root `backend`, build `npm install`, start `npm start`, add the env vars.

## Mobile
1. `cd mobile && npm install`
2. Set `BASE_URL` in `src/config.js` to your deployed backend URL.
3. `npx expo start`, then scan the QR code with Expo Go.

## API
| Method | Route | Purpose |
|---|---|---|
| POST | /api/auth/register, /login | Sign up / log in |
| GET | /api/auth/me | Current user |
| GET | /api/items?search=&type=&category= | Browse open reports |
| POST | /api/items | Create report (multipart, `image`) |
| GET/PUT/DELETE | /api/items/:id | View / edit / delete own report |
| GET | /api/items/mine | My reports |
| POST | /api/items/:itemId/claims | Claim a found item |
| GET | /api/items/:itemId/claims | Reporter views claims |
| GET | /api/claims/mine | My claims |
| PUT/DELETE | /api/claims/:id | Edit (pending) / delete own claim |
| PATCH | /api/claims/:id/status | Reporter approves or rejects |

## Business rules (claimController.js)
- Only `found` items can be claimed; not by their reporter; one claim per user per item.
- No new claims once an item is `Returned`.
- Approving a claim sets the item to `Returned` and rejects other pending claims; only one approval per item.

## Note on image storage
Multer saves to `backend/uploads`. Render/Railway free tiers use ephemeral disks, so uploads vanish on redeploy. Attach a persistent disk, or switch to Cloudinary/S3 if images must persist.
