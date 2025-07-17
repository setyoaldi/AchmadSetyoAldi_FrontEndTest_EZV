# 🧾 TODO-APP

A clean and modern Todo app built with Next.js, TypeScript, RTK Query, and TailwindCSS.

## 📁 Project Structure

```bash
TODO-APP/
├── public/                     # Static assets (images, icons, etc.)
├── src/                        # Main source code
│   ├── app/
│   │   ├── isr/
│   │   │   └── page.tsx        # ISR page example
│   │   ├── layout.tsx         # Main layout component
│   │   └── page.tsx           # Root page (homepage)
│   ├── lib/
│   │   ├── api/
│   │   │   ├── todos.ts       # RTK Query API definitions
│   │   │   ├── provider.tsx   # Redux Provider setup
│   │   │   └── store.ts       # Redux store configuration
│   │   └── styles/
│   │       └── globals.css    # Global CSS styling
│   └── types/
│       └── todo.ts            # TypeScript types for Todo items
├── .gitignore                  # Files/directories to ignore in Git
├── eslint.config.mjs          # ESLint configuration
├── next-env.d.ts              # Next.js environment types
├── next.config.ts             # Next.js configuration
├── package.json               # Project metadata and dependencies
├── postcss.config.mjs         # PostCSS configuration
├── README.md                  # Project documentation
├── tsconfig.json              # TypeScript configuration
```

## Requirement

- Node Js v20
- NPM v10

## Installation

- git clone https://github.com/setyoaldi/AchmadSetyoAldi_FrontEndTest_EZV
- cd AchmadSetyoAldi_FrontEndTest_EZV
- git pull
- npm install

## Running the apps

- npm run dev

## Pendekatan dan Strategi

1. **Pengambilan Data Todo (GET)**  
   Data todo diambil menggunakan `useGetTodosQuery` dari RTK Query, dengan parameter query `_start` dan `_limit` untuk mendukung pagination. Setiap halaman memuat 10 item.

2. **Penambahan Todo (POST)**  
   Formulir akan mengirim data todo baru menggunakan `useAddTodoMutation` ke endpoint:  
   `POST https://jsonplaceholder.typicode.com/todos`

   > **Catatan:** JSONPlaceholder adalah API dummy, sehingga data tidak benar-benar disimpan, hanya memberikan respons seolah-olah berhasil.

3. **Pagination**  
   Pagination diterapkan menggunakan offset (`_start`) dan batas (`_limit`), dengan tombol navigasi seperti **Prev**, **Next**, dan nomor halaman yang dirender secara dinamis.

4. **SSR (Server-Side Rendering)**  
   Untuk halaman tertentu (`app/todos/page.tsx`), digunakan `getServerSideProps` agar data dimuat langsung dari server saat halaman diakses.

5. **ISR (Incremental Static Regeneration)**  
   Pada halaman lain digunakan `getStaticProps` dengan opsi `revalidate: 10`, yang memungkinkan halaman dirender secara statis lalu diregenerasi otomatis setiap 10 detik.

## Beberapa fitur tambahan

- Pengubahan status item Todo secara lokal
- Todo yang baru ditambahkan akan tampil otomatis pada urutan teratas namun hanya secara lokal
- Ada notifikasi yang ditampilkan ketika item Todo ditambahkan atau statusnya diubah
- Ada semacam widget untuk menampilkan status todo
