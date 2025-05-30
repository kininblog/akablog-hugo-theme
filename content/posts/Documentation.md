---
title: "Dokumentasi Tema Akablog"
date: 2024-07-20T10:05:00+07:00
draft: false
author: "Tim Akablog" # Anda bisa mengganti ini
tags: ["Hugo", "Tema", "Dokumentasi", "Tailwind CSS"]
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoQy0YpVepTLYfYgMFRiIYjdPbGXvbIjw7wg&s" # Contoh path gambar, Anda perlu menyediakannya
description: "Dokumentasi lengkap untuk tema Akablog Hugo, mencakup instalasi, konfigurasi, fitur, dan kustomisasi."
# toc: true
---

# Tema Akablog Hugo

Tema blog yang dibuat menggunakan generator situs statis Hugo, di-styling dengan framework CSS Tailwind, dan beberapa aspek pengembangannya dibantu oleh Gemini AI.

## Fitur Utama

*   **Desain Modern & Responsif:** Tampilan yang bersih, minimalis, dan menyesuaikan diri dengan berbagai ukuran layar (desktop, tablet, mobile).
*   **Mode Terang & Gelap:** Pilihan tema terang dan gelap yang dapat diubah oleh pengguna dan preferensinya akan disimpan.
*   **Daftar Postingan dengan Paginasi:** Navigasi yang mudah antar halaman daftar postingan.
*   **Widget Postingan Terbaru:** Menampilkan beberapa postingan terbaru dengan layout yang menarik di halaman beranda.
*   **Penyorot Sintaks (Syntax Highlighter):** Menggunakan Prism.js untuk menampilkan blok kode dengan nomor baris dan tombol salin.
*   **Kartu Postingan yang Informatif:** Menampilkan judul, ringkasan, tanggal, penulis (opsional), dan tag.
*   **Gambar Thumbnail Proporsional:** Gambar pada kartu postingan mempertahankan rasio aspek 16:9.
*   **Menu Navigasi Dropdown:** Mendukung menu bertingkat untuk navigasi yang lebih terstruktur, berfungsi baik di desktop maupun mobile.
*   **SEO Friendly:** Dilengkapi dengan meta tag dasar, Open Graph, dan Twitter Card.
*   **Dukungan Komentar Disqus:** Integrasi mudah untuk sistem komentar Disqus (opsional, dapat dikonfigurasi).
*   **Breadcrumbs:** Membantu navigasi pengguna di dalam situs.
*   **Artikel Serupa (Related Posts):** Menampilkan artikel terkait di bawah setiap postingan.
*   **Mudah Dikonfigurasi:** Pengaturan utama dapat diubah melalui file `config.txt` (atau `hugo.toml`/`config.yaml`).

## Asal Usul Tema

Tema Akablog ini dikembangkan sebagai eksplorasi dalam pembuatan tema Hugo yang modern dan fungsional. Proses pengembangannya melibatkan:
*   **Hugo:** Sebagai generator situs statis yang cepat dan fleksibel.
*   **Tailwind CSS:** Untuk styling yang efisien dan kustomisasi desain yang mendalam.
*   **Gemini AI:** Digunakan sebagai asisten dalam berbagai aspek pengembangan, termasuk pembuatan beberapa bagian kode, debugging, dan penulisan konten awal untuk dokumentasi ini.

## Instalasi

1.  **Prasyarat:**
    *   Pastikan Anda telah menginstal [Hugo (versi extended)](https://gohugo.io/getting-started/installing/) versi **0.123.0** atau lebih baru.
    *   Node.js dan npm (atau yarn) untuk mengelola dependensi Tailwind CSS.

2.  **Tambahkan Tema ke Proyek Hugo Anda:**
    *   **Sebagai Git Submodule (Direkomendasikan):**
        ```bash
        cd your-hugo-site
        git submodule add https://github.com/username/akablog.git themes/akablog # Ganti dengan URL repositori tema yang benar
        git submodule update --init --recursive
        ```
    *   **Sebagai Modul Hugo:**
        Di file `config.txt` (atau `hugo.toml`/`config.yaml`) proyek Anda, tambahkan:
        ```toml
        [module]
          [[module.imports]]
            path = "github.com/username/akablog" # Ganti dengan path repositori tema yang benar
        ```
        Lalu jalankan: `hugo mod get -u`

    *   **Download Manual:**
        Unduh ZIP tema dari repositori, ekstrak, dan letakkan di folder `themes/akablog` proyek Hugo Anda.

3.  **Konfigurasi Tema:**
    Atur tema di file konfigurasi utama Hugo Anda (misalnya, `config.txt`):
    ```toml
    theme = "akablog"
    ```

4.  **Setup Tailwind CSS:**
    Tema ini menggunakan Hugo Pipes untuk memproses Tailwind CSS.
    *   Salin file `tailwind.config.js`, `postcss.config.js`, dan `package.json` dari direktori root tema Akablog (jika Anda mengkloningnya secara terpisah) atau dari contoh proyek ke direktori root situs Hugo Anda.
    *   Buka terminal di root situs Hugo Anda dan jalankan:
        ```bash
        npm install
        ```
        atau jika Anda menggunakan Yarn:
        ```bash
        yarn install
        ```
    Ini akan menginstal Tailwind CSS dan dependensi lainnya yang diperlukan.

## Konfigurasi Tema (`config.txt` atau `hugo.toml`)

Berikut adalah contoh konfigurasi penting dan parameter yang bisa Anda atur di file konfigurasi utama situs Hugo Anda.

```toml
baseURL = "https://example.com/"
languageCode = "id-id" # Atau 'en-us', dll.
title = "Blog Saya dengan Akablog"
theme = "akablog"
paginate = 5 # Jumlah postingan per halaman di daftar
copyright = "© {year} Nama Anda. Hak Cipta Dilindungi." # {year} akan diganti otomatis

# Untuk mengelola aset yang diproses Hugo Pipes
[build]
  writeStats = true
  [build.processing]
    [build.processing.css]
      [build.processing.css.tailwind]
        version = 3
        [build.processing.css.tailwind.config]
          file = "tailwind.config.js" # Pastikan path ini benar relatif ke root situs

[params]
  defaultTheme = "dark"  # Bisa "light", "dark", atau "" (kosong untuk preferensi sistem)
  author = "Nama Penulis Utama"
  description = "Deskripsi singkat situs Anda untuk SEO."
  site_name = "Akablog" # Nama situs yang tampil di header

  # Format tanggal
  dateFormatSingle = "2 January 2006" # Untuk halaman postingan tunggal
  dateFormatList = "Jan 2, 2006"     # Untuk daftar postingan

  # Bagian konten utama yang dianggap sebagai postingan (untuk daftar di beranda, RSS, dll.)
  mainSections = ["posts", "blog"] # Sesuaikan dengan nama direktori konten Anda

  # Favicon (letakkan di folder static/ situs Anda)
  favicon = "/favicon.ico"
  # Gambar Open Graph default (digunakan jika halaman tidak punya gambar spesifik)
  og_image = "/images/og-default.png" # Letakkan di static/images/

  # Disqus (opsional)
  disqusShortname = "nama-pendek-disqus-anda" # Ganti atau kosongkan jika tidak pakai

  # Tautan Sosial Media di Footer
  twitter = "https://twitter.com/username"
  linkedin = "https://linkedin.com/in/username"
  email = "mailto:email@example.com"
  # rss_feed = "/index.xml" # Path default RSS sudah di-handle Hugo
  # add_to_feedly = "https://feedly.com/i/subscription/feed/" # URL dasar Feedly

  # Tampilkan "Powered by Hugo & Akablog Theme" di footer
  showPoweredBy = true

  # Pengaturan Breadcrumb
  homeBreadcrumb = "Beranda" # Teks untuk tautan beranda

# Pengaturan Markdown
[markup]
  [markup.goldmark.renderer]
    unsafe = true # Izinkan HTML mentah jika diperlukan
  [markup.highlight]
    # noClasses = false # PENTING: Biarkan false agar Prism.js dapat bekerja
    codeFences = true
    guessSyntax = true
    lineNos = true # Bisa true jika ingin Hugo yang generate nomor baris, tapi Prism.js juga punya fitur ini
    lineNumbersInTable = false # Jangan gunakan tabel jika Prism.js yang menangani nomor baris
    noClasses = false # PENTING: biarkan false agar Prism.js dapat mendeteksi bahasa
    style = "prism" # Atau gaya bawaan Chroma lain jika Anda tidak ingin Prism.js
  [markup.tableOfContents]
    startLevel = 2
    endLevel = 4 # Sesuaikan kedalaman ToC
    ordered = false

# Pengaturan Menu Navigasi (contoh)
[menu]
  [[menu.main]]
    identifier = "blog"
    name = "Blog"
    url = "/posts/"
    weight = 10
  [[menu.main]]
    identifier = "projects"
    name = "Proyek"
    url = "/projects/"
    weight = 20
  [[menu.main]]
    identifier = "about"
    name = "Tentang"
    url = "/about/"
    weight = 30
  [[menu.main]]
    identifier = "documentation" # Identifier untuk halaman dokumentasi
    name = "Dokumentasi"
    url = "/posts/documentation/" # Path ke postingan dokumentasi
    weight = 40
  [[menu.main]]
    identifier = "more"
    name = "Lainnya"
    url = "#" # Induk untuk dropdown
    weight = 50
  [[menu.main]]
    identifier = "contact"
    name = "Kontak"
    url = "/contact/"
    parent = "more" # Item anak dari "Lainnya"
    weight = 1

# Pengaturan Output
[outputs]
  home = ["HTML", "RSS"]
  section = ["HTML", "RSS"]
  taxonomy = ["HTML", "RSS"]
  term = ["HTML", "RSS"]
```

### Penjelasan Konfigurasi Penting:

*   **`baseURL`**: URL utama situs Anda. Penting untuk produksi.
*   **`theme`**: Harus diatur ke `"akablog"`.
*   **`paginate`**: Jumlah postingan yang ditampilkan per halaman pada daftar postingan.
*   **`params.defaultTheme`**: Tema awal yang dilihat pengguna baru (`"light"`, `"dark"`, atau `""` untuk mengikuti preferensi sistem).
*   **`params.mainSections`**: Daftar direktori di `content/` yang dianggap sebagai sumber postingan utama (misalnya, `["posts", "artikel"]`).
*   **`params.disqusShortname`**: Jika Anda menggunakan Disqus untuk komentar, masukkan nama pendek Disqus Anda di sini. Kosongkan untuk menonaktifkan komentar.
*   **`markup.highlight.noClasses = false`**: Penting agar Prism.js bisa bekerja dengan menambahkan kelas `language-xxxx` pada blok kode.
*   **`menu.main`**: Definisikan item-item menu navigasi Anda di sini. Untuk membuat dropdown, gunakan `parent` yang menunjuk ke `identifier` item menu induk.
*   **`build.processing.css.tailwind.config`**: Path ke file `tailwind.config.js` Anda, relatif dari root situs Hugo. Biasanya `tailwind.config.js`.

## Struktur Konten

*   **Postingan Blog**: Buat file Markdown di dalam direktori yang Anda tentukan di `mainSections` (misalnya, `content/posts/`).
*   **Halaman Statis**: Seperti "Tentang", "Kontak", buat file Markdown langsung di `content/` (misalnya, `content/about.md`).
*   **Front Matter**: Setiap file konten harus memiliki front matter (metadata di bagian atas file). Gunakan `archetypes/default.md` sebagai template. Contoh penting:
    *   `title`: Judul postingan/halaman.
    *   `date`: Tanggal publikasi.
    *   `author`: Nama penulis (opsional, akan menggunakan `params.author` jika tidak ada).
    *   `tags`: Daftar tag (misalnya, `["Teknologi", "Desain"]`).
    *   `image`: Path ke gambar unggulan postingan (misalnya, `/images/post/gambar-saya.jpg`). Gambar diletakkan di folder `static/images/post/`.
    *   `description`: Deskripsi singkat untuk SEO dan pratinjau.

## Penyorot Sintaks (Prism.js)

Tema ini terintegrasi dengan Prism.js untuk menyorot blok kode.

*   **Fitur**: Nomor baris, tombol salin, dan deteksi bahasa otomatis.
*   **Bahasa yang Didukung**: JavaScript, Python, HTML, CSS, Bash, Go, JSON, YAML, SQL, dan banyak lagi (sesuai build Prism.js yang disertakan).
*   **Penggunaan**:
    ```markdown
    ```javascript
    function sapa(nama) {
      console.log("Halo, " + nama + "!");
    }
    sapa("Dunia");
    ```
    ```

```js
console.log('Hello World');
```

*   **Kustomisasi Bahasa/Plugin Prism.js**:
    1.  Kunjungi [situs Prism.js](https://prismjs.com/download.html).
    2.  Pilih tema ("Default" direkomendasikan untuk konsistensi), bahasa, dan plugin yang diinginkan.
    3.  Unduh file `prism.css` dan `prism.js`.
    4.  Ganti file yang ada di `themes/akablog/static/vendor/prism/` dengan file baru Anda.

## Kustomisasi Lanjutan

*   **Styling**: Modifikasi utama dilakukan melalui `tailwind.config.js` untuk mengubah skema warna, font, spasi, dll. Untuk penyesuaian CSS yang lebih spesifik atau penambahan komponen, Anda bisa mengedit `themes/akablog/assets/css/style.css`. Hugo akan memproses file ini dengan PostCSS dan Tailwind.
*   **Layouts**: Untuk mengubah struktur HTML, Anda dapat menyalin partial dari `themes/akablog/layouts/partials/` ke `layouts/partials/` di root proyek Anda dan memodifikasinya. Hal yang sama berlaku untuk layout halaman lainnya.
*   **Data Tags**: Warna tag dapat dikustomisasi melalui `themes/akablog/data/tag_styles.json`. Kunci JSON harus merupakan versi URL-friendly dari nama tag (misalnya, "Tutorial Koding" menjadi "tutorial-koding").

## Pengembangan dengan Gemini AI

Sebagai catatan transparansi, beberapa bagian dari kode tema ini, termasuk struktur awal beberapa template, logika JavaScript, dan draf awal dokumentasi ini, dikembangkan dengan bantuan model bahasa besar Gemini AI. Ini membantu mempercepat proses pengembangan dan mengeksplorasi berbagai pendekatan implementasi.

## Berkontribusi

Jika Anda menemukan bug atau memiliki ide untuk fitur baru, silakan buat *issue* atau *pull request* di repositori GitHub tema ini.

## Lisensi

Tema Akablog dirilis di bawah Lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.
