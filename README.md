# KJ-DBZ

Aplicativo front-end em React + Vite para explorar raças, poderes e colecionáveis do universo Dragon Ball.

## Segurança e boas práticas

- Nenhuma chave secreta, token ou API key foi deixada no front-end.
- Caso seja adicionado um backend real no futuro, qualquer credencial sensível deve ficar em variáveis de ambiente do servidor e nunca no bundle do cliente.
- O projeto usa armazenamento local somente para dados não-sensíveis do navegador (favoritos e coleção local).
- A coleção das esferas funciona como uma caça progressiva: o Radar do Dragão libera um enigma por vez, e somente a resposta correta confirma a esfera. Uma dica pode ser aberta em cada enigma; respostas erradas não consomem tentativas.
- Ao completar a coleção, o Guardião do Desejo abre uma cena animada e permite registrar um único desejo neste navegador. Como é uma experiência sem backend, esse progresso local não é uma recompensa protegida por conta.
- O build e o preview têm cabeçalhos de segurança para reduzir risco de execução de conteúdo malicioso.

## Estrutura

- `src/config/app.js`: configurações públicas do app e chaves de armazenamento.
- `src/utils/storage.js`: leitura e escrita sanitizadas de dados no localStorage.
- `src/components`: componentes visuais da interface.
- `public/images`: imagens locais do projeto.

## Variáveis de ambiente

Use o arquivo `.env.example` como referência. Nunca envie arquivos `.env` para o repositório.

## Caça às esferas

A versão da coleção foi atualizada para suportar os enigmas. O progresso manual salvo por versões anteriores é reiniciado uma vez; o desejo já concedido continua salvo separadamente no navegador.

## Imagens incluídas

As imagens locais das transformações ficam em `public/images/transformations/`. As sete imagens das Esferas do Dragão ficam em `public/images/dragon-balls/` como SVGs individuais. As imagens de transformação usam a arte Saiyajin já presente no projeto original como imagem provisória local; você pode substituir cada arquivo PNG pela arte específica de cada forma sem alterar o código.
