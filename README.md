# Seungho Shin — Academic Homepage

Personal academic website built with [Jekyll](https://jekyllrb.com/).
Design adapted from the template by [Susung Hong](https://github.com/SusungHong/susunghong.github.io).

**Live:** [0v0v.github.io](https://0v0v.github.io)

## Editing content

All page content lives in `_data/`:

| File | What it controls |
| --- | --- |
| `_data/bio.yml` | Intro paragraph on the About page |
| `_data/news.yml` | News list |
| `_data/papers.bib` | Publications (BibTeX). `selected={true}` shows the paper on the home page |
| `_data/education.yml` | Education timeline |
| `_data/honors.yml` | Honors & Awards |
| `_data/teaching.yml` | Teaching |
| `_data/services.yml` | Academic Services |

Site-wide settings (name, email, social links, profile image) are in `_config.yml`.

### Publication figures

Drop figure images into `assets/img/publication_preview/` and reference the
filename in `_data/papers.bib` via `preview={your-figure.jpg}`. The four files
currently in that folder are placeholders — replace them with your own figures
(any image format works; if you change the extension, update the matching
`preview=` line in `papers.bib`).

## Local preview

```bash
bundle install
bundle exec jekyll serve --host 127.0.0.1 --port 4000
```

Open `http://127.0.0.1:4000`.

## Deploy

This site uses plugins (`jekyll-scholar`) that the default GitHub Pages build
does not support, so it is built with GitHub Actions
(`.github/workflows/deploy.yml`).

**One-time setup:** on GitHub, go to **Settings → Pages → Build and deployment →
Source** and select **GitHub Actions**. After that, every push to `main`
rebuilds and deploys the site automatically.
