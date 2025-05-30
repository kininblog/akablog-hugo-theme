
# Akablog Hugo Theme

Akablog is a clean, modern blog theme for Hugo, designed to replicate a specific UI. It features light/dark mode, responsive design, and a focus on content readability.

## Minimum Hugo Version

This theme requires Hugo version **0.123.0** or higher.

## Installation & Setup

1.  **Add Theme to Your Hugo Site:**
    You can either clone this theme into your `themes` directory:
    ```bash
    git clone https://github.com/yourusername/akablog.git themes/akablog 
    ```
    Or, add it as a Hugo Module. In your site's `config.toml` (or `hugo.toml`):
    ```toml
    [module]
      [[module.imports]]
        path = "github.com/yourusername/akablog" # Replace with actual path if hosted
    ```
    Then run `hugo mod get -u`.

2.  **Configure `config.toml`:**
    Set the theme in your site's `config.toml`:
    ```toml
    theme = "akablog"
    ```
    Review the provided `config.toml` in the root of this project for recommended settings, including `[params]`, menus, and build configurations for Tailwind CSS.

3.  **Tailwind CSS Setup (Hugo Pipes):**
    This theme uses Tailwind CSS via Hugo Pipes.
    *   Ensure you have Node.js and npm/yarn installed.
    *   Copy `tailwind.config.js`, `postcss.config.js`, and `package.json` from the root of this example project to the root of *your* Hugo site.
    *   Install dependencies:
        ```bash
        npm install
        # or
        yarn install
        ```
    *   Hugo will now automatically process Tailwind CSS when you run `hugo server` or `hugo`.

4.  **Content Organization:**
    *   Blog posts should typically go into the `content/posts/` directory.
    *   Use the front matter fields specified in `archetypes/default.md` for your posts.
    *   Images referenced in posts (e.g., `image: "/images/my-post-image.jpg"`) should be placed in your site's `static/images/` directory.

5.  **Tag Styling:**
    Tag colors and styles are defined in `themes/akablog/data/tag_styles.json`. You can customize these. The key in the JSON should be the URL-ized version of your tag name (e.g., "Software Development" becomes "software-development").

## Theme Features

*   **Responsive Design:** Adapts to all screen sizes.
*   **Dark/Light Mode:** User-toggleable with persistence in local storage.
*   **Hero Section:** Prominent "THE BLOG" title on the homepage.
*   **Recent Posts Widget:** Asymmetrical grid on the homepage for the latest articles.
*   **Paginated Post Listings:** Standardized cards for all blog posts.
*   **Customizable Tags:** Styled tag pills.
*   **SEO Friendly:** Includes basic meta tags, Open Graph, and Twitter Card support.
*   **Syntax Highlighting:** For code blocks in posts (via Hugo's default Chroma).

## Customization

*   **Colors & Fonts:** Modify `tailwind.config.js` and `themes/akablog/static/css/style.css` (or more specifically `themes/akablog/assets/css/style.css` before processing). The Inter font is linked via Google Fonts in `baseof.html`.
*   **Partials:** Most theme components (header, footer, cards) are in `themes/akablog/layouts/partials/`. You can override these by creating files with the same name in your site's `layouts/partials/` directory.
*   **Logo/Site Name:** Configured in `config.toml` under `[params]site_name`.
*   **Favicon:** Add your `favicon.ico` to your site's `static/` folder and (optionally) an `apple-touch-icon.png`. Update `config.toml` if paths differ.

## Running Your Site

```bash
hugo server
```

This will start a local development server, usually at `http://localhost:1313/`.

## Building Your Site

```bash
hugo
```

This will generate your static site in the `public/` directory by default.
Ensure `NODE_ENV=production` or `HUGO_ENVIRONMENT=production` is set for minification during build if you are deploying.

Enjoy your new blog!
