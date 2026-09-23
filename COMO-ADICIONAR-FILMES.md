# Como adicionar filmes e séries ao JogaHub

Não é necessário editar o JavaScript para cada título. Envie os vídeos para a pasta principal **Filmes e Séries** ou para qualquer subpasta dentro dela.

## Filmes

Use nomes claros, preferencialmente com o ano:

```text
Filmes/Nome do Filme (2026).mp4
```

## Séries

Organize cada série em sua própria pasta e use temporadas e episódios no nome:

```text
Séries/Nome da Série/Temporada 1/S01E01 - Título.mp4
Séries/Nome da Série/Temporada 1/S01E02 - Título.mp4
```

Também são reconhecidos `T01E02`, `1x02`, `Episódio 2`, `Temporada 1` e `Season 1`.

## Atualizar o catálogo

1. O JogaHub 1.3.2 já traz a URL `/exec` deste acervo configurada.
2. Abra **Configurações** → **Acervo único do Google Drive** para conferir o endereço.
3. Clique em **Sincronizar agora** somente quando quiser forçar uma atualização imediata; o app também sincroniza automaticamente.
4. Se trocar a implantação do Apps Script, cole a nova URL `/exec` nesse campo e salve.

O sincronizador percorre todas as subpastas da única raiz configurada. Outras pastas do Google Drive não são consultadas.

Use apenas conteúdos que você tenha autorização para armazenar e reproduzir.