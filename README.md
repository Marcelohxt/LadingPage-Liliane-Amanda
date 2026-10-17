# Landing page TENOTEC

Página estática (HTML, CSS e JS puros) da TENOTEC, com a Eng. Liliane Amanda da Silva:
vistorias técnicas sanitárias, consultoria de processos e implantação de ERP (Sienge, Mega, SAP).

## Rodar localmente

```bash
python -m http.server 5173
```

Abra http://localhost:5173.

## Publicar na Vercel

1. Em vercel.com, **Add New > Project** e importe este repositório.
2. Framework Preset: **Other**. Sem build command, output directory em branco.
3. Deploy. Cada push na `main` publica de novo automaticamente.

## Ajustes rápidos

- **Foto da Liliane**: salve como `liliane.jpg` na raiz e troque `<span>LA</span>` em `index.html`
  por `<img src="liliane.jpg" alt="Eng. Liliane Amanda da Silva">`.
- **WhatsApp**: número em `script.js` (`WHATSAPP`) e nos links `wa.me` do `index.html`.
