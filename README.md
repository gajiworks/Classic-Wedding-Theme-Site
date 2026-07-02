# Classic Theme Wedding

ClassicThemeWedding is a responsive Blazor wedding website styled as a Classic White Elegance invitation. It uses white, ivory, champagne, and soft-gold details with editorial layouts, subtle paper textures, and restrained animations.

## Features

- Split invitation-style hero with layered paper and folded-corner effects
- Editorial Our Story layout with a framed couple portrait
- Invitation-style ceremony, reception, and date cards
- Responsive wedding-album gallery with popup previews
- StaticForms RSVP form with loading, validation, duplicate-submit prevention, inline errors, and a success modal
- Reduced-motion support and responsive layouts for desktop, tablet, and mobile
- Matching Blazor and static `docs/` versions

## Project structure

```text
ClassicWeddingTheme/
|-- ClassicWeddingTheme/       # Blazor application
|   |-- Components/Pages/      # Page components
|   `-- wwwroot/               # CSS, JavaScript, images, and RSVP config
|-- docs/                      # Static GitHub Pages-compatible version
`-- ClassicWeddingTheme.slnx   # Solution file
```

The application assembly name is `ClassicThemeWedding` while the existing project folder and solution retain their original `ClassicWeddingTheme` names.

## Requirements

- .NET 10 SDK

## Run locally

```powershell
dotnet run --project ClassicWeddingTheme\ClassicWeddingTheme.csproj
```

The HTTP launch profile uses:

```text
http://localhost:5109
```

## Build

```powershell
dotnet build ClassicWeddingTheme.slnx -c Release
```

## RSVP and StaticForms

The RSVP form submits to StaticForms. The repository contains only this safe placeholder:

```text
__STATIC_FORMS_API_KEY__
```

For GitHub deployment, create a repository secret named:

```text
STATIC_FORMS_API_KEY
```

Inject that secret only into the temporary deployment artifact. Never commit the real API key. Local launch settings intentionally use the placeholder value.

The approved RSVP fields are currently:

- Full Name
- Message

## Static version

The `docs/` directory mirrors the Blazor homepage for static hosting. When changing page content or styling, keep these surfaces synchronized:

- `ClassicWeddingTheme/Components/Pages/Home.razor`
- `ClassicWeddingTheme/wwwroot/app.css`
- `ClassicWeddingTheme/wwwroot/gallery.js`
- `docs/index.html`
- `docs/assets/css/app.css`
- `docs/assets/js/site.js`

Increment the local CSS or JavaScript version query string in `docs/index.html` whenever those static assets change.

## Theme palette

- White and ivory backgrounds
- Champagne and soft-gold borders
- Beige paper textures
- Charcoal typography

Strong pink, heavy floral decoration, and playful pastel styling are intentionally avoided.
