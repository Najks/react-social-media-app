﻿# React aplikacija za družabna omrežja

## Opis

To je MERN (MongoDB, Express.js, React.js, Node.js) aplikacija za družabna omrežja. Omogoča uporabnikom ustvarjanje računov, objavljanje posodobitev, sledenje drugim uporabnikom ter interakcijo z njihovimi objavami preko všečkov in komentarjev.

## Namestitev

1. Klonirajte repozitorij: `git clone https://github.com/najks/react-social-media-app.git`
2. Poiščite se v direktoriju projekta: `cd aplikacija-družabnih-omrežij`
3. Namestite odvisnosti: `npm install`
4. Ustvarite datoteko `.env` v korenskem direktoriju in dodajte naslednje okoljske spremenljivke:
    - `MONGODB_URI`: Povezovalni niz za MongoDB
    - `JWT_SECRET`: Skrivni ključ za JSON Web Token-e
    - `PORT`: Številka vrata za strežnik (neobvezno, privzeto je 5000)
5. Zaženite razvojni strežnik: `npm run dev`

## Uporaba

- Registrirajte nov račun ali se prijavite z obstoječim.
- Ustvarjajte objave in delite posodobitve s svojimi sledilci.
- Všečkajte in komentirajte objave drugih uporabnikov.
- Sledite drugim uporabnikom, da vidite njihove objave na svojem viru.
- Urejajte ali brišite svoje objave.


