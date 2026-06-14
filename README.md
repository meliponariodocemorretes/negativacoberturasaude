# Cartilha web — Planos de Saúde: Conheça seus Direitos

Projeto estático pronto para publicação no GitHub Pages.

## Estrutura

```text
cartilha-planos-saude-site/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    └── images/
        ├── imagem-01.png
        ├── imagem-02.png
        ├── imagem-03.png
        ├── imagem-04.png
        ├── imagem-05.png
        ├── imagem-06.png
        ├── imagem-07.png
        ├── imagem-08.png
        ├── imagem-09.png
        └── imagem-10.png
```

## Como inserir as imagens

Coloque os arquivos PNG dentro de:

```text
assets/images/
```

com estes nomes exatos:

```text
imagem-01.png
imagem-02.png
imagem-03.png
imagem-04.png
imagem-05.png
imagem-06.png
imagem-07.png
imagem-08.png
imagem-09.png
imagem-10.png
```

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos os arquivos deste projeto para a raiz do repositório.
3. No GitHub, acesse **Settings > Pages**.
4. Em **Build and deployment**, escolha:
   - **Source:** Deploy from a branch
   - **Branch:** main
   - **Folder:** /root
5. Clique em **Save**.

Depois de alguns instantes, o GitHub fornecerá o endereço público da página.

## Observação sobre as imagens do passo 4

O código usa:

- `imagem-08.png` para o preenchimento com protocolo;
- `imagem-09.png` para o preenchimento sem protocolo;
- `imagem-10.png` para anexar documentos/finalizar e gerar protocolo.

Se os arquivos tiverem outros nomes, altere os caminhos correspondentes no `index.html`.
