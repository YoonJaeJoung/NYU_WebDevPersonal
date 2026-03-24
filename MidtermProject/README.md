# Modern Art Library - Midterm Project

**This is the midterm up-to-date version as of March 24.**

This is where the assignment submission and grading will take place.

## Links & Presentation
- **Public Website**: [https://yoonjaejoung.github.io/ModernArtGuide/index.html](https://yoonjaejoung.github.io/ModernArtGuide/index.html)
- **Github Repository**: [https://github.com/yoonjaejoung/ModernArtGuide](https://github.com/yoonjaejoung/ModernArtGuide) (I separated the live version of code to a different private repository for future development/updates and github page support. Files are copied here for the midterm project submission.)
- **Presentation**: `presentation.pdf` is the file used for the presentation.

## Project Context

Modern Art Library is a class project website for NYU Web Development.
This site introduces modern art movements, key artists, and representative artworks, based on content from a modern art course. It can be further used as a guide to visit museums in NYC.

- **Course**: NYU Web Development (Midterm Project)
- **Content source**: Materials from NYU CAS Modern Art course
- **Submission workflow**: Code from the live repository has been copied/uploaded to this WebDev course repository for grading.

## Core Idea

The website is designed to help users:
- compare major modern art movements
- discover important artworks and artists in each movement
- understand how one movement shifts into the next
- use the site as a practical guide for seeing artworks in NYC museums

## Site Structure

- **Landing page / Movements** (`index.html`) — Visual overview of 14 movements as an interactive book stack.
- **Artists** (`artists.html`) — Interactive bookshelf of key artists, sorted by birth year.
- **Gallery** (`gallery.html`) — A clean, unified grid layout showcasing all artworks across modern art movements.
- **Museums** (`museums.html`) — Interactive bookshelf of museums, sorted alphabetically.
- **About** (`about.html`) — Project info and technical background, styled with shared design system.

## Directory Structure

```text
MidtermProject/
├── about.html
├── artists.html
├── gallery.html
├── index.html
├── museums.html
├── README.md
├── presentation.pdf
├── artists/
│   └── artist.html
├── artworks/
│   └── artwork.html
├── assets/
│   ├── css/
│   │   ├── base.css
│   │   ├── book-stack.css
│   │   ├── components.css
│   │   ├── layout.css
│   │   └── responsive.css
│   ├── data/
│   │   ├── artists.json
│   │   ├── artworks.json
│   │   ├── movements.json
│   │   └── museums.json
│   ├── images/
│   └── js/
│       ├── artist-page.js
│       ├── artwork-page.js
│       ├── movement-page.js
│       ├── museum-page.js
│       └── nav.js
├── movements/
│   └── movement.html
├── museums/
│   └── museum.html
├── proposal/
│   └── proposal.md
└── resource/
    └── classNotes.md
```

### Note on Directory Structure
Originally, I made a separate HTML file for each specific movement, artist, artwork, and museum detail page. However, I migrated to storing the data in JSON (`assets/data/`) and using template pages to dynamically load the content. Thus, the template files (`artist.html`, `artwork.html`, `movement.html`, and `museum.html`) are currently inside their respective folders. As a next step in the future, I will group these template files into a single `subpage` folder for better organization.

## Data Architecture

All content is stored in JSON files under `assets/data/`:
- `movements.json` — 14 art movements with colors, periods, and descriptions
- `artists.json` — 33 artists with bios, photos, and movement associations
- `artworks.json` — 40+ artworks with images, descriptions, and museum references
- `museums.json` — 22 museums with descriptions, photos, addresses, and highlights

## Technical Focus

### Skills currently being applied
- Semantic HTML elements (navigation, images, buttons, sections)
- CSS and box model
- CSS positioning
- Flexbox and Grid
- Vanilla JavaScript (for data fetching and page population)
- Responsive Design (Media Queries)

## Planning Documents

- [Project proposal](proposal/proposal.md)
