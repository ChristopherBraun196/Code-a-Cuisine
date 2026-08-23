# Code a Cuisine

Smarte Webanwendung mit KI-Automatisierungen: aus vorhandenen Zutaten werden automatisch passende Rezepte generiert. Zielgruppe: Hobbyköch:innen und WG-Bewohner:innen – Ziel ist weniger Lebensmittelverschwendung sowie abwechslungsreiches, gesundes Kochen. Alle generierten Rezepte sind über eine öffentliche Bibliothek einsehbar (ohne Account).

Projekt der Developer Akademie (Abschlussprojekt "Join 2024"), Vorgaben siehe [Checklist/Code-a-Cuisine.pdf](Checklist/Code-a-Cuisine.pdf).

## Tech-Stack

- **Frontend:** Angular ausschließlich V22, Stylesheets: SCSS, ohne SSR
- **Backend/Automatisierung:** n8n-Workflows (KI-Rezeptgenerierung, Validierung, Fehlerbehandlung), lokal via Docker; Hosting für Portfolio noch offen (vServer nötig, kein Shared-Hosting)
- **KI-Modell:** Google Gemini 3.5 Flash (bereits beim Vorgängerprojekt "Join" eingesetzt)
- **Datenhaltung:** Firebase **Realtime Database** (alle generierten Rezepte werden dort gespeichert)
- **Design:** Figma-Mockup vorhanden

## Offene Punkte

- Bedeutung "Recipe Charts" (Checkliste Punkt 3) noch zu klären
- n8n-Hosting fürs Portfolio: all-inkl-Paket ist "Privat+" (Shared-Hosting, kein Docker/persistente Prozesse möglich) → für Produktivbetrieb später vServer (all-inkl) oder externer Cloud-Server (z.B. Hetzner) nötig. Für die Projektlaufzeit läuft n8n lokal via Docker, Hosting-Entscheidung ist vertagt.
- Keine feste Deadline, aber Ziel: schnellstmöglicher Abschluss

## Lernmodus (wichtig)

Bei echten Code-Änderungen (Logik, Komponenten, Funktionen) schreibe/editiere ich als Claude die Dateien **nicht selbst**. Ich erkläre Datei, Stelle, Änderung und Warum – der User tippt es selbst. Ausnahme: rein mechanische Dinge ohne Lern-Wert (Doku/Kommentare, Config-Dateien, git-Befehle) sowie explizite Freigabe ("mach du das direkt").

## Konventionen

- Kommunikation & Code-Kommentare: Deutsch
- Variablen/Funktionen: camelCase
- IDs: camelCase
- CSS-Klassennamen: kebab-case
- Klassen/Komponenten: PascalCase
- Konstanten: SCREAMING_SNAKE_CASE
- Semantisches HTML5, keine Div-Suppe
- Font-Size: mind. 16px, Kleingedrucktes nicht unter 14px
- Alle Funktionen mit JSDoc dokumentieren

## Fachliche Kernanforderungen (aus Checkliste)

- **Zutaten-Eingabe:** Zutaten inkl. Menge (Gramm/Stück/Liter) hinzufügen/entfernen, mind. 1 Zutat erforderlich
- **Portionen:** 1–12 Personen, Standard 2, Mengen skalieren automatisch
- **Zeitrahmen:** Kategorien "Schnell (≤20 Min)", "Mittel (20–45 Min)", "Aufwendig (45+ Min)"
- **Kochstil:** Deutsch, Italienisch, Japanisch, Indisch, Gourmet/Fine Dining, Fusion
- **Diät:** Vegetarisch, Vegan, Keto, keine Einschränkung
- **Kochhelfer:** 1–3 Personen, System schlägt Arbeitsaufteilung/parallele Schritte vor
- **Rezeptvorschläge:** genau 3 Vorschläge, je ≥70% der eingegebenen Zutaten nutzend, max. 3 zusätzliche Basiszutaten, unterschiedliche Zubereitungsart/Geschmack
- **Zubereitungsanleitung:** chronologisch, parallele Schritte markiert, Wartezeiten sinnvoll genutzt, anfängerverständlich
- **Nährwertanalyse:** Kalorien + Makros (Protein/Kohlenhydrate/Fett) pro Portion und gesamt
- **Quota-System:** 3 Rezepte pro IP pro Tag, system-weit max. 12 Rezepte/Tag, Frontend-Validierung + n8n-Rate-Limiting als Kostenairbag, IPv4+IPv6, klare Fehlermeldung bei Überschreitung
- **Rezeptbibliothek:** alle Rezepte, Titel/Kochzeit/Kochstil sichtbar, Detailansicht, ohne Account zugänglich, Paginierung ab 20 Rezepten, Filter nach Kochstil
- **Weitere Seiten:** Impressum

## n8n-Anforderungen

- Workflows in Git eingecheckt, aussagekräftige Node-Namen/Beschreibungen
- Fehlerbehandlung: Error-Trigger + E-Mail-Benachrichtigung bei Fehlern
- Eingaben aus Angular im Workflow nochmals validieren
- Klar definierte JSON-Strukturen zwischen Angular und n8n

## UX / Responsive

- Desktop, Tablet, Smartphone; Touch-Bedienung optimiert
- Recipe Charts auch auf kleinen Screens gut lesbar
- Ladezeit der Rezeptgenerierung ansprechend überbrücken (z.B. Loading-State)

## Git-Workflow

- GitHub von Anfang an nutzen, nach jeder Coding-Session committen
- Aussagekräftige Commit-Messages, gepflegtes .gitignore
- README.md im Repo vorhanden
