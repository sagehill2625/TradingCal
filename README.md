# TradeCal - Trading Calendar & Analytics

TradeCal is a web application that helps traders track and analyze their trading performance through an intuitive calendar interface and comprehensive analytics dashboard.

## Features

- 📅 Calendar view of trading activity
- 📊 Detailed analytics with charts and insights
- 🤖 AI-powered trading insights
- 📤 Excel file upload support
- 👥 Multiple trading account management
- 🎨 Multiple theme options

## Prerequisites

Before you begin, ensure you have installed:

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1. Clone the repository:

```bash
git clone [your-repository-url]
cd tradecal
```

2. Install dependencies:

```bash
npm install
```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

To preview the production build:

```bash
npm run preview
```

## Usage

1. **Account Setup**

   - Navigate to the Upload page
   - Click "New Account" to create a trading account
   - Enter an account name and click "Add"

2. **Uploading Trades**

   - Select an account from the dropdown
   - Drag and drop your Excel file onto the upload area
   - The file should contain the following columns:
     - symbol (e.g., MNQZ4)
     - qty (quantity)
     - buyPrice and sellPrice
     - pnl (profit/loss)
     - boughtTimestamp and soldTimestamp
     - duration

3. **Viewing Data**
   - Calendar View: See daily trading activity and P&L
   - Analytics: View detailed charts and statistics
   - AI Insights: Get AI-powered analysis of your trading patterns

## File Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Main page components
├── types/            # TypeScript interfaces
├── config/           # Configuration files
├── App.tsx           # Main application component
└── main.tsx         # Application entry point
```

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Chart.js
- React Router
- OpenAI API (for trading insights)
- XLSX (for Excel file processing)
- Lucide React (for icons)
- Headless UI (for accessible components)

## Environment Variables

For the AI insights feature to work, you'll need to set up your OpenAI API key. Create a `.env` file in the root directory:

```env
VITE_OPENAI_API_KEY=your_api_key_here
```

## Browser Support

The application supports all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Local Storage

The application uses browser local storage to persist:

- Trading accounts
- Trading data
- Theme preferences

Clear your browser's local storage to reset all data.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
