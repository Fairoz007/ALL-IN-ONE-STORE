# ALL-IN-ONE-STORE

## About The Project

This project is a modern, full-stack e-commerce application designed to provide a seamless shopping experience. It features a complete storefront for customers and a powerful admin dashboard for managing the store. The application is built with a focus on performance, scalability, and user experience, leveraging the latest web technologies.

## Features

* **Admin Dashboard**: Manage products, categories, and orders.
* **Authentication**: User sign-up and login.
* **Product Catalog**: Browse and search for products.
* **Shopping Cart**: Add products to a cart and checkout.
* **Image Upload**: Upload product images using Vercel Blob.

## Tech Stack

* [Next.js](https://nextjs.org/) - React framework for production.
* [Supabase](https://supabase.io/) - Open source Firebase alternative.
* [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework.
* [Shadcn/ui](https://ui.shadcn.com/) - Re-usable components built using Radix UI and Tailwind CSS.
* [Zustand](https://github.com/pmndrs/zustand) - Small, fast and scalable bearbones state-management solution.
* [Vercel Blob](https://vercel.com/storage/blob) - A fast, easy, and reliable way to store files in the cloud.

## Getting Started

### Prerequisites

* Node.js (v18 or higher)
* pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ALL-IN-ONE-STORE.git
   ```
2. Navigate to the project directory:
   ```bash
   cd ALL-IN-ONE-STORE
   ```
3. Install the dependencies:
   ```bash
   pnpm install
   ```

### Environment Variables

Create a `.env.local` file in the root of the project and add the following environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_WHATSAPP_NUMBER=your-whatsapp-number
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

### Running the Development Server

To start the development server, run the following command:

```bash
pnpm dev
```

The application will be available at `http://localhost:3001`.

## Scripts

* `pnpm dev`: Starts the development server.
* `pnpm build`: Builds the application for production.
* `pnpm start`: Starts a production server.
* `pnpm lint`: Lints the code.
