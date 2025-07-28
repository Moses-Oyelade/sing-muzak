
## Song-Muzak App
Date, 2024/11/27
By Moses O. Oyelade

## Description
Song-Muzak is a full-stack music management web application designed to help choir administrators and music coordinators manage songs, members, rehearsals, and attendance effectively. It supports real-time updates using WebSockets and allows PDF/audio uploads, approval workflows, and member voice part tracking.

## Key Features
- Admin dashboard with song approval and deletion workflows
- Real-time updates for new song uploads and status changes
- Song categorization and search
- Upload and preview sheet music (PDF) and audio files
- Member management by voice part and role
- Rehearsal scheduling, attendance tracking, and trend analysis download(CSV)
- Role-based access with admin/member separation
- Toast notifications and responsive UI using Tailwind CSS
- WebSocket-powered live updates using Socket.IO(on-going)

## Tech Stack
**Frontend:** Next.js, TypeScript, Tailwind CSS, React Hook Form, Socket.IO
**Backend:** NestJS, MongoDB, Mongoose, Socket.IO, Google Drive API for file storage
Setup Instructions
1. Clone the repository:
```
git clone https://github.com/Moses-Oyelade/song-muzak.git
```
2. Install dependencies in both frontend and backend folders:
```
npm install
```
3. Set up environment variables for both backend and frontend including MongoDB URI, Google Drive API credentials, and Socket.IO origin.
4. Run the development servers:
```
npm run dev
```
Contribution
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
License
This project is licensed under the MIT License – see the [LICENSE](./LICENSE) file for details.
