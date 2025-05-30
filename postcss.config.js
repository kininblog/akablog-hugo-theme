
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.HUGO_ENVIRONMENT === 'production' ? { cssnano: {} } : {})
  }
}
