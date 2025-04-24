# React Table Demo

A comprehensive table component built with React, Redux Toolkit, and Tailwind CSS that includes features like pagination, sorting, filtering, and Excel export.

## Features

- Table with dummy data
- Pagination (10 entries per page)
- Global search filtering
- Column sorting (ascending/descending)
- Mobile responsive design
- Excel export functionality
- Form with validation
- Redux state management

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000`

## Usage

1. **Table Features:**
   - Use the search input to filter data across all columns
   - Click on column headers to sort (ascending/descending)
   - Navigate through pages using Previous/Next buttons
   - Export data to Excel using the Export button

2. **Form Features:**
   - Fill in the form with required information
   - Submit the form to add new entries to the table
   - Form includes validation for all fields

## Technologies Used

- React
- Redux Toolkit
- React Hook Form
- React Icons
- SheetJS (xlsx)
- Tailwind CSS

## Project Structure

```
src/
  ├── components/
  │   ├── Table.js
  │   └── Form.js
  ├── store/
  │   ├── index.js
  │   └── tableSlice.js
  ├── App.js
  ├── index.js
  └── index.css
``` 