source "https://rubygems.org"

gem "jekyll", "~> 4.3"
gem "webrick"
# Pin to the sassc-based converter (2.x). Jekyll 4.4 would otherwise pull
# jekyll-sass-converter 3.x -> sass-embedded, whose native extension fails to
# build on the GitHub Actions runner. sassc compiles reliably there.
gem "jekyll-sass-converter", "~> 2.0"

# Windows file-watching support for `jekyll serve`
gem "wdm", "~> 0.1.0" if Gem.win_platform?

group :jekyll_plugins do
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
  gem "jekyll-scholar"
end
