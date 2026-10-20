# TENOTEC · Landing page de LTA (Vigilância Sanitária SP)

Site estático (HTML, CSS e JS puros, sem build) publicado na Vercel a cada push na `main`.

| Arquivo | Para que serve |
|---|---|
| `index.html` | Landing page de LTA |
| `privacidade.html` | Política de privacidade (abre em `/privacidade`) |
| `config.js` | IDs do Google (GA4 e Ads) e número do WhatsApp |
| `tracking.js` | Consent Mode v2, gtag, UTM/gclid e evento `generate_lead` |
| `script.js` | Links de WhatsApp, formulário, menu, banner de cookies |
| `styles.css` | Estilos de todas as páginas |
| `img/` | Foto em WebP e imagem de compartilhamento (1200×630) |
| `robots.txt`, `sitemap.xml`, `vercel.json` | SEO e URLs sem `.html` |

## Rodar localmente

```bash
python -m http.server 5173
```

Abra http://localhost:5173. Para ver os itens pendentes, abra http://localhost:5173/?preview=1.

## Itens pendentes (escondidos no site até serem confirmados)

Tudo que tem a classe `pending` no `index.html` fica invisível para o público e aparece com contorno
laranja em `?preview=1`. Para publicar um item, preencha o texto e remova a classe `pending`.

- Garantia "ajustes sem custo adicional" (seção O que está incluído)
- Preço "Consultórios a partir de R$ 3.000" e pagamento 50% / 50% (seção Investimento)
- Card do segundo engenheiro: foto, nome, formação, CREA e experiência (seção Quem faz)
- Depoimentos e projetos atendidos (seção Prova social)

## Medição (antes de rodar anúncio)

1. Preencha `GA4_ID`, `ADS_ID` e `ADS_LEAD_LABEL` em `config.js`. Sem IDs, nada do Google é carregado.
2. O evento `generate_lead` dispara no clique de qualquer WhatsApp, no clique do telefone e no envio do
   formulário, com o parâmetro `cta` (`hero`, `investimento`, `contato`, `rodape`, `flutuante`,
   `barra-celular`, `form`, `telefone-…`). Com `ADS_LEAD_LABEL`, também dispara a conversão do Google Ads.
3. No GA4, marque `generate_lead` como evento principal (conversão) e registre `cta` como dimensão personalizada.
4. UTM e `gclid` da URL vão para o fim da mensagem do WhatsApp (ex.: `Origem: google / cpc / campanha-lta-sp`).
5. Teste no Tag Assistant (tagassistant.google.com) clicando no botão do WhatsApp.

## Domínio próprio

A URL canônica, o sitemap e as imagens de compartilhamento apontam para `https://lta.tenotec.com.br`.
Para ativar:

1. Na Vercel: projeto > Settings > Domains > Add `lta.tenotec.com.br`.
2. Na HostGator (Zona DNS): CNAME `lta` → `cname.vercel-dns.com`.
3. Depois que a Vercel mostrar "Valid Configuration", adicione o redirect 301 do endereço `.vercel.app`
   no `vercel.json`:

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "redirects": [
    {
      "source": "/:path*",
      "has": [{ "type": "host", "value": "lilianeamanda.vercel.app" }],
      "destination": "https://lta.tenotec.com.br/:path*",
      "permanent": true
    }
  ]
}
```

Se for usar outro domínio, troque `lta.tenotec.com.br` em `index.html`, `privacidade.html`,
`robots.txt` e `sitemap.xml`.

## Páginas por segmento ou cidade (futuro)

Copie `index.html` para, por exemplo, `lta-escola-creche.html` (abre em `/lta-escola-creche`) e:

- defina `<body data-segmento="Escola ou creche" data-cidade="">`. O formulário já vem com o tipo
  selecionado e a mensagem do WhatsApp inclui o segmento e a cidade;
- ajuste `<title>`, meta description, canonical, H1 e os textos da seção "O que é";
- adicione a URL no `sitemap.xml`.

O valor de `data-segmento` precisa ser igual a uma das opções do campo "Tipo de estabelecimento".
