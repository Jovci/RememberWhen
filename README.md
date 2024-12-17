# RememberWhen - Installation Instructions

Download the files from the repository:  
[https://github.com/Jovci/RememberWhen](https://github.com/Jovci/RememberWhen)

The following libraries and tools must be installed before the application can be run:

- **Frontend Dependencies**: React, Next.js, MUI (Material UI), Mapbox GL  
- **Backend Dependencies**: Supabase (PostgreSQL, Auth, Storage), dotenv  
- **Other Utilities**: uuid, axios, @supabase/supabase-js, tailwindcss, mapbox-gl  
- **Development Tools**: Node.js (v16 or higher), npm or yarn, Git  

---

## Step-by-Step Instructions

### 1. Clone the Repository  
Open a terminal and run:  
```bash
git clone https://github.com/Jovci/RememberWhen.git  
cd RememberWhen  
```
### 2. Install Dependencies
Install all required packages using npm or yarn:
```bash
npm install
```
or
```bash
yarn install
```
### 3. Set Up Environment Variables
Create a .env.local file in the root directory and include the following:
```bash
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>  
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>  
MAPBOX_ACCESS_TOKEN=<your_mapbox_access_token>  
```
Replace <your_supabase_project_url>, <your_supabase_anon_key>, and <your_mapbox_access_token> with the actual keys from your Supabase and Mapbox accounts.

### 4. Start the Development Server
Run the development server locally:
```bash
npm run dev
```
or
```bash
yarn dev
```
Once the server starts, access the application at:
http://localhost:3000
